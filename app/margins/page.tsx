'use client';

import { Percent, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import Navbar from '@/components/navbar';
import StatCard from '@/components/stat-card';

export default function MarginsPage() {
  const metrics = [
    {
      label: 'Gross Margin',
      value: '$1,607,877',
      change: '+15.3%',
      icon: Percent,
      trend: 'up' as const,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      label: 'Margin %',
      value: '61.4%',
      change: '+2.1%',
      icon: TrendingUp,
      trend: 'up' as const,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      label: 'COGS',
      value: '$1,012,724',
      change: '+8.2%',
      icon: BarChart3,
      trend: 'up' as const,
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      label: 'Avg Product Margin',
      value: '61.1%',
      change: '+1.8%',
      icon: TrendingUp,
      trend: 'up' as const,
      gradient: 'from-amber-500 to-orange-600'
    }
  ];

  const marginByProduct = [
    { sku: 'SKU-001', name: 'Premium Widget', revenue: '$487,234', cogs: '$185,231', margin: '$302,003', percent: '62.0%' },
    { sku: 'SKU-003', name: 'Elite Service', revenue: '$456,789', cogs: '$177,892', margin: '$278,897', percent: '61.1%' },
    { sku: 'SKU-002', name: 'Pro Package', revenue: '$412,156', cogs: '$161,425', margin: '$250,731', percent: '60.8%' },
    { sku: 'SKU-004', name: 'Standard Plus', revenue: '$384,422', cogs: '$149,053', margin: '$235,369', percent: '61.2%' },
    { sku: 'SKU-005', name: 'Value Bundle', revenue: '$298,000', cogs: '$116,542', margin: '$181,458', percent: '60.9%' }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Profitability Analysis</h1>
          <p className="mt-2 text-slate-400">Margin trends, cost analysis, and profitability metrics</p>
        </div>

        {/* KPI Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {metrics.map((metric, idx) => (
            <StatCard key={idx} {...metric} />
          ))}
        </div>

        {/* Margin Breakdown */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Revenue Waterfall</h2>
            <div className="space-y-3">
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-cyan-400">$2,620,601</p>
              </div>
              <div className="flex items-center justify-center text-slate-500 text-sm">↓</div>
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Cost of Goods Sold</p>
                <p className="text-xl font-bold text-rose-400">-$1,012,724</p>
              </div>
              <div className="flex items-center justify-center text-slate-500 text-sm">↓</div>
              <div className="p-3 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-lg border border-emerald-500/30">
                <p className="text-xs text-slate-400 mb-1">Gross Margin</p>
                <p className="text-2xl font-bold text-emerald-400">$1,607,877</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Margin by Category</h2>
            <div className="space-y-3">
              {[
                { category: 'Premium', margin: '62.3%', value: '$587,234' },
                { category: 'Professional', margin: '60.8%', value: '$250,731' },
                { category: 'Standard', margin: '61.5%', value: '$235,369' },
                { category: 'Value', margin: '60.9%', value: '$181,458' }
              ].map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                  <span className="text-sm text-slate-300">{cat.category}</span>
                  <div className="text-right">
                    <p className="text-xs text-emerald-400 font-semibold">{cat.margin}</p>
                    <p className="text-xs text-slate-500">{cat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Margin Trend</h2>
            <div className="h-40 flex items-end justify-around gap-2">
              {[55, 58, 60, 61, 62, 61, 61.4].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${val}%` }}
                  />
                  <span className="text-xs text-slate-500 mt-1">+{i}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">Last 7 periods</p>
          </div>
        </div>

        {/* Product Margins */}
        <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50">
          <h2 className="text-lg font-semibold text-white mb-4">Margin by Product</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-left text-slate-400">SKU</th>
                  <th className="px-4 py-3 text-left text-slate-400">Product</th>
                  <th className="px-4 py-3 text-right text-slate-400">Revenue</th>
                  <th className="px-4 py-3 text-right text-slate-400">COGS</th>
                  <th className="px-4 py-3 text-right text-slate-400">Gross Margin</th>
                  <th className="px-4 py-3 text-right text-slate-400">Margin %</th>
                </tr>
              </thead>
              <tbody>
                {marginByProduct.map((product, idx) => (
                  <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-900/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-400">{product.sku}</td>
                    <td className="px-4 py-3 text-white">{product.name}</td>
                    <td className="px-4 py-3 text-right text-cyan-400">{product.revenue}</td>
                    <td className="px-4 py-3 text-right text-rose-400">{product.cogs}</td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-semibold">{product.margin}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                        {product.percent}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
