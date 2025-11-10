# Project Roadmap & Next Steps

This document outlines the strategic recommendations and next steps for the Genesis Exchange Platform. It will serve as our guide for future development priorities.

## 1. Focus on End-to-End Feature Validation

The immediate priority is to ensure that the core AI-powered features are not just built, but are fully functional and reliable from end-to-end.

-   **Deep-Dive into Due Diligence Automation:**
    -   Conduct a thorough review of the entire background process in `diligenceService.ts`.
    -   Validate that the service correctly parses requests, automatically finds evidence, suggests responses using Gemini AI, and reliably populates the "Diligence Package."
    -   Prioritize testing this feature with a wide variety of inputs to ensure accuracy and robustness.

-   **Systematically Validate All AI Outputs:**
    -   Create an internal "testing ground" dashboard or a series of scripts.
    -   Use this tool to validate the quality of AI-generated content for features like IGS Calculation, Document Analysis, and IP Analysis.
    -   This will be crucial for tuning prompts and ensuring the AI provides genuinely valuable insights.

## 2. Introduce a Robust Testing Framework

To ensure long-term quality and stability, we need to integrate a testing framework into the project.

-   **Action Items:**
    1.  Integrate **Vitest** as the primary testing framework.
    2.  Begin by writing **unit tests** for critical business logic in the `/services` directory (e.g., `diligenceService.ts`, `igsService.ts`).
    3.  Start writing **component tests** for complex UI components like the `IndividualIntakeWizard.tsx` and `DiligenceHub.tsx`.

## 3. Enhance the New User Onboarding Experience

A smooth onboarding process is critical for user adoption and for gathering the data needed to power the platform's analytics.

-   **Action Items:**
    -   Thoroughly test the entire `IndividualIntakeWizard.tsx` from a new user's perspective.
    -   Consider creating a "Company Intake Wizard" to onboard new organizations.

## 4. Add In-Code Documentation and Refine Data Models

Improving documentation within the code and for the data models will be essential for maintainability and future development.

-   **Action Items:**
    -   Use **JSDoc comments** (`/** ... */`) to document major components and service functions.
    -   Create a dedicated `DATA_MODEL.md` file to document the Firestore database schema.
