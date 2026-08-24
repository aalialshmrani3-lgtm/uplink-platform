/**
 * WebSocket Server for Real-time Notifications
 * NAQLA 5.0 Platform
 */

import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { parse } from 'url';

// Types
export interface NotificationPayload {
  type: 'idea_high_risk' | 'ai_suggestion' | 'project_update' | 'rat_alert' | 'gate_decision' | 'general';
  title: string;
  message: string;
  data?: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: number;
  userId?: number;
}

interface Client {
  ws: WebSocket;
  userId?: number;
  isAlive: boolean;
}

// Global clients map
const clients = new Map<WebSocket, Client>();

/**
 * Initialize WebSocket Server
 */
export function initWebSocketServer(server: any) {
  const wss = new WebSocketServer({ 
    server,
    path: '/ws'
  });

  console.log('🔌 WebSocket server initialized on /ws');

  // Heartbeat interval to detect dead connections
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const client = clients.get(ws);
      if (client) {
        if (!client.isAlive) {
          console.log("[WebSocket] Terminating an inactive connection");
          clients.delete(ws);
          return ws.terminate();
        }
        client.isAlive = false;
        ws.ping();
      }
    });
  }, 30000); // 30 seconds

  wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
    // Parse query params for userId
    const { query } = parse(request.url || '', true);
    const userId = query.userId ? parseInt(query.userId as string) : undefined;

    // Register client
    const client: Client = {
      ws,
      userId,
      isAlive: true
    };
    clients.set(ws, client);

    console.log(`[WebSocket] Connection opened; active=${clients.size}`);

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to NAQLA notification server',
      timestamp: Date.now()
    }));

    // Handle pong (heartbeat response)
    ws.on('pong', () => {
      const client = clients.get(ws);
      if (client) {
        client.isAlive = true;
      }
    });

    // Handle incoming messages
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());

        // Handle different message types
        if (message.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        }
      } catch (error) {
        console.error("[WebSocket] Ignored an invalid client message");
      }
    });

    // Handle connection close
    ws.on('close', () => {
      clients.delete(ws);
      console.log(`[WebSocket] Connection closed; active=${clients.size}`);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error("[WebSocket] Connection error");
      clients.delete(ws);
    });
  });

  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });

  return wss;
}

/**
 * Send notification to specific user
 */
export function sendNotificationToUser(userId: number, notification: NotificationPayload) {
  let sent = 0;
  
  clients.forEach((client) => {
    if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({
        ...notification,
        timestamp: notification.timestamp || Date.now()
      }));
      sent++;
    }
  });

  console.log(`[WebSocket] Notification delivered to ${sent} connection(s)`);
  return sent > 0;
}

/**
 * Broadcast notification to all connected users
 */
export function broadcastNotification(notification: NotificationPayload) {
  let sent = 0;

  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({
        ...notification,
        timestamp: notification.timestamp || Date.now()
      }));
      sent++;
    }
  });

  console.log(`📢 Broadcast notification to ${sent} connection(s)`);
  return sent;
}

/**
 * Send notification to multiple users
 */
export function sendNotificationToUsers(userIds: number[], notification: NotificationPayload) {
  const userIdSet = new Set(userIds);
  let sent = 0;

  clients.forEach((client) => {
    if (client.userId && userIdSet.has(client.userId) && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({
        ...notification,
        timestamp: notification.timestamp || Date.now()
      }));
      sent++;
    }
  });

  console.log(`📤 Sent notification to ${sent} user(s) out of ${userIds.length}`);
  return sent;
}

/**
 * Get connected users count
 */
export function getConnectedUsersCount(): number {
  return clients.size;
}

/**
 * Get connected users list
 */
export function getConnectedUsers(): number[] {
  const users: number[] = [];
  clients.forEach((client) => {
    if (client.userId) {
      users.push(client.userId);
    }
  });
  return Array.from(new Set(users)); // Remove duplicates
}

/**
 * Helper: Send high-risk idea alert
 */
export function sendHighRiskIdeaAlert(userId: number, ideaTitle: string, ratScore: number) {
  return sendNotificationToUser(userId, {
    type: 'idea_high_risk',
    title: '⚠️ تنبيه: فكرة عالية الخطورة',
    message: `الفكرة "${ideaTitle}" لديها درجة RAT عالية (${ratScore.toFixed(2)}). يُنصح بإجراء اختبارات إضافية.`,
    data: { ideaTitle, ratScore },
    priority: 'urgent',
    timestamp: Date.now()
  });
}

/**
 * Helper: Send AI suggestion notification
 */
export function sendAISuggestionNotification(userId: number, suggestion: string) {
  return sendNotificationToUser(userId, {
    type: 'ai_suggestion',
    title: '💡 اقتراح AI جديد',
    message: suggestion,
    priority: 'medium',
    timestamp: Date.now()
  });
}

/**
 * Helper: Send project status update
 */
export function sendProjectUpdateNotification(userId: number, projectTitle: string, newStatus: string) {
  return sendNotificationToUser(userId, {
    type: 'project_update',
    title: '📊 تحديث حالة المشروع',
    message: `تم تحديث حالة المشروع "${projectTitle}" إلى: ${newStatus}`,
    data: { projectTitle, newStatus },
    priority: 'medium',
    timestamp: Date.now()
  });
}

/**
 * Helper: Send RAT test alert
 */
export function sendRATTestAlert(userId: number, hypothesisTitle: string, ratScore: number) {
  return sendNotificationToUser(userId, {
    type: 'rat_alert',
    title: '🚨 تنبيه RAT',
    message: `الفرضية "${hypothesisTitle}" لديها درجة RAT عالية (${ratScore.toFixed(2)}). يتطلب اختبار فوري.`,
    data: { hypothesisTitle, ratScore },
    priority: 'high',
    timestamp: Date.now()
  });
}

/**
 * Helper: Send gate decision notification
 */
export function sendGateDecisionNotification(userId: number, projectTitle: string, decision: string) {
  return sendNotificationToUser(userId, {
    type: 'gate_decision',
    title: '🚪 قرار البوابة',
    message: `تم اتخاذ قرار "${decision}" للمشروع "${projectTitle}"`,
    data: { projectTitle, decision },
    priority: 'high',
    timestamp: Date.now()
  });
}
