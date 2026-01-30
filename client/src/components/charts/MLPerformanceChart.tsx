import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MLPerformanceChartProps {
  data: {
    date: string;
    accuracy: number;
    f1Score: number;
    precision: number;
    recall: number;
  }[];
}

export function MLPerformanceChart({ data }: MLPerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ML Model Performance</CardTitle>
        <CardDescription>Model metrics over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" name="Accuracy" />
            <Line type="monotone" dataKey="f1Score" stroke="#10b981" name="F1 Score" />
            <Line type="monotone" dataKey="precision" stroke="#f59e0b" name="Precision" />
            <Line type="monotone" dataKey="recall" stroke="#ef4444" name="Recall" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
