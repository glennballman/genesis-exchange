
import { DocumentPermission, PermissionLevel } from '../types';

interface PermissionsStore {
    addPermission: (docId: string, investorId: string, level: PermissionLevel, expiresAt?: string) => void;
    getPermissionsForDocument: (docId: string) => DocumentPermission[];
    getPermissionsForInvestor: (investorId: string) => DocumentPermission[];
    revokePermission: (permissionId: string) => void;
}

const createPermissionsStore = (): PermissionsStore => {
    const permissions: DocumentPermission[] = [];

    // Add some initial permissions for demonstration
    permissions.push({ id: 'perm-init-1', documentId: 'doc-1', investorId: 'inv-asgard', level: 'FULL_ACCESS' });
    permissions.push({ id: 'perm-init-2', documentId: 'doc-4', investorId: 'inv-asgard', level: 'VIEW_WITH_REDACTIONS' });


    return {
        addPermission: (docId, investorId, level, expiresAt) => {
            // Prevent duplicate permissions
            const existing = permissions.find(p => p.documentId === docId && p.investorId === investorId);
            if (existing) {
                console.log("Permission already exists for this investor and document.");
                return;
            }

            const newPermission: DocumentPermission = {
                id: `perm-${Date.now()}`,
                documentId: docId,
                investorId,
                level,
                expiresAt,
            };
            permissions.push(newPermission);
        },
        getPermissionsForDocument: (docId) => {
            return permissions.filter(p => p.documentId === docId);
        },
        getPermissionsForInvestor: (investorId: string) => {
            return permissions.filter(p => p.investorId === investorId);
        },
        revokePermission: (permissionId) => {
            const index = permissions.findIndex(p => p.id === permissionId);
            if (index > -1) {
                permissions.splice(index, 1);
            }
        }
    };
};

export const permissionsStore = createPermissionsStore();
