
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const {getFirestore} = require('firebase-admin/firestore');
const {initializeApp} = require('firebase-admin/app');

// Initialize Firebase Admin SDK
initializeApp();

// Get a reference to the Firestore database
const db = getFirestore();

// Create an Express app
const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors({origin: true}));

// Use express.json() middleware to parse JSON request bodies
app.use(express.json());

// Define a route to get all score components
app.get('/api/score-components', async (req, res) => {
  try {
    const snapshot = await db.collection('scoreComponents').get();
    const components = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    res.json(components);
  } catch (error) {
    console.error('Error fetching score components:', error);
    res.status(500).send('Error fetching score components');
  }
});

// Define a route to get the score history
app.get('/api/score-history', async (req, res) => {
  try {
    const snapshot = await db.collection('scoreHistory').orderBy('date', 'desc').get();
    const history = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    res.json(history);
  } catch (error) {
    console.error('Error fetching score history:', error);
    res.status(500).send('Error fetching score history');
  }
});

// Define a route to get all documents from the vault
app.get('/api/vault/documents', async (req, res) => {
  try {
    const snapshot = await db.collection('vault').get();
    const documents = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    res.json(documents);
  } catch (error) {
    console.error('Error fetching vault documents:', error);
    res.status(500).send('Error fetching vault documents');
  }
});

// Define a route to get the team members
app.get('/api/team', async (req, res) => {
  try {
    const snapshot = await db.collection('team').get();
    const team = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).send('Error fetching team');
  }
});

// Define a route to get the completed modules
app.get('/api/completed-modules', async (req, res) => {
  try {
    const snapshot = await db.collection('completedModules').get();
    const modules = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    res.json(modules);
  } catch (error) {
    console.error('Error fetching completed modules:', error);
    res.status(500).send('Error fetching completed modules');
  }
});

// A 'Hello World' endpoint
app.get('/api/hello', (req, res) => {
  res.send('Hello from the Genesis Exchange API!');
});

const {VertexAI} = require('@google-cloud/vertex-ai');

// Initialize Vertex AI
const vertex_ai = new VertexAI({project: 'genesis-exchange', location: 'us-central1'});
const model = 'gemini-1.0-pro-001';

const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.2,
    topP: 0.8,
    topK: 40,
  },
});

app.post('/api/gemini-generate', async (req, res) => {
  const {prompt} = req.body;

  try {
    const [response] = await generativeModel.generateContent([prompt]);
    const text = response.candidates[0].content.parts[0].text;
    res.json({text});
  } catch (error) {
    console.error('Error generating text with Gemini API:', error);
    res.status(500).send('Error generating text with Gemini API');
  }
});


// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
