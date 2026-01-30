import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EngagementMetricsChartProps {
  data: {
    date: string;
    activeUsers: number;
    comments: number;
    votes: number;
  }[];
}

export function EngagementMetricsChart({ data }: EngagementMetricsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Metrics</CardTitle>
        <CardDescription>User activity trends</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="activeUsers" stroke="#3b82f6" name="Active Users" />
            <Line type="monotone" dataKey="comments" stroke="#10b981" name="Comments" />
            <Line type="monotone" dataKey="votes" stroke="#f59e0b" name="Votes" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
