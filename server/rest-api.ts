// Added for Flowchart Match - Phase 6: REST API Layer
import { Router } from 'express';
import { db } from './db';

const router = Router();

// GET /api/ideas - Get all ideas (public)
router.get('/ideas', async (req, res) => {
  try {
    const ideas = await db.getAllProjects();
    res.json({ success: true, data: ideas });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/ideas/:id - Get idea by ID (public)
router.get('/ideas/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const idea = await db.getProjectById(id);
    if (!idea) {
      return res.status(404).json({ success: false, error: 'Idea not found' });
    }
    res.json({ success: true, data: idea });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/hackathons - Get all hackathons (public)
router.get('/hackathons', async (req, res) => {
  try {
    // TODO: Implement getAllHackathons in db.ts
    res.json({ success: true, data: [] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/events - Get all events (public)
router.get('/events', async (req, res) => {
  try {
    // TODO: Implement getAllEvents in db.ts
    res.json({ success: true, data: [] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/stats - Get platform statistics (public)
router.get('/stats', async (req, res) => {
  try {
    // TODO: Implement platform stats aggregation
    res.json({
      success: true,
      data: {
        totalIdeas: 0,
        totalUsers: 0,
        totalHackathons: 0,
        totalEvents: 0,
        totalContracts: 0,
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
