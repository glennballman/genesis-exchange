
import { ActionPlanItem, ActionPlanStatus, TakeActionPlan, User, ScoreComponent, ImprovementTips } from '../types';

interface ActionPlanStore {
    addActionItem: (itemData: { concept: string; scoreComponent: ScoreComponent; aiSummary: string; takeActionPlan: TakeActionPlan; improvementTips: ImprovementTips; assignedTo: User; gumpPointsAvailable: number; }) => void;
    delegateItem: (itemId: string, delegatedFrom: User, delegatedTo: User) => void;
    updateItemStatus: (itemId: string, status: ActionPlanStatus) => void;
    getItemsForUser: (userId: string) => ActionPlanItem[];
    getAllItems: () => ActionPlanItem[];
}

const createActionPlanStore = (): ActionPlanStore => {
    const actionItems: ActionPlanItem[] = [];

    return {
        addActionItem: (itemData) => {
            if (actionItems.some(i => i.concept === itemData.concept && i.assignedTo.id === itemData.assignedTo.id)) {
                console.log("Action item for this concept already exists for this user.");
                return;
            }
            
            const newItem: ActionPlanItem = {
                ...itemData,
                id: `ap-${Date.now()}`,
                status: 'Todo',
                delegationHistory: [],
                createdAt: new Date().toISOString(),
            };
            actionItems.unshift(newItem);
        },

        delegateItem: (itemId, delegatedFrom, delegatedTo) => {
            const itemIndex = actionItems.findIndex(i => i.id === itemId);
            if (itemIndex > -1) {
                const item = actionItems[itemIndex];
                item.assignedTo = delegatedTo;
                item.delegationHistory.push({
                    delegatedFrom,
                    delegatedTo,
                    timestamp: new Date().toISOString(),
                });
                actionItems[itemIndex] = item;
            }
        },

        updateItemStatus: (itemId, status) => {
            const itemIndex = actionItems.findIndex(i => i.id === itemId);
            if (itemIndex > -1) {
                actionItems[itemIndex].status = status;
            }
        },

        getItemsForUser: (userId) => {
            return actionItems.filter(item => item.assignedTo.id === userId);
        },

        getAllItems: () => {
            return [...actionItems];
        }
    };
};

export const actionPlanStore = createActionPlanStore();
