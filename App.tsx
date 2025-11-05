
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import MasterDashboard from './components/dashboards/MasterDashboard';
import CTODashboard from './components/dashboards/CTODashboard';
import CFODashboard from './components/dashboards/CFODashboard';
import CMODashboard from './components/dashboards/CMODashboard';
import IntakeWizard from './components/wizard/IntakeWizard';
import IndividualIntakeWizard from './components/wizard/IndividualIntakeWizard';
import GenesisScoreDetail from './components/dashboards/GenesisScoreDetail';
import DiligenceHub from './components/diligence/DiligenceHub';
import ScoreCalculationDetail from './components/dashboards/ScoreCalculationDetail';
import SavedInsightsDashboard from './components/dashboards/SavedInsightsDashboard';
import ActionPlanDashboard from './components/dashboards/ActionPlanDashboard';
import UserProfileDashboard from './components/dashboards/UserProfileDashboard';
import TeamDashboard from './components/dashboards/TeamDashboard';
import VaultsDashboard from './components/dashboards/VaultsDashboard';
import VaultDetailDashboard from './components/dashboards/VaultDetailDashboard';
import DocumentationDashboard from './components/dashboards/DocumentationDashboard';
import RoadmapDashboard from './components/dashboards/RoadmapDashboard';
import AlignmentDashboard from './components/dashboards/AlignmentDashboard';
import DiscoveryDashboard from './components/dashboards/DiscoveryDashboard';
import DiligencePackageView from './components/diligence/DiligencePackageView';
import GreenScreen from './components/GreenScreen';
import AdminDashboard from './components/dashboards/AdminDashboard';
import AdminPrincipals from './components/dashboards/AdminPrincipals';
import AdminUserManagement from './components/dashboards/AdminUserManagement';
import AdminWorkflows from './components/dashboards/AdminWorkflows';
import { useAdminStore } from './services/adminStore';
import IndividualPrincipalDetail from './components/dashboards/principals/IndividualPrincipalDetail';
import { PrincipalProvider } from './services/PrincipalProvider';

const App: React.FC = () => {
  const { isAdminMode } = useAdminStore();

  return (
    <HashRouter>
      <PrincipalProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            {isAdminMode ? (
              <>
                <Route index element={<AdminDashboard />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/principals" element={<AdminPrincipals />} />
                <Route path="admin/principal/:id" element={<IndividualPrincipalDetail />} />
                <Route path="admin/users" element={<AdminUserManagement />} />
                <Route path="admin/workflows" element={<AdminWorkflows />} />
              </>
            ) : (
              <>
                <Route index element={<MasterDashboard />} />
                <Route path="genesis-score" element={<GenesisScoreDetail />} />
                <Route path="score-calculation" element={<ScoreCalculationDetail />} />
                <Route path="saved-insights" element={<SavedInsightsDashboard />} />
                <Route path="action-plan" element={<ActionPlanDashboard />} />
                <Route path="profile" element={<UserProfileDashboard />} />
                <Route path="team" element={<TeamDashboard />} />
                <Route path="vaults" element={<VaultsDashboard />} />
                <Route path="vaults/:vaultId" element={<VaultDetailDashboard />} />
                <Route path="cto" element={<CTODashboard />} />
                <Route path="cfo" element={<CFODashboard />} />
                <Route path="cmo" element={<CMODashboard />} />
                <Route path="due-diligence" element={<DiligenceHub />} />
                <Route path="diligence/:packageId" element={<DiligencePackageView />} />
                <Route path="documentation" element={<DocumentationDashboard />} />
                <Route path="roadmap" element={<RoadmapDashboard />} />
                <Route path="alignment" element={<AlignmentDashboard />} />
                <Route path="discovery" element={<DiscoveryDashboard />} />
                <Route path="discovery/principal/:id" element={<IndividualPrincipalDetail />} />
                <Route path="green-screen" element={<GreenScreen />} />
              </>
            )}
          </Route>
          {/* The wizards have their own layout, so they're separate routes */}
          <Route path="/intake-wizard" element={<IntakeWizard />} />
          <Route path="/individual-intake-wizard" element={<IndividualIntakeWizard />} />
        </Routes>
      </PrincipalProvider>
    </HashRouter>
  );
};

export default App;
