import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LoanStatusChartProps {
  data: {
    active: number;
    returned: number;
    overdue: number;
  };
}

export function LoanStatusChart({ data }: LoanStatusChartProps) {
  const chartData = [
    { name: 'Activos', value: data.active, color: '#c3d62f' },
    { name: 'Devueltos', value: data.returned, color: '#22c55e' },
    { name: 'Vencidos', value: data.overdue, color: '#ef4444' },
  ].filter(item => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="h-64 min-h-[256px] flex items-center justify-center text-gray-500">
        No hay datos de préstamos
      </div>
    );
  }

  return (
    <div className="h-64 min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #c3d62f', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
