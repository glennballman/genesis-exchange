# Genesis Exchange Platform (GEP)

The Genesis Exchange Platform is a strategic management tool that leverages AI to provide deep insights into company alignment, team composition, and individual potential. It is designed to help organizations make smarter decisions about their people, projects, and overall strategy.

## 📜 Description

This platform provides a suite of dashboards and tools for:

*   **Discovery:** Analyzing market trends, competitive landscapes, and internal capabilities.
*   **Team & Individual Analysis:** Assessing the skills, achievements, and potential of team members.
*   **Alignment Scoring:** Quantifying how well individuals and teams align with strategic goals.
*   **Due Diligence:** Automating and streamlining the due diligence process for investments and partnerships.

## ✨ Features

*   **Role-Based Dashboards:** Customized views for Admins, Team Members, and general users.
*   **Team Management:** Tools for building and analyzing teams.
*   **Individual Profiles:** Detailed profiles for every user, showcasing their skills, goals, and "Individual GUMP Score" (IGS).
*   **AI-Powered Insights:** Deep analysis and summaries powered by Google's Gemini AI.
*   **Secure Data:** All data is stored and secured using Firebase and Firestore.

## 🚀 Getting Started

1.  **Clone the repository:** `git clone https://github.com/glennballman/genesis-exchange.git`
2.  **Install dependencies:** `npm install`
3.  **Run the development server:** `npm run dev`

## 🏗️ Architecture

The application uses a modern web stack with a serverless backend.

```
[React Frontend] <--> [Firebase Hosting] <--> [Firestore Database]
       |                                           ^
       |                                           |
       +----------------> [Server-Side Logic] -----+
                         (for secure API calls
                          like Gemini AI)
```

A more detailed explanation is available in `ARCHITECTURE.md`.

## Build History

*   **Stable Build November 9 2025 2:45PM:** Corrected multiple missing dependencies in the `package.json` file (`recharts`, `marked`, `zustand`) that were causing build failures. The application was successfully deployed to Firebase Hosting.
*   **Stable Build November 5 2025 555PM:** Fixed a critical bug where new users were not being created correctly. The sign-up process now correctly creates an authentication user and a corresponding document in the `principals` collection.
*   **Stable Build November 6 2024 1100AM:** Major architectural update. Integrated Firebase and Firestore for backend data storage, authentication, and hosting. Merged all `Vertex` branch features (Team Management, Role-Based Dashboards, Gemini Integration) into `main`.
*   **Stable Build November 5 2024 1034AM:** Fixed a significant layout bug in the reusable `Card` component. The flexbox alignment was changed from `justify-between` to `justify-start`, resolving a vertical spacing issue.
*   **Stable Build November 5 2024 235AM:** All AI-powered features are temporarily handled by internal mock data in `services/geminiService.ts`. This allows for stable front-end development without requiring live API keys.

## 📁 Project Structure

*(A brief explanation of the key directories)*

-   `/src`: Main application source code.
-   `/components`: Reusable React components.
    -   `/dashboards`: Components for the main user dashboards.
    -   `/layout`: Components for the overall page structure (Sidebar, etc.).
    -   `/modals`: Modal dialog components.
-   `/services`: Modules for interacting with backend services (Firebase, AI, etc.).
-   `/server`: Server-side code for secure operations.
-   `firebase.ts`: Firebase configuration and initialization.
-   `firestore.rules`: Security rules for the Firestore database.

## 🔑 Key Technologies

-   **React 18.3** - UI framework
-   **React Router 6** - Client-side routing
-   **TypeScript** - Type safety
-   **Vite** - Build tool and dev server
-   **Firebase** - Backend-as-a-Service (Hosting, DB, Auth)
-   **Firestore** - NoSQL document database
-   **Tailwind CSS** - Styling
-   **Recharts** - Data visualization
-   **Google Gemini AI** - AI-powered features
-   **Marked** - Markdown rendering

## 🧪 AI Features

The platform uses Google's Gemini AI for:

-   **Proactive Pulse Engine**: Analyzes company data to identify opportunities and threats
-   **IGS Calculation**: Estimates Individual GUMP Scores based on achievements
-   **Document Analysis**: Extracts insights from uploaded documents
-   **IP Analysis**: Comprehensive patent and IP evaluation
-   **Alignment Scoring**: Calculates strategic alignment between entities
-   **Due Diligence Automation**: Suggests evidence and responses for diligence requests
-   **Team Summaries**: Generates professional summaries from achievements

## 📝 Notes
