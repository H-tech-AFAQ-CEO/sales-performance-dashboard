'use client';

import { Package, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import Navbar from '@/components/navbar';
import StatCard from '@/components/stat-card';

export default function InventoryPage() {
  const metrics = [
    {
      label: 'Stock on Hand',
      value: '156,234',
      change: '+5.2%',
      icon: Package,
      trend: 'up' as const,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      label: 'Inventory Value',
      value: '$4,286,450',
      change: '+8.1%',
      icon: TrendingUp,
      trend: 'up' as const,
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      label: 'Turnover Ratio',
      value: '4.2x',
      change: '+1.3%',
      icon: TrendingUp,
      trend: 'up' as const,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      label: 'Low Stock Items',
      value: '12',
      change: '-2',
      icon: AlertTriangle,
      trend: 'up' as const,
      gradient: 'from-amber-500 to-orange-600'
    }
  ];

  const inventoryByStore = [
    { store: 'North Store', stock: 38420, value: '$1,087,234', status: 'optimal', turnover: 4.5 },
    { store: 'South Store', stock: 32156, value: '$912,445', status: 'optimal', turnover: 4.1 },
    { store: 'East Store', stock: 45678, value: '$1,298,523', status: 'high', turnover: 4.8 },
    { store: 'West Store', stock: 39980, value: '$988,248', status: 'optimal', turnover: 4.0 }
  ];

  const lowStockItems = [
    { sku: 'SKU-002', product: 'Pro Package', current: 234, reorder: 500, days: 3 },
    { sku: 'SKU-004', product: 'Standard Plus', current: 156, reorder: 400, days: 5 },
    { sku: 'SKU-005', product: 'Value Bundle', current: 89, reorder: 300, days: 2 },
    { sku: 'SKU-001', product: 'Premium Widget', current: 445, reorder: 800, days: 7 }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Inventory Management</h1>
          <p className="mt-2 text-slate-400">Stock levels, turnover ratios, and supply chain insights</p>
        </div>

        {/* KPI Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {metrics.map((metric, idx) => (
            <StatCard key={idx} {...metric} />
          ))}
        </div>

        {/* Store Inventory */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Inventory by Store</h2>
            <div className="space-y-3">
              {inventoryByStore.map((store, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-white">{store.store}</p>
                    <p className="text-xs text-slate-500">{store.stock.toLocaleString()} units</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-cyan-400">{store.value}</p>
                    <p className="text-xs text-emerald-400">{store.turnover}x turnover</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Stock Levels</h2>
            <div className="space-y-4">
              {[
                { label: 'Optimal (>60%)', value: 68, color: 'emerald' },
                { label: 'Caution (30-60%)', value: 24, color: 'amber' },
                { label: 'Critical (<30%)', value: 8, color: 'rose' }
              ].map((level, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-400">{level.label}</span>
                    <span className={`text-sm font-semibold text-${level.color}-400`}>{level.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r from-${level.color}-500 to-${level.color}-400`}
                      style={{ width: `${level.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">Low Stock Alerts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-left text-slate-400">SKU</th>
                  <th className="px-4 py-3 text-left text-slate-400">Product</th>
                  <th className="px-4 py-3 text-right text-slate-400">Current</th>
                  <th className="px-4 py-3 text-right text-slate-400">Reorder Point</th>
                  <th className="px-4 py-3 text-right text-slate-400">Days to Reorder</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-900/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-400">{item.sku}</td>
                    <td className="px-4 py-3 text-white">{item.product}</td>
                    <td className="px-4 py-3 text-right text-cyan-400">{item.current}</td>
                    <td className="px-4 py-3 text-right text-slate-300">{item.reorder}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.days <= 3 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {item.days}d
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
