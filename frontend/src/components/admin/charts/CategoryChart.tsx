import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CategoryChartProps {
  data: Array<{ category: string; count: number }>;
}

export function CategoryChart({ data }: CategoryChartProps) {
  const colors = [
    '#c3d62f', '#132F20', '#5a8a4d', '#8fb35b', 
    '#2d5a3d', '#a3c96d', '#1e4030', '#7aa33d'
  ];

  return (
    <div className="h-64 min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <YAxis 
            type="category" 
            dataKey="category" 
            tick={{ fill: '#132F20', fontSize: 12 }} 
            width={70}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #c3d62f', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
