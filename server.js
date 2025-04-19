// server.js - Backend 
import express from 'express';
import axios from 'axios';
import cors from 'cors';
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

// Check if environment variables are loaded
if (!GITHUB_TOKEN || !GITHUB_OWNER) {
  console.error('Error: GITHUB_TOKEN and GITHUB_OWNER must be set in .env file');
  process.exit(1);
}

// Debugging environment variables
console.log('GITHUB_OWNER:', GITHUB_OWNER);
console.log('GITHUB_TOKEN:', GITHUB_TOKEN ? 'Token loaded' : 'Token missing');

// Serve static files
app.use(express.static('public'));
app.use(cors());
app.use(express.json());

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  }
});

// Function to check if a repository has workflows
async function hasWorkflows(owner, repo) {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}/actions/workflows`);
    return response.data.total_count > 0;
  } catch (error) {
    console.error(`Error checking workflows for ${owner}/${repo}:`, error);
    return false;
  }
}

// Endpoint to get all repositories with workflows
app.get('/api/repositories', async (req, res) => {
  try {
    const response = await githubApi.get(`/users/${GITHUB_OWNER}/repos`);
    const allRepos = response.data;
    
    // Filter repositories that have workflows
    const reposWithWorkflows = [];
    for (const repo of allRepos) {
      if (await hasWorkflows(GITHUB_OWNER, repo.name)) {
        reposWithWorkflows.push(repo);
      }
    }
    
    res.json(reposWithWorkflows);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

// Function to fetch all workflow runs for a specific workflow
async function fetchAllWorkflowRuns(owner, repo, workflowId) {
  let allRuns = [];
  let page = 1;
  const perPage = 100; // Maximum allowed by GitHub API

  while (true) {
    try {
      const response = await githubApi.get(
        `/repos/${owner}/${repo}/actions/workflows/${workflowId}/runs`,
        {
          params: {
            per_page: perPage,
            page: page
          }
        }
      );

      const runs = response.data.workflow_runs;
      if (runs.length === 0) break;

      allRuns = allRuns.concat(runs);
      page++;

      // If we got less than perPage results, we've reached the end
      if (runs.length < perPage) break;
    } catch (error) {
      console.error(`Error fetching workflow runs for ${workflowId}:`, error);
      break;
    }
  }

  return allRuns;
}

// Function to calculate workflow statistics
function calculateWorkflowStats(runs) {
  const stats = {
    total: runs.length,
    success: 0,
    failure: 0,
    cancelled: 0,
    skipped: 0,
    other: 0
  };

  runs.forEach(run => {
    if (run.status === 'completed') {
      switch (run.conclusion) {
        case 'success':
          stats.success++;
          break;
        case 'failure':
          stats.failure++;
          break;
        case 'cancelled':
          stats.cancelled++;
          break;
        case 'skipped':
          stats.skipped++;
          break;
        default:
          stats.other++;
      }
    }
  });

  return stats;
}

// Endpoint to get workflow runs data for a specific repository
app.get('/api/workflow-runs/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;
  
  try {
    // First, get all workflows in the repository
    const workflowsResponse = await githubApi.get(`/repos/${owner}/${repo}/actions/workflows`);
    const workflows = workflowsResponse.data.workflows;

    // Get recent runs for the dashboard (last 30)
    const recentRunsResponse = await githubApi.get(
      `/repos/${owner}/${repo}/actions/runs`,
      { params: { per_page: 30 } }
    );
    const recentRuns = recentRunsResponse.data.workflow_runs;

    // Calculate total runs and success rate for recent runs
    const totalRuns = recentRuns.length;
    const successfulRuns = recentRuns.filter(run => 
      run.status === 'completed' && run.conclusion === 'success'
    ).length;
    const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;

    // Fetch complete historical data for each workflow
    const workflowStats = {};
    for (const workflow of workflows) {
      const allRuns = await fetchAllWorkflowRuns(owner, repo, workflow.id);
      workflowStats[workflow.id] = {
        name: workflow.name,
        ...calculateWorkflowStats(allRuns)
      };
    }

    res.json({
      totalRuns,
      successRate,
      recentRuns,
      workflowStats
    });
  } catch (error) {
    console.error('Error fetching workflow runs:', error);
    res.status(500).json({ error: 'Failed to fetch workflow runs' });
  }
});

// Endpoint to get specific workflow details
app.get('/api/workflows/:owner/:repo/:id', async (req, res) => {
  try {
    const { owner, repo, id } = req.params;

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${id}`,
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

// Catch-all route to serve the frontend for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`GitHub Actions monitoring dashboard running at http://34.55.187.199:${port}`);
});
