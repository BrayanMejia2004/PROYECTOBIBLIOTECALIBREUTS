import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../../../context/ThemeContext';

interface CategoryChartProps {
  data: Array<{ category: string; count: number }>;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#1a2e24] border border-[#c3d62f] rounded-lg p-3 shadow-lg">
        <p className="text-[#132F20] dark:text-white font-semibold">{payload[0].payload.category}</p>
        <p className="text-gray-600 dark:text-gray-300">cantidad: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export function CategoryChart({ data }: CategoryChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const colors = [
    '#c3d62f', '#132F20', '#5a8a4d', '#8fb35b', 
    '#2d5a3d', '#a3c96d', '#1e4030', '#7aa33d'
  ];

  return (
    <div className="h-64 min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <XAxis type="number" tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
          <YAxis 
            type="category" 
            dataKey="category" 
            tick={{ fill: isDark ? '#9ca3af' : '#132F20', fontSize: 12 }} 
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
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
