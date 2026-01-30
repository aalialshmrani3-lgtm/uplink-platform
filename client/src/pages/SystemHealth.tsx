import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Activity, Database, Server, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export default function SystemHealth() {
  const [metrics, setMetrics] = useState({
    uptime: 0,
    memory: { used: 0, total: 0 },
    cpu: 0,
    dbConnections: 0,
    apiResponseTime: 0,
    errorRate: 0,
  });

  useEffect(() => {
    // Simulated metrics (in production, fetch from actual monitoring API)
    const interval = setInterval(() => {
      setMetrics({
        uptime: Date.now() - (Date.now() - Math.random() * 86400000),
        memory: {
          used: Math.random() * 8,
          total: 16,
        },
        cpu: Math.random() * 100,
        dbConnections: Math.floor(Math.random() * 50),
        apiResponseTime: Math.random() * 500,
        errorRate: Math.random() * 5,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const uptimeHours = Math.floor(metrics.uptime / 3600000);
  const memoryPercent = (metrics.memory.used / metrics.memory.total) * 100;
  const isHealthy = metrics.cpu < 80 && memoryPercent < 80 && metrics.errorRate < 5;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8" />
            System Health
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time system performance and health metrics
          </p>
        </div>
        <Badge variant={isHealthy ? 'default' : 'destructive'} className="text-lg px-4 py-2">
          {isHealthy ? (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Healthy
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 mr-2" />
              Degraded
            </>
          )}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Uptime</h3>
            </div>
            <Badge variant="outline">{uptimeHours}h</Badge>
          </div>
          <div className="text-3xl font-bold">{uptimeHours} hours</div>
          <div className="text-sm text-muted-foreground mt-1">
            System running smoothly
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">CPU Usage</h3>
            </div>
            <Badge variant={metrics.cpu > 80 ? 'destructive' : 'default'}>
              {metrics.cpu.toFixed(1)}%
            </Badge>
          </div>
          <div className="text-3xl font-bold">{metrics.cpu.toFixed(1)}%</div>
          <div className="w-full bg-secondary h-2 rounded-full mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${metrics.cpu}%` }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Memory</h3>
            </div>
            <Badge variant={memoryPercent > 80 ? 'destructive' : 'default'}>
              {memoryPercent.toFixed(1)}%
            </Badge>
          </div>
          <div className="text-3xl font-bold">
            {metrics.memory.used.toFixed(1)} / {metrics.memory.total} GB
          </div>
          <div className="w-full bg-secondary h-2 rounded-full mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${memoryPercent}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Database Connections</h3>
          <div className="text-4xl font-bold">{metrics.dbConnections}</div>
          <div className="text-sm text-muted-foreground mt-1">Active connections</div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">API Response Time</h3>
          <div className="text-4xl font-bold">{metrics.apiResponseTime.toFixed(0)}ms</div>
          <div className="text-sm text-muted-foreground mt-1">Average latency</div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Error Rate</h3>
          <div className="text-4xl font-bold">{metrics.errorRate.toFixed(2)}%</div>
          <div className="text-sm text-muted-foreground mt-1">Last 24 hours</div>
        </Card>
      </div>

      {/* Health Status */}
      <Card className="p-6 mt-6">
        <h3 className="font-semibold mb-4">System Components</h3>
        <div className="space-y-3">
          {[
            { name: 'Web Server', status: 'operational' },
            { name: 'Database', status: 'operational' },
            { name: 'Cache', status: 'operational' },
            { name: 'WebSocket Server', status: 'operational' },
            { name: 'AI Services', status: 'operational' },
            { name: 'Storage', status: 'operational' },
          ].map((component) => (
            <div key={component.name} className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">{component.name}</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {component.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
