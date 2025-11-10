import React from 'react';

const RoadmapDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Project Roadmap & Next Steps</h1>
      <p className="text-lg text-gray-400 mb-10 text-center">This document outlines the strategic recommendations and next steps for the Genesis Exchange Platform. It will serve as our guide for future development priorities.</p>

      <div className="space-y-12">
        
        {/* Section 1 */}
        <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-6">1. Focus on End-to-End Feature Validation</h2>
          <p className="text-gray-300 mb-6">The immediate priority is to ensure that the core AI-powered features are not just built, but are fully functional and reliable from end-to-end.</p>
          <ul className="space-y-6">
            <li className="bg-gray-700 p-4 rounded-md">
              <h3 className="text-xl font-bold mb-2">Deep-Dive into Due Diligence Automation:</h3>
              <ul className="list-disc list-inside space-y-2 pl-4 text-gray-400">
                <li>Conduct a thorough review of the entire background process in <code>diligenceService.ts</code>.</li>
                <li>Validate that the service correctly parses requests, automatically finds evidence, suggests responses using Gemini AI, and reliably populates the "Diligence Package."</li>
                <li>Prioritize testing this feature with a wide variety of inputs to ensure accuracy and robustness.</li>
              </ul>
            </li>
            <li className="bg-gray-700 p-4 rounded-md">
              <h3 className="text-xl font-bold mb-2">Systematically Validate All AI Outputs:</h3>
              <ul className="list-disc list-inside space-y-2 pl-4 text-gray-400">
                <li>Create an internal "testing ground" dashboard or a series of scripts.</li>
                <li>Use this tool to validate the quality of AI-generated content for features like IGS Calculation, Document Analysis, and IP Analysis.</li>
                <li>This will be crucial for tuning prompts and ensuring the AI provides genuinely valuable insights.</li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-6">2. Introduce a Robust Testing Framework</h2>
          <p className="text-gray-300 mb-6">To ensure long-term quality and stability, we need to integrate a testing framework into the project.</p>
          <div>
            <h3 className="text-xl font-bold mb-4">Action Items:</h3>
            <ol className="list-decimal list-inside space-y-2 pl-4 text-gray-400">
              <li>Integrate <strong>Vitest</strong> as the primary testing framework.</li>
              <li>Begin by writing <strong>unit tests</strong> for critical business logic in the <code>/services</code> directory (e.g., <code>diligenceService.ts</code>, <code>igsService.ts</code>).</li>
              <li>Start writing <strong>component tests</strong> for complex UI components like the <code>IndividualIntakeWizard.tsx</code> and <code>DiligenceHub.tsx</code>.</li>
            </ol>
          </div>
        </div>

        {/* Section 3 */}
        <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-6">3. Enhance the New User Onboarding Experience</h2>
          <p className="text-gray-300 mb-6">A smooth onboarding process is critical for user adoption and for gathering the data needed to power the platform's analytics.</p>
          <div>
            <h3 className="text-xl font-bold mb-4">Action Items:</h3>
            <ul className="list-disc list-inside space-y-2 pl-4 text-gray-400">
              <li>Thoroughly test the entire <code>IndividualIntakeWizard.tsx</code> from a new user's perspective.</li>
              <li>Consider creating a "Company Intake Wizard" to onboard new organizations.</li>
            </ul>
          </div>
        </div>

        {/* Section 4 */}
        <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-6">4. Add In-Code Documentation and Refine Data Models</h2>
          <p className="text-gray-300 mb-6">Improving documentation within the code and for the data models will be essential for maintainability and future development.</p>
          <div>
            <h3 className="text-xl font-bold mb-4">Action Items:</h3>
            <ul className="list-disc list-inside space-y-2 pl-4 text-gray-400">
              <li>Use <strong>JSDoc comments</strong> (<code>/** ... */</code>) to document major components and service functions.</li>
              <li>Create a dedicated <code>DATA_MODEL.md</code> file to document the Firestore database schema.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RoadmapDashboard;
