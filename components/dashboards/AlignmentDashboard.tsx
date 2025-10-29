import React, { useState, useEffect } from 'react';
import { missionService } from '../../services/missionService';
import { teamStore } from '../../services/teamStore';
import { Mission, TeamAlignmentReport, User, IndividualAlignmentReport } from '../../types';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { alignmentService } from '../../services/alignmentService';
import IndividualAlignmentReportView from '../alignment/IndividualAlignmentReportView';

const StatCard: React.FC<{ title: string; value: string; icon: React.ComponentProps<typeof Icon>['name']; color: string }> = ({ title, value, icon, color }) => (
    <Card className={`!p-4 border-${color}-500/20`}>
        <div className="flex items-center gap-3">
            <Icon name={icon} className={`w-6 h-6 text-${color}-400`} />
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    </Card>
);

const AlignmentDashboard: React.FC = () => {
    const [companyMission, setCompanyMission] = useState<Mission | null>(null);
    const [alignmentReport, setAlignmentReport] = useState<TeamAlignmentReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUserReport, setSelectedUserReport] = useState<IndividualAlignmentReport | null>(null);

    useEffect(() => {
        const mission = missionService.getCompanyMission();
        setCompanyMission(mission);
        handleAnalyzeAlignment(mission);
    }, []);

    const handleAnalyzeAlignment = async (mission: Mission) => {
        setAlignmentReport(null);
        setIsLoading(true);
        try {
            const report = await alignmentService.getTeamAlignmentReport(mission, teamStore.getTeam());
            setAlignmentReport(report);
        } catch (error) {
            console.error("Failed to generate alignment report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (selectedUserReport) {
        return <IndividualAlignmentReportView report={selectedUserReport} onClose={() => setSelectedUserReport(null)} />;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Team Alignment Dashboard</h1>
                <p className="mt-1 text-gray-400">Measure and visualize the congruence between your company's mission and your team's ambition.</p>
            </div>

            {companyMission && (
                <Card>
                    <div className="flex items-center gap-4">
                        <Icon name="logo" className="w-10 h-10 text-cyan-400" />
                        <div>
                            <h2 className="text-xl font-semibold text-white">Company Mission</h2>
                            <p className="text-gray-300">{companyMission.statement}</p>
                        </div>
                    </div>
                </Card>
            )}

            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin h-12 w-12 border-4 border-purple-400 border-t-transparent rounded-full"></div>
                    <p className="mt-4 text-gray-300">Analyzing Team Alignment...</p>
                </div>
            ) : alignmentReport ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Team Alignment Score" value={`${alignmentReport.teamAlignmentScore}%`} icon="horizon" color="green" />
                        <StatCard title="Team Ambition Index" value={`${alignmentReport.teamAmbitionIndex}/100`} icon="gump" color="amber" />
                        <StatCard title="Team Transparency Index" value={`${alignmentReport.teamTransparencyIndex}%`} icon="verified" color="sky" />
                    </div>
                    <Card>
                        <h3 className="text-lg font-semibold text-white mb-2">AI Executive Summary</h3>
                        <p className="text-sm text-gray-400 italic p-3 bg-slate-900/50 rounded-md border-l-2 border-slate-600">{alignmentReport.executiveSummary}</p>
                    </Card>
                    <Card className="!p-0">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-white">Alignment Heatmap</h3>
                            <p className="text-sm text-gray-400">Click a team member to view their detailed alignment report.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-400 uppercase bg-slate-900/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Team Member</th>
                                        <th scope="col" className="px-6 py-3 text-center">Mission Alignment</th>
                                        <th scope="col" className="px-6 py-3 text-center">Ambition Index</th>
                                        <th scope="col" className="px-6 py-3 text-center">Transparency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alignmentReport.individualReports.map(report => (
                                        <tr key={report.userId} className="border-b border-slate-700 hover:bg-slate-800/40 cursor-pointer" onClick={() => setSelectedUserReport(report)}>
                                            <td className="px-6 py-4 font-medium text-white">{report.userName}</td>
                                            <td className="px-6 py-4 text-center font-mono text-green-300">{report.missionAlignmentScore}%</td>
                                            <td className="px-6 py-4 text-center font-mono text-amber-300">{report.ambitionIndex}/100</td>
                                            <td className="px-6 py-4 text-center font-mono text-sky-300">{report.transparencyIndex}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </>
            ) : (
                <Card className="text-center py-12">
                    <Icon name="info" className="w-12 h-12 mx-auto text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-white">Could Not Generate Report</h3>
                    <p className="text-gray-400 mt-1">There was an error generating the team alignment report. Please try again later.</p>
                </Card>
            )}
        </div>
    );
};

export default AlignmentDashboard;
