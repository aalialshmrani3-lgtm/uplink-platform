import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface InnovationFunnelChartProps {
  data: {
    stage: string;
    count: number;
  }[];
}

export function InnovationFunnelChart({ data }: InnovationFunnelChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Innovation Funnel</CardTitle>
        <CardDescription>Ideas progression through stages</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" name="Ideas Count" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
