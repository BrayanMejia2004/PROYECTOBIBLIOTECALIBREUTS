import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface LoansTrendChartProps {
  data: Array<{ date: string; loans: number }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date = new Date(label);
    return (
      <div className="bg-white dark:bg-[#1a2e24] border border-[#c3d62f] rounded-lg p-3 shadow-lg">
        <p className="text-[#132F20] font-semibold">{date.toLocaleDateString('es-CO')}</p>
        <p className="text-gray-600 dark:text-gray-300">préstamos: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export function LoansTrendChart({ data }: LoansTrendChartProps) {
  return (
    <div className="h-64 min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c3d62f" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#c3d62f" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
          />
          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="loans" 
            stroke="#c3d62f" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorLoans)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
