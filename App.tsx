import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import MasterDashboard from './components/dashboards/MasterDashboard';
import CTODashboard from './components/dashboards/CTODashboard';
import CFODashboard from './components/dashboards/CFODashboard';
import CMODashboard from './components/dashboards/CMODashboard';
import IntakeWizard from './components/wizard/IntakeWizard';
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

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
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
        </Route>
        {/* The wizard has its own layout, so it's a separate route */}
        <Route path="/intake-wizard" element={<IntakeWizard />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
