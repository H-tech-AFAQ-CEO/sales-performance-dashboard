'use client';

import { BarChart3, TrendingUp, TrendingDown, Award } from 'lucide-react';
import Navbar from '@/components/navbar';
import StatCard from '@/components/stat-card';

export default function ProductsPage() {
  const metrics = [
    {
      label: 'Total Products',
      value: '6',
      change: 'Active',
      icon: BarChart3,
      trend: 'up' as const,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      label: 'Avg Product Revenue',
      value: '$436,767',
      change: '+11.2%',
      icon: TrendingUp,
      trend: 'up' as const,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      label: 'Top Product',
      value: 'SKU-001',
      change: '$487,234',
      icon: Award,
      trend: 'up' as const,
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      label: 'Avg Margin',
      value: '61.4%',
      change: '+2.1%',
      icon: TrendingUp,
      trend: 'up' as const,
      gradient: 'from-violet-500 to-purple-600'
    }
  ];

  const allProducts = [
    { sku: 'SKU-001', name: 'Premium Widget', category: 'Premium', revenue: '$487,234', units: 32145, margin: '62.1%', growth: '+18.5%' },
    { sku: 'SKU-003', name: 'Elite Service', category: 'Premium', revenue: '$456,789', units: 28932, margin: '61.2%', growth: '+12.3%' },
    { sku: 'SKU-002', name: 'Pro Package', category: 'Professional', revenue: '$412,156', units: 24876, margin: '60.8%', growth: '+9.7%' },
    { sku: 'SKU-004', name: 'Standard Plus', category: 'Standard', revenue: '$384,422', units: 21456, margin: '61.5%', growth: '+8.2%' },
    { sku: 'SKU-005', name: 'Value Bundle', category: 'Value', revenue: '$298,000', units: 18065, margin: '60.9%', growth: '+5.4%' },
    { sku: 'SKU-006', name: 'Starter Pack', category: 'Entry', revenue: '$184,000', units: 12000, margin: '58.2%', growth: '-2.1%' }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Product Performance</h1>
          <p className="mt-2 text-slate-400">SKU-level analysis and category breakdown</p>
        </div>

        {/* KPI Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {metrics.map((metric, idx) => (
            <StatCard key={idx} {...metric} />
          ))}
        </div>

        {/* Products Table */}
        <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">All Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-left text-slate-400">SKU</th>
                  <th className="px-4 py-3 text-left text-slate-400">Product</th>
                  <th className="px-4 py-3 text-left text-slate-400">Category</th>
                  <th className="px-4 py-3 text-right text-slate-400">Revenue</th>
                  <th className="px-4 py-3 text-right text-slate-400">Units</th>
                  <th className="px-4 py-3 text-right text-slate-400">Margin</th>
                  <th className="px-4 py-3 text-right text-slate-400">Growth</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((product, idx) => (
                  <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-900/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-400">{product.sku}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-slate-700 text-slate-300">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-cyan-400 font-semibold">{product.revenue}</td>
                    <td className="px-4 py-3 text-right text-slate-300">{product.units.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-emerald-400">{product.margin}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`flex items-center justify-end gap-1 ${
                        product.growth.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {product.growth.startsWith('+') ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {product.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Revenue by Category</h2>
            <div className="space-y-3">
              {[
                { category: 'Premium', revenue: '$944,023', percent: 36 },
                { category: 'Professional', revenue: '$412,156', percent: 16 },
                { category: 'Standard', revenue: '$384,422', percent: 15 },
                { category: 'Value', revenue: '$298,000', percent: 11 },
                { category: 'Entry', revenue: '$184,000', percent: 7 }
              ].map((cat, idx) => (
                <div key={idx} className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white font-medium">{cat.category}</span>
                    <span className="text-sm text-cyan-400 font-semibold">{cat.revenue}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400" style={{ width: `${cat.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Units by Category</h2>
            <div className="space-y-3">
              {[
                { category: 'Premium', units: '61,077', percent: 28 },
                { category: 'Professional', units: '24,876', percent: 12 },
                { category: 'Standard', units: '21,456', percent: 10 },
                { category: 'Value', units: '18,065', percent: 8 },
                { category: 'Entry', units: '12,000', percent: 6 }
              ].map((cat, idx) => (
                <div key={idx} className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white font-medium">{cat.category}</span>
                    <span className="text-sm text-emerald-400 font-semibold">{cat.units}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${cat.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
