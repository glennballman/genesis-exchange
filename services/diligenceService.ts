import { DiligencePackage, DiligenceItem, DiligenceItemStatus, SuggestedEvidence, RequestMethod, InvestorProfile, DetailedInvestorAnalysis } from '../types';
import { parseDiligenceRequestList, findEvidenceForRequest, generateInvestorPreliminaryReport, analyzePrincipalWebsite } from './geminiService';
import { vaultStore } from './vaultStore';
import { vcFundPrincipals } from '../data/principals';
import { companyPrincipal } from '../data/principals';

const reverseDiligenceTemplate: Omit<DiligenceItem, 'id' | 'status' | 'suggestedResponse'>[] = [
    {
        authorId: companyPrincipal.id,
        category: 'Other',
        request: 'Which specific fund, investment mandate, or lending division is this opportunity being considered for?'
    },
    {
        authorId: companyPrincipal.id,
        category: 'Financials',
        request: 'What is your typical check size and your process for follow-on funding?'
    },
    {
        authorId: companyPrincipal.id,
        category: 'Other',
        request: 'What is your investment committee process and the anticipated timeline?'
    }
];

interface DiligenceService {
    createPackageFromText: (investorName: string, text: string, method: RequestMethod) => Promise<string>;
    getPackages: () => DiligencePackage[];
    getPackage: (id: string) => DiligencePackage | undefined;
    updateItemStatus: (packageId: string, itemId: string, status: DiligenceItemStatus) => void;
    updateItemEvidence: (packageId: string, itemId: string, evidence: SuggestedEvidence[]) => void;
    sharePackage: (packageId: string) => void;
    addFounderRequest: (packageId: string, request: string) => void;
    setInvestorPrincipal: (packageId: string, principalId: string) => void;
    confirmInvestorAndAnalyze: (packageId: string, url: string) => Promise<void>;
}

const packages: DiligencePackage[] = [];

const runInvestorCheck = async (pkg: DiligencePackage) => {
    const knownPrincipal = vcFundPrincipals.find(p => p.name.toLowerCase().includes(pkg.investorName.toLowerCase()));

    if (knownPrincipal) {
        pkg.investorProfile.status = 'GENESIS_PRINCIPAL';
        pkg.investorProfile.principalId = knownPrincipal.id;
    } else {
        try {
            const report = await generateInvestorPreliminaryReport(pkg.investorName);
            pkg.investorProfile.preliminaryReport = report;
            pkg.investorProfile.status = 'PENDING_CONFIRMATION';
        } catch (e) {
            console.error("Investor check failed:", e);
            pkg.investorProfile.preliminaryReport = {
                summary: "Automated background check failed to run.",
                cautionScore: 50,
                links: [],
            };
            pkg.investorProfile.status = 'PENDING_CONFIRMATION';
        }
    }
};

const processPackageInBackground = async (pkg: DiligencePackage, text: string) => {
    await runInvestorCheck(pkg);

    const parsedItems = await parseDiligenceRequestList(text);
    const investorItems = parsedItems.map(item => ({ ...item, authorId: 'investor', status: 'Pending', suggestedResponse: null } as DiligenceItem));
    
    const founderItems = reverseDiligenceTemplate.map(item => ({
        ...item,
        id: `founder-req-${Date.now()}-${Math.random()}`,
        status: 'Awaiting Response',
        suggestedResponse: null,
    } as DiligenceItem));

    const packageIndex = packages.findIndex(p => p.id === pkg.id);
    if (packageIndex === -1) return;

    packages[packageIndex].items = [...investorItems, ...founderItems];

    const allDocs = vaultStore.getState().documents;
    for (const item of investorItems) {
        const suggestion = await findEvidenceForRequest(item.request, allDocs);
        const currentPackage = packages[packageIndex];
        if (!currentPackage) continue;
        const itemIndex = currentPackage.items.findIndex(i => i.id === item.id);
        if (itemIndex > -1) {
            currentPackage.items[itemIndex].suggestedResponse = suggestion;
            currentPackage.items[itemIndex].status = 'Suggested';
        }
    }
};

const createDiligenceService = (): DiligenceService => {
    return {
        createPackageFromText(investorName, text, requestMethod) {
            return new Promise((resolve) => {
                const newPackage: DiligencePackage = {
                    id: `pkg-${Date.now()}`,
                    investorName,
                    investorProfile: { status: 'PENDING_VERIFICATION' },
                    createdAt: new Date().toISOString(),
                    status: 'Draft',
                    requestMethod,
                    items: [],
                };

                packages.unshift(newPackage);
                processPackageInBackground(newPackage, text);
                resolve(newPackage.id);
            });
        },
        getPackages() {
            return [...packages];
        },
        getPackage(id) {
            return packages.find(p => p.id === id);
        },
        updateItemStatus(packageId, itemId, status) {
            const pkg = packages.find(p => p.id === packageId);
            if (pkg) {
                const item = pkg.items.find(i => i.id === itemId);
                if (item) {
                    item.status = status;
                }
            }
        },
        updateItemEvidence(packageId, itemId, evidence) {
            const pkg = packages.find(p => p.id === packageId);
            if (pkg) {
                const item = pkg.items.find(i => i.id === itemId);
                if (item && item.suggestedResponse) {
                    item.suggestedResponse.evidence = evidence;
                }
            }
        },
        sharePackage(packageId) {
            const pkg = packages.find(p => p.id === packageId);
            if (pkg) {
                pkg.status = 'Shared';
                pkg.sharingLink = `https://genesis.exchange/diligence/view/${packageId}`;
                pkg.accessPasscode = Math.random().toString(36).substring(2, 8).toUpperCase();
            }
        },
        addFounderRequest(packageId, request) {
            const pkg = packages.find(p => p.id === packageId);
            if (pkg) {
                const newItem: DiligenceItem = {
                    id: `founder-req-${Date.now()}`,
                    authorId: companyPrincipal.id,
                    category: 'Other',
                    request,
                    status: 'Awaiting Response',
                    suggestedResponse: null,
                };
                pkg.items.push(newItem);
            }
        },
        setInvestorPrincipal(packageId, principalId) {
            const pkg = packages.find(p => p.id === packageId);
            if (pkg) {
                pkg.investorProfile.principalId = principalId;
                pkg.investorProfile.status = 'GENESIS_PRINCIPAL';
            }
        },
        async confirmInvestorAndAnalyze(packageId, url) {
            const pkg = packages.find(p => p.id === packageId);
            if (!pkg) return;

            pkg.investorProfile.status = 'CONFIRMED';
            pkg.investorProfile.confirmedUrl = url;
            
            // This would ideally trigger a UI update
            // Now run the deep analysis
            try {
                const analysis = await analyzePrincipalWebsite(url);
                pkg.investorProfile.detailedAnalysis = analysis;
            } catch (e) {
                console.error("Detailed investor analysis failed:", e);
                // Handle error state if needed
            }
        }
    };
};

export const diligenceService = createDiligenceService();
