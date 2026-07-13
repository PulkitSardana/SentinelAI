"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const mockData = [
  { range: "0-10", count: 12040 },
  { range: "11-20", count: 8300 },
  { range: "21-30", count: 5400 },
  { range: "31-40", count: 2100 },
  { range: "41-50", count: 1500 },
  { range: "51-60", count: 800 },
  { range: "61-70", count: 650 },
  { range: "71-80", count: 420 },
  { range: "81-90", count: 280 },
  { range: "91-100", count: 110 },
]

export function RiskScoreHistogram() {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis 
            dataKey="range" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              borderColor: '#1e293b',
              borderRadius: '8px',
              color: '#f8fafc',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)'
            }}
            itemStyle={{ color: '#f8fafc' }}
          />
          <Bar 
            dataKey="count" 
            name="Transactions"
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
