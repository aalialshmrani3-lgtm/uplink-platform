/**
 * useWebSocket Hook
 * Real-time notifications via WebSocket
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';

export interface Notification {
  type: 'idea_high_risk' | 'ai_suggestion' | 'project_update' | 'rat_alert' | 'gate_decision' | 'general' | 'connection';
  title?: string;
  message: string;
  data?: any;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: number;
}

interface UseWebSocketOptions {
  onNotification?: (notification: Notification) => void;
  autoConnect?: boolean;
  reconnectInterval?: number;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    onNotification,
    autoConnect = true,
    reconnectInterval = 10000
  } = options;

  // WebSocket is only available in development mode
  // In production, the WebSocket server is not initialized
  const isDevMode = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const { user } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const connect = useCallback(() => {
    // Only connect in development mode (localhost)
    if (!isDevMode) {
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    // Get WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const userId = user?.id || '';
    const wsUrl = `${protocol}//${host}/ws?userId=${userId}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const notification: Notification = JSON.parse(event.data);
          setNotifications(prev => [notification, ...prev].slice(0, 50));
          if (onNotification) {
            onNotification(notification);
          }
        } catch (error) {
          // Silently ignore parse errors
        }
      };

      ws.onerror = () => {
        // Silently handle errors - don't log to avoid console spam
        setIsConnected(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;

        // Auto-reconnect only in dev mode with longer interval
        if (autoConnect && isDevMode) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };
    } catch (error) {
      // Silently ignore connection errors
    }
  }, [user?.id, autoConnect, reconnectInterval, onNotification, isDevMode]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      console.log('🔌 Disconnecting WebSocket');
      wsRef.current.close();
      wsRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket not connected');
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && user) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, user, connect, disconnect]);

  return {
    isConnected,
    notifications,
    connect,
    disconnect,
    sendMessage,
    clearNotifications
  };
}
