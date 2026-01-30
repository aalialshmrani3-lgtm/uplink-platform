/**
 * Webhook Service
 * Trigger webhooks for various events
 */

import axios from 'axios';
import crypto from 'crypto';
import { getActiveWebhooksForEvent, logWebhookCall } from './db_webhooks';

/**
 * Trigger webhooks for a specific event
 */
export async function triggerWebhooks(event: string, payload: any) {
  try {
    const webhooks = await getActiveWebhooksForEvent(event);
    
    if (webhooks.length === 0) {
      console.log(`[Webhooks] No active webhooks for event: ${event}`);
      return;
    }
    
    console.log(`[Webhooks] Triggering ${webhooks.length} webhooks for event: ${event}`);
    
    // Trigger all webhooks in parallel
    const promises = webhooks.map((webhook: any) => 
      triggerSingleWebhook(webhook, event, payload)
    );
    
    await Promise.allSettled(promises);
    
  } catch (error) {
    console.error('[Webhooks] Error triggering webhooks:', error);
  }
}

/**
 * Trigger a single webhook
 */
async function triggerSingleWebhook(
  webhook: any,
  event: string,
  payload: any,
  retryCount: number = 0
) {
  const startTime = Date.now();
  
  try {
    // Prepare payload
    const webhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data: payload,
    };
    
    // Generate HMAC signature if secret is provided
    const headers: any = {
      'Content-Type': 'application/json',
      'X-Webhook-Event': event,
      'X-Webhook-ID': webhook.id.toString(),
    };
    
    if (webhook.secret) {
      const signature = crypto
        .createHmac('sha256', webhook.secret)
        .update(JSON.stringify(webhookPayload))
        .digest('hex');
      
      headers['X-Webhook-Signature'] = signature;
    }
    
    // Send webhook
    const response = await axios.post(webhook.url, webhookPayload, {
      headers,
      timeout: 10000, // 10 seconds timeout
    });
    
    const responseTime = Date.now() - startTime;
    
    // Log success
    await logWebhookCall({
      webhookId: webhook.id,
      event,
      payload: webhookPayload,
      statusCode: response.status,
      responseTime,
      success: true,
      retryCount,
    });
    
    console.log(`[Webhooks] Successfully triggered webhook ${webhook.id} for event ${event}`);
    
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    
    // Log failure
    await logWebhookCall({
      webhookId: webhook.id,
      event,
      payload: { event, data: payload },
      statusCode: error.response?.status,
      responseTime,
      success: false,
      errorMessage,
      retryCount,
    });
    
    console.error(`[Webhooks] Failed to trigger webhook ${webhook.id}:`, errorMessage);
    
    // Retry logic (max 3 retries with exponential backoff)
    if (retryCount < 3) {
      const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      console.log(`[Webhooks] Retrying webhook ${webhook.id} in ${delay}ms (attempt ${retryCount + 1}/3)`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      await triggerSingleWebhook(webhook, event, payload, retryCount + 1);
    }
  }
}

/**
 * Event types
 */
export const WebhookEvents = {
  // Ideas
  IDEA_CREATED: 'idea.created',
  IDEA_UPDATED: 'idea.updated',
  IDEA_STATUS_CHANGED: 'idea.status_changed',
  IDEA_DELETED: 'idea.deleted',
  
  // Projects
  PROJECT_CREATED: 'project.created',
  PROJECT_STATUS_CHANGED: 'project.status_changed',
  PROJECT_GATE_DECISION: 'project.gate_decision',
  
  // RAT
  RAT_ALERT: 'rat.alert',
  RAT_COMPLETED: 'rat.completed',
  
  // Evaluations
  EVALUATION_SUBMITTED: 'evaluation.submitted',
  EVALUATION_COMPLETED: 'evaluation.completed',
  
  // AI Insights
  AI_RECOMMENDATION: 'ai.recommendation',
  AI_RISK_DETECTED: 'ai.risk_detected',
  
  // All events
  ALL: '*',
};
