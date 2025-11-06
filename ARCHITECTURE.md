# Application Architecture

This document provides a detailed overview of the technical architecture for the Genesis Exchange Platform. It explains how the different parts of the system interact to deliver a secure, scalable, and intelligent user experience.

## High-Level Diagram

The following diagram illustrates the primary components and data flows within the application.

```mermaid
graph TD
    subgraph "User's Browser"
        A[React Frontend]
    end

    subgraph "Google Cloud Platform"
        B[Firebase Hosting]
        C[Firestore Database]
        D[Server-Side Logic (Node.js)]
    end

    subgraph "External Services"
        E[Google Gemini AI]
    end

    A -- "Serves Static Assets (HTML, JS, CSS)" --> B;
    A -- "Real-time Data Sync (Firestore SDK)" --> C;
    A -- "HTTPS Request for AI tasks" --> D;
    D -- "Secure API Call (Server-to-Server)" --> E;
    D -- "Reads/Writes Data (Admin SDK)" --> C;
```

## Component Breakdown

### 1. Frontend (React + Vite)

*   **Framework:** The user interface is built using **React 18.3** and written in **TypeScript**. This provides a robust, component-based structure and enhances code quality with static typing.
*   **Build Tool:** **Vite** is used as the development server and build tool. It offers a significantly faster developer experience through its native ES module support.
*   **Routing:** Client-side navigation is handled by **React Router 6**, allowing for a seamless single-page application (SPA) experience.
*   **Styling:** **Tailwind CSS** is used for all styling. It's a utility-first framework that allows for rapid UI development directly within the HTML.
*   **Key Responsibilities:**
    *   Rendering all UI components.
    *   Managing client-side state (e.g., using Zustand for stores like `teamStore`, `adminStore`).
    *   Directly and securely interacting with the Firestore database for most data operations (reads and writes).
    *   Making HTTPS calls to our server-side logic for tasks requiring secure handling or private API keys.

### 2. Backend (Firebase & Firestore)

*   **Platform:** We are using **Firebase**, a Backend-as-a-Service (BaaS) platform from Google. This provides a suite of pre-built, scalable backend services.
*   **Hosting:** The compiled, static frontend assets (HTML, CSS, JavaScript) are deployed to **Firebase Hosting**. This provides a global CDN, ensuring fast and reliable delivery to users worldwide.
*   **Database:** **Firestore** is our primary database. It is a flexible, scalable NoSQL document database that allows for real-time data synchronization.
    *   **Data Model:** Data is organized into *collections* (e.g., `users`, `teams`, `achievements`) and *documents*. This model is highly flexible and can evolve with our application's needs.
    *   **Security:** Access to the database from the client-side is controlled by **Firestore Security Rules** (defined in `firestore.rules`). This is a critical security feature that prevents unauthorized data access. For example, a user can only write to their own profile.

### 3. Server-Side Logic (`server/index.js`)

*   **Purpose:** While most database interactions happen directly from the client, some operations require a secure, server-controlled environment. This is the role of our server-side logic, which is a simple Node.js application.
*   **Key Responsibilities:**
    *   **Protecting API Keys:** This is its most critical function. The `server/index.js` file is the *only* place where our Google Gemini API key is stored and used. This prevents the key from ever being exposed to the user's browser.
    *   **Executing Secure Tasks:** It receives requests from the frontend, communicates with the Gemini AI API, and then sends the results back to the client or stores them in Firestore.
    *   **Future Use:** This server logic can be expanded to handle other secure tasks, such as complex data migrations, integrations with other third-party services, or running computationally intensive jobs.

### 4. AI Integration (`services/geminiService.ts`)

*   **Role:** This TypeScript module acts as an intermediary or "service layer" between the React components and our AI capabilities.
*   **Function:**
    *   It abstracts the complexity of making AI-related API calls.
    *   A React component that needs an AI-powered summary doesn't know *how* to get it; it simply calls a function like `getAISummary()` from the `geminiService`.
    *   The `geminiService` then knows to make an HTTPS request to our own server-side logic (`/api/gemini`), which in turn securely calls the real Gemini API.
*   **Benefit:** This separation of concerns makes the code much cleaner and easier to maintain. If we ever wanted to switch AI providers, we would only need to update the logic in `server/index.js` and `geminiService.ts`, without changing any of the UI components.

This architecture provides a powerful combination of rapid development (thanks to Firebase and Vite), scalability, and security.
