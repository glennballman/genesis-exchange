
const express = require('express');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { VertexAI } = require('@google-cloud/vertexai');

admin.initializeApp();
const db = admin.firestore();
const app = express();

app.use(express.json());

// --- Mock Data (for other endpoints) ---
const mockVaultDocuments = [
    { id: 'doc1', vaultId: 'legal', name: 'Incorporation Agreement', type: 'pdf', uploadedAt: '2023-10-26' },
];
const mockScoreComponents = [
    { category: 'IP', item: 'Patents', points: 100, max_points: 200 },
];
const mockScoreHistory = [
    { date: '2023-01-01', score: 500 },
];
const mockCompletedModules = [
    { id: 'm1', name: 'Introduction to Genesis', completedAt: '2023-10-01' },
];

const genesisScoreData = {
  name: "Genesis Score (v3.0 - 1,000,000 Max Score)",
  max_score: 1000000,
  scoring_layers: [
    {
      layer_name: "Base Pillars (700,000 points total)",
      description: "Scaled v2.5 score for timeless moats, based on traditional diligence categories.",
      pillars: [
        { name: "Team", max_points: 150000, details: "Management experience, education, previous exits, specific roles.", current_points: 125000 },
        { name: "IP", max_points: 100000, details: "Patents (received/pending), trademarks, trade secrets, holder employment.", current_points: 75000 },
        { name: "DD Preparedness", max_points: 150000, details: "Completeness of DD documents (biz plan, investor deck), financial granularity.", current_points: 140000 },
        { name: "Distribution/Market", max_points: 100000, details: "E-commerce presence, product market fit validation, market value, customer base.", current_points: 60000 },
        { name: "Traction/Health", max_points: 150000, details: "Revenue (historical/projected), profitability, cash runway, burn rate.", current_points: 95000 },
        { name: "GUMP (Genesis U Mastery Pillar)", max_points: 50000, details: "Soft skills, vocabulary, investor relations, legal compliance training.", current_points: 35000 }
      ]
    }
  ],
  nuance_overlays: [
    {
      layer_name: "Nuance Overlays (300,000 points total)",
      description: "Dynamic multipliers for specific strategic advantages or contextual relevance.",
      overlays: [
        { name: "Stealth Moat Layer (SML)", max_points: 100000, details: "Quantifies non-public, defensible advantages (e.g., classified grants, security clearances).", current_points: 80000 },
        { name: "Cultural Fluency Layer (CFL / GUMP)", max_points: 100000, details: "Measures mastery of investor-specific cultural cues, soft skills, and vocabulary.", current_points: 45000 },
        { name: "Regulatory Tailwind Layer (RTL)", max_points: 100000, details: "Scores impact of legislative/government changes as positive or negative multipliers.", current_points: 20000 }
      ]
    }
  ],
  innovation_horizon: [
    {
        layer_name: "Innovation Horizon (Potential)",
        description: "Headroom for dynamic, future-proof additions and game-changing technologies.",
        modules: [
          { name: "AI/Compute Wave", details: "Agentic AI, hybrid AI ethics, quantum AI integration." },
          { name: "Quantum/Secure Tech", details: "Quantum-safe encryption, entangled sim readiness." },
          { name: "Reg/Sustain Shifts", details: "SEC 2.0 leverage, carbon audit moats." }
        ]
    }
  ]
};

// --- Team Management Firestore Endpoints ---

// GET all team members
app.get('/api/team', async (req, res) => {
    try {
        const snapshot = await db.collection('teamMembers').get();
        const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(members);
    } catch (error) {
        console.error("Error fetching team members:", error);
        res.status(500).send({ error: 'Failed to fetch team members' });
    }
});

// POST a new team member
app.post('/api/team', async (req, res) => {
    try {
        const { name, title, avatar } = req.body;
        if (!name || !title) {
            return res.status(400).send({ error: 'Name and title are required' });
        }
        const newMember = {
            name,
            title,
            avatar: avatar || '/avatars/default.jpg',
        };
        const docRef = await db.collection('teamMembers').add(newMember);
        res.status(201).json({ id: docRef.id, ...newMember });
    } catch (error) {
        console.error("Error adding team member:", error);
        res.status(500).send({ error: 'Failed to add team member' });
    }
});

// PUT (update) a team member
app.put('/api/team/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, title } = req.body;
        const memberRef = db.collection('teamMembers').doc(id);
        const doc = await memberRef.get();

        if (!doc.exists) {
            return res.status(404).send({ error: 'Team member not found' });
        }

        await memberRef.update({ name, title });
        res.json({ id, name, title });
    } catch (error) {
        console.error("Error updating team member:", error);
        res.status(500).send({ error: 'Failed to update team member' });
    }
});

// DELETE a team member
app.delete('/api/team/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const memberRef = db.collection('teamMembers').doc(id);
        const doc = await memberRef.get();

        if (!doc.exists) {
            return res.status(404).send({ error: 'Team member not found' });
        }

        await memberRef.delete();
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting team member:", error);
        res.status(500).send({ error: 'Failed to delete team member' });
    }
});


// --- Other API Endpoints ---

app.post('/api/gemini-generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send({ error: 'Prompt is required' });
  }

  const vertex_ai = new VertexAI({project: 'genesis-exchangegit-0347-f7873', location: 'us-central1'});
  const model = 'gemini-1.5-flash-001';

  const generativeModel = vertex_ai.getGenerativeModel({
    model: model,
    generationConfig: {
      'maxOutputTokens': 8192,
      'temperature': 1,
      'topP': 0.95,
    },
  });

  try {
    const resp = await generativeModel.generateContent(prompt);
    const content = resp.response.candidates[0].content.parts[0].text;
    res.send({ generated_text: content });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to generate content from Gemini API' });
  }
});

app.get('/api/genesis-score', (req, res) => {
    res.json(genesisScoreData);
});

app.get('/api/vault/documents', (req, res) => {
    res.json(mockVaultDocuments);
});

app.get('/api/score-components', (req, res) => {
    res.json(mockScoreComponents);
});

app.post('/api/score-components/verification-bonus', (req, res) => {
    console.log('Verification bonus added:', req.body);
    res.status(201).send({ message: 'Bonus added' });
});

app.post('/api/score-components/team-verification-bonus', (req, res) => {
    console.log('Team verification bonus added:', req.body);
    res.status(201).send({ message: 'Bonus added' });
});

app.post('/api/score-components/ip-analysis-bonus', (req, res) => {
    console.log('IP analysis bonus added:', req.body);
    res.status(201).send({ message: 'Bonus added' });
});

app.get('/api/score-history', (req, res) => {
    res.json(mockScoreHistory);
});

app.get('/api/completed-modules', (req, res) => {
    res.json(mockCompletedModules);
});


// Expose the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
