# Genesis Exchange Development Roadmap
**Build v0.3 - October 26, 2025, 5:36 PM**

This document summarizes the state of the Genesis Exchange platform, including all major features implemented and designed to date.

---

### **Phase 1: Core Functionality & Data Layer (v0.1 - v0.2)**

This phase focused on building the foundational UI/UX and data management capabilities of the platform.

- **[Done] Core Dashboards & Navigation:** Implemented the Command Center, C-Suite HUDs, and all primary navigation, establishing the application's core structure.
- **[Done] DD Vaults & Document Intelligence:** Created specialized vaults and integrated AI for initial document classification, summary, and IP analysis.
- **[Done] Team & Individual Profile Management:** Built the "mini resume builder" for capturing detailed user achievements, goals, and interests.
- **[Done] Discovery & Matching Engine (v1):** Implemented the initial version of the Discovery dashboard for matching startups with investors based on high-level alignment.
- **[Done] Live Diligence Room (v1):** Created the initial version of the Diligence Hub, allowing for AI-powered parsing of request lists and a shared workspace for responding to items.

---

### **Phase 2: Strategic Design & Architectural Refinement (v0.3)**

This phase represents a major strategic evolution, focusing on the deep design of the platform's core "human capital" and alignment engines. The following systems have been fully designed and are ready for implementation.

- **[Designed] Genesis Score 3.0 - The Catalyst Model:**
  - A complete redesign of the 1,000,000-point scoring system.
  - **Pillar 1: Foundational Momentum (400k pts):** Rewards early-stage entrepreneurs for clarity of purpose, knowledge acquisition (GUMP), and inherent ambition/grit (IGS), independent of formal business assets.
  - **Pillar 2: Execution & Traction (400k pts):** Measures real-world results, including team strength, market validation, and the quality of the asset moat.
  - **Pillar 3: Resilience & Adaptability (200k pts):** A dynamic score that measures a company's proactive adaptation and awareness of external market/regulatory trends, ensuring no score can be "maxed out."
  - **Formula:** `Genesis Score = (Pillar A + Pillar B + Pillar C)` (Simplified for testing, with the final model intended to be multiplicative).

- **[Designed] The Universal Alignment & Mission Cascade Engine:**
  - **The `Principal` Model:** An abstraction where any entity (User, Project, Company, VC Fund, Institution) is treated as a `Principal` with a `missionStatement`, `values`, and `exclusions`. This allows for fractal alignment calculations.
  - **The Mission Hierarchy:** A system for companies and institutions to define their top-level mission and nest specific project or fund missions underneath it.
  - **The Universal Alignment Engine:** A core AI service (`calculateAlignment`) that can measure the congruence between any two `Principals` based on their mission, values, and the ambition of their teams.

- **[Designed] The Reciprocal Diligence & Live Alignment Workspace:**
  - **Mutual Diligence Room:** The Diligence Hub is reframed as a shared workspace where both founders and investors can add requests to a **Unified Checklist**.
  - **Proactive Reverse Diligence:** The system automatically provides founders with a "Reverse Diligence Template" to ask critical questions of investors.
  - **Interactive Investor Verification:** A non-blocking, two-phase workflow in the "Overall Alignment" tab where the founder can confirm or correct the AI's initial background check on an investor before a deep analysis is performed.
  - **Live Alignment Report:** A dynamic card within the Diligence Room that shows the real-time alignment score between a specific founder project and a specific investor fund, which can be updated mid-diligence.

---

### **Phase 3: Future Implementation & GEPN Rollout**

The next phase will focus on coding the approved designs from Phase 2 and beginning the rollout of the Genesis Exchange Partner Network (GEPN).

- **[Todo] Implement Genesis Score 3.0:** Refactor all scoring services and UI components to use the new Catalyst Model.
- **[Todo] Implement the Universal Alignment Engine:** Build the "Mission Control" dashboard and fully integrate the multi-level alignment reports into the Diligence Room and Discovery dashboard.
- **[Todo] GEPN Phase 1 - Foundation & Validation:**
  - Develop a partner onboarding UI for managing sponsored links.
  - Implement analytics to track engagement with partner links.
- **[Todo] GEPN Phase 2 - Keystone Partner Integration:**
  - Build the core OAuth 2.0 infrastructure and the initial version of the Genesis Partner API.
  - Implement a pilot integration with a recruiting or legal tech partner.
- **[Todo] GEPN Phase 3 - Developer Portal & Scale:**
  - Launch a public developer portal for self-service partner integration.
  - Onboard Tier 2 (Embedded Experience) partners.
