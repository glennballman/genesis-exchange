# Genesis Exchange: The Alignment & Diligence Engine

A prototype platform featuring a world-class system for quantifying human potential (IGS), analyzing strategic alignment between entities, and managing a secure, AI-powered mutual diligence process.

## 🚀 Features

### Core Systems

1. **IGS (Individual GUMP Score System)**
   - Quantifies human potential through proven execution and pillars of potential
   - Tracks achievements, goals, and interests
   - Team chemistry multipliers

2. **Due Diligence Engine**
   - AI-powered mutual diligence process
   - Seven specialized vaults (IP, Financials, Market, Team, Product, Legal, Exit)
   - Intelligent document analysis and evidence suggestions
   - Secure sharing with granular access controls

3. **Alignment Engine**
   - Strategic matching between Users, Companies, Projects, VC Funds, and Institutions
   - Mission statement analysis
   - Financial and advisory alignment scoring
   - Team alignment reports

4. **Role-Specific Dashboards**
   - Master Dashboard
   - CTO Dashboard (Tech Stack, Roadmap)
   - CFO Dashboard (Financials, Runway)
   - CMO Dashboard (Marketing Metrics, CAC/LTV)
   - Team Management
   - Score Tracking and Insights

## 🛠️ Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or extract the project files

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your Google Gemini API key:
   ```
   VITE_API_KEY=your_api_key_here
   ```
   - Get your API key from: https://aistudio.google.com/app/apikey

### Running the Development Server

```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
/
├── components/
│   ├── alignment/          # Alignment report components
│   ├── charts/             # Data visualization components
│   ├── dashboards/         # Role-specific dashboards
│   ├── diligence/          # Due diligence hub and features
│   ├── docs/               # Documentation (GEPN, Roadmap)
│   ├── insights/           # IP analysis and insights
│   ├── layout/             # App layout and sidebar
│   ├── score/              # Score detail and learning modules
│   ├── team/               # Team management components
│   ├── ui/                 # Reusable UI components
│   ├── vaults/             # Document vault components
│   └── wizard/             # Onboarding intake wizard
├── data/
│   ├── genesisData.ts      # Genesis Score data structure
│   └── principals.ts       # Sample principals data
├── services/
│   ├── geminiService.ts    # Google Gemini AI integration
│   ├── alignmentService.ts # Alignment scoring logic
│   ├── diligenceService.ts # Diligence package management
│   ├── scoreService.ts     # Score calculation logic
│   └── [various stores]    # State management stores
├── App.tsx                 # Main application router
├── types.ts                # TypeScript type definitions
└── index.tsx               # Application entry point
```

## 🔑 Key Technologies

- **React 18.3** - UI framework
- **React Router 6** - Client-side routing
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling (via CDN)
- **Recharts** - Data visualization
- **Google Gemini AI** - AI-powered features
- **Marked** - Markdown rendering

## 🧪 AI Features

The platform uses Google's Gemini AI (Vertex AI) for:

- **Proactive Pulse Engine**: Analyzes company data to identify opportunities and threats
- **IGS Calculation**: Estimates Individual GUMP Scores based on achievements
- **Document Analysis**: Extracts insights from uploaded documents
- **IP Analysis**: Comprehensive patent and IP evaluation
- **Alignment Scoring**: Calculates strategic alignment between entities
- **Due Diligence Automation**: Suggests evidence and responses for diligence requests
- **Team Summaries**: Generates professional summaries from achievements

## 📝 Notes

- The application uses a mock data structure for demonstration purposes
- AI features require a valid Google Gemini API key
- Some features may require additional configuration for production use

## 🔒 Security

- Environment variables are used for sensitive configuration
- Document permissions support multiple access levels
- Passcode-protected sharing for diligence packages

## 🗺️ Roadmap

See `components/docs/Roadmap.md` for the full product roadmap and planned features.

## 📄 License

Copyright © 2024 Genesis Exchange. All rights reserved.
