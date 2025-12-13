import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Product, CategoryData } from '@/types';

interface DashboardProps {
  products: Product[];
}

export const Dashboard: React.FC<DashboardProps> = ({ products }: DashboardProps) => {
  const data: CategoryData[] = React.useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p: Product) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 print:hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Inventory Overview</h2>
          <p className="text-sm text-slate-500">Stock distribution by category</p>
        </div>
        <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold">
          {products.length} Total Items
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
              interval={0}
              tickFormatter={(val: string) => val.length > 10 ? val.slice(0, 10) + '...' : val}
            />
            <YAxis 
              hide 
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar 
              dataKey="count" 
              radius={[4, 4, 4, 4]}
              barSize={40}
            >
               {data.map((_entry: CategoryData, index: number) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0d9488' : '#cbd5e1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};