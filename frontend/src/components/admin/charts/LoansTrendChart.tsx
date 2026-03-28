import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface LoansTrendChartProps {
  data: Array<{ date: string; loans: number }>;
}

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
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #c3d62f', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('es-CO');
            }}
          />
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
