/**
 * Public API endpoints for external access
 * Requires API key authentication
 */

import express, { Request, Response, NextFunction } from 'express';
import { validateApiKey, updateApiKeyUsage, recordApiUsage } from './db_api_keys';
import axios from 'axios';

const router = express.Router();

// Rate limiting store (in-memory, consider Redis for production)
const rateLimitStore = new Map<number, { count: number; resetAt: number }>();

/**
 * API Key authentication middleware
 */
async function authenticateApiKey(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key required. Use: Authorization: Bearer naqla_your_key',
    });
  }
  
  const apiKey = authHeader.substring(7); // Remove "Bearer "
  
  try {
    const keyData = await validateApiKey(apiKey);
    
    if (!keyData) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired API key',
      });
    }
    
    // Check rate limit
    const now = Date.now();
    const limit = rateLimitStore.get(keyData.id);
    
    if (limit) {
      if (now < limit.resetAt) {
        if (limit.count >= (keyData.rateLimit || 1000)) {
          return res.status(429).json({
            error: 'Rate Limit Exceeded',
            message: `Rate limit of ${keyData.rateLimit} requests per hour exceeded`,
            resetAt: new Date(limit.resetAt).toISOString(),
          });
        }
        limit.count++;
      } else {
        // Reset window
        rateLimitStore.set(keyData.id, { count: 1, resetAt: now + 3600000 });
      }
    } else {
      // First request
      rateLimitStore.set(keyData.id, { count: 1, resetAt: now + 3600000 });
    }
    
    // Attach key data to request
    (req as any).apiKey = keyData;
    
    next();
  } catch (error) {
    console.error('[Public API] Auth error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to authenticate API key',
    });
  }
}

/**
 * Usage tracking middleware
 */
function trackUsage(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  res.on('finish', async () => {
    const responseTime = Date.now() - startTime;
    const apiKey = (req as any).apiKey;
    
    if (apiKey) {
      try {
        await updateApiKeyUsage(apiKey.id);
        await recordApiUsage({
          apiKeyId: apiKey.id,
          endpoint: req.path,
          method: req.method,
          statusCode: res.statusCode,
          responseTime,
        });
      } catch (error) {
        console.error('[Public API] Usage tracking error:', error);
      }
    }
  });
  
  next();
}

// Apply middlewares
router.use(authenticateApiKey);
router.use(trackUsage);

/**
 * GET /api/public/v1/status
 * API status check
 */
router.get('/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/public/v1/predict
 * Predict idea success rate
 */
router.post('/predict', async (req: Request, res: Response) => {
  try {
    const {
      budget,
      team_size,
      timeline_months,
      market_demand,
      technical_feasibility,
      competitive_advantage,
      user_engagement,
      tags_count,
      hypothesis_validation_rate,
      rat_completion_rate,
      title_length,
      description_length,
    } = req.body;
    
    // Validate required fields
    if (
      budget === undefined ||
      team_size === undefined ||
      timeline_months === undefined ||
      market_demand === undefined ||
      technical_feasibility === undefined
    ) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: budget, team_size, timeline_months, market_demand, technical_feasibility',
      });
    }
    
    // Call internal prediction service
    const predictionResponse = await axios.post('http://localhost:8002/predict', {
      budget,
      team_size,
      timeline_months,
      market_demand,
      technical_feasibility,
      competitive_advantage: competitive_advantage || 0.5,
      user_engagement: user_engagement || 0.5,
      tags_count: tags_count || 3,
      hypothesis_validation_rate: hypothesis_validation_rate || 0.5,
      rat_completion_rate: rat_completion_rate || 0.5,
      title_length: title_length || 50,
      description_length: description_length || 200,
    });
    
    const prediction = predictionResponse.data;
    
    res.json({
      success: true,
      prediction: {
        success_rate: prediction.success_rate,
        confidence: prediction.confidence,
        model_version: prediction.model_version,
      },
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('[Public API] Prediction error:', error);
    
    if (error.response?.status === 503) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Prediction service is currently unavailable',
      });
    }
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to generate prediction',
    });
  }
});

/**
 * POST /api/public/v1/batch-predict
 * Batch predict multiple ideas at once
 */
router.post('/batch-predict', async (req: Request, res: Response) => {
  try {
    const { ideas } = req.body;
    
    // Validate input
    if (!Array.isArray(ideas) || ideas.length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'ideas must be a non-empty array',
      });
    }
    
    if (ideas.length > 100) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Maximum 100 ideas per batch',
      });
    }
    
    // Process all ideas in parallel
    const startTime = Date.now();
    const predictions = await Promise.all(
      ideas.map(async (idea: any, index: number) => {
        try {
          // Call internal prediction service
          const predictionResponse = await axios.post('http://localhost:8002/predict', {
            budget: idea.budget,
            team_size: idea.team_size,
            timeline_months: idea.timeline_months,
            market_demand: idea.market_demand,
            technical_feasibility: idea.technical_feasibility,
            competitive_advantage: idea.competitive_advantage || 0.5,
            user_engagement: idea.user_engagement || 0.5,
            tags_count: idea.tags_count || 3,
            hypothesis_validation_rate: idea.hypothesis_validation_rate || 0.5,
            rat_completion_rate: idea.rat_completion_rate || 0.5,
            title_length: idea.title_length || 50,
            description_length: idea.description_length || 200,
          });
          
          return {
            index,
            success: true,
            prediction: {
              success_rate: predictionResponse.data.success_rate,
              confidence: predictionResponse.data.confidence,
              model_version: predictionResponse.data.model_version,
            },
          };
        } catch (error: any) {
          return {
            index,
            success: false,
            error: error.message || 'Prediction failed',
          };
        }
      })
    );
    
    const processingTime = Date.now() - startTime;
    
    // Aggregate results
    const successful = predictions.filter(p => p.success).length;
    const failed = predictions.filter(p => !p.success).length;
    
    res.json({
      success: true,
      total: ideas.length,
      successful,
      failed,
      processing_time_ms: processingTime,
      predictions,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('[Public API] Batch prediction error:', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process batch prediction',
    });
  }
});

/**
 * GET /api/public/v1/usage
 * Get API key usage statistics
 */
router.get('/usage', async (req: Request, res: Response) => {
  try {
    const apiKey = (req as any).apiKey;
    const limit = rateLimitStore.get(apiKey.id);
    
    res.json({
      api_key_id: apiKey.id,
      rate_limit: apiKey.rateLimit,
      current_usage: limit ? limit.count : 0,
      reset_at: limit ? new Date(limit.resetAt).toISOString() : null,
      last_used_at: apiKey.lastUsedAt,
    });
  } catch (error) {
    console.error('[Public API] Usage stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve usage statistics',
    });
  }
});

export default router;
