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
    reconnectInterval = 5000
  } = options;

  const { user } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    // Get WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const userId = user?.id || '';
    const wsUrl = `${protocol}//${host}/ws?userId=${userId}`;

    console.log('🔌 Connecting to WebSocket:', wsUrl);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        
        // Clear reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const notification: Notification = JSON.parse(event.data);
          console.log('📨 Received notification:', notification);

          // Add to notifications list
          setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50

          // Call callback
          if (onNotification) {
            onNotification(notification);
          }
        } catch (error) {
          console.error('❌ Error parsing notification:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('👋 WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;

        // Auto-reconnect
        if (autoConnect) {
          console.log(`🔄 Reconnecting in ${reconnectInterval}ms...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };
    } catch (error) {
      console.error('❌ Error creating WebSocket:', error);
    }
  }, [user?.id, autoConnect, reconnectInterval, onNotification]);

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
