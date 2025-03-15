// server.js - Backend 
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001; 

// GitHub configuration - from environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

// Check if environment variables are loaded
if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
  console.error('Missing required environment variables!');
  process.exit(1);
}

// Debugging environment variables
console.log('GITHUB_OWNER:', GITHUB_OWNER);
console.log('GITHUB_REPO:', GITHUB_REPO);
console.log('GITHUB_TOKEN:', GITHUB_TOKEN ? 'Token loaded' : 'Token missing');

// Serve static files
app.use(express.static('public'));

// Endpoint to get workflow runs data
app.get('/api/workflow-runs', async (req, res) => {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/runs`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const data = await response.json();

    // Process the data
    const processedData = {
      totalRuns: data.total_count,
      successRate: calculateSuccessRate(data.workflow_runs),
      recentRuns: data.workflow_runs.map(run => ({
        id: run.id,
        name: run.name,
        status: run.status,
        conclusion: run.conclusion,
        created_at: run.created_at,
        updated_at: run.updated_at,
        url: run.html_url,
        workflow_id: run.workflow_id
      })),
      workflowStats: calculateWorkflowStats(data.workflow_runs)
    };

    res.json(processedData);
  } catch (error) {
    console.error('Error fetching workflow runs:', error);
    res.status(500).json({ error: 'Failed to fetch workflow data', details: error.message });
  }
});

// Endpoint to get specific workflow details
app.get('/api/workflows/:id', async (req, res) => {
  try {
    const workflowId = req.params.id;

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${workflowId}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`Error fetching workflow ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch workflow data', details: error.message });
  }
});

// Calculate success rate of workflow runs
function calculateSuccessRate(runs) {
  if (!runs || runs.length === 0) return 0;

  const completed = runs.filter(run => run.status === 'completed');
  if (completed.length === 0) return 0;

  const successful = completed.filter(run => run.conclusion === 'success').length;
  return (successful / completed.length) * 100;
}

// Calculate statistics per workflow
function calculateWorkflowStats(runs) {
  if (!runs || runs.length === 0) return {};

  const stats = {};

  runs.forEach(run => {
    const id = run.workflow_id;

    if (!stats[id]) {
      stats[id] = {
        name: run.name,
        total: 0,
        success: 0,
        failure: 0,
        cancelled: 0,
        skipped: 0,
        other: 0
      };
    }

    stats[id].total++;

    if (run.status === 'completed') {
      switch (run.conclusion) {
        case 'success':
          stats[id].success++;
          break;
        case 'failure':
          stats[id].failure++;
          break;
        case 'cancelled':
          stats[id].cancelled++;
          break;
        case 'skipped':
          stats[id].skipped++;
          break;
        default:
          stats[id].other++;
      }
    }
  });

  return stats;
}

// Catch-all route to serve the frontend for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`GitHub Actions monitoring dashboard running at http://34.55.187.199/:${port}`);
});
