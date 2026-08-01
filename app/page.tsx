'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Percent, Package, Calendar } from 'lucide-react';

export default function Home() {
  const [dateRange, setDateRange] = useState('7d');

  const metrics = [
    {
      label: 'Total Revenue',
      value: '$2,620,601',
      change: '+12.5%',
      icon: DollarSign,
      trend: 'up',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      label: 'Units Sold',
      value: '216,474',
      change: '+8.2%',
      icon: ShoppingCart,
      trend: 'up',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      label: 'Gross Margin',
      value: '$1,607,877',
      change: '+15.3%',
      icon: TrendingUp,
      trend: 'up',
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      label: 'Margin %',
      value: '61.4%',
      change: '+2.1%',
      icon: Percent,
      trend: 'up',
      gradient: 'from-amber-500 to-orange-600'
    }
  ];

  const regions = [
    { name: 'North', revenue: '$680,456', units: 54821, margin: '61.2%' },
    { name: 'South', revenue: '$584,123', units: 48956, margin: '62.1%' },
    { name: 'East', revenue: '$721,089', units: 62134, margin: '60.8%' },
    { name: 'West', revenue: '$634,933', units: 50563, margin: '61.9%' }
  ];

  const topProducts = [
    { sku: 'SKU-001', name: 'Premium Widget', revenue: '$487,234', units: 32145, margin: '$298,223' },
    { sku: 'SKU-003', name: 'Elite Service', revenue: '$456,789', units: 28932, margin: '$279,643' },
    { sku: 'SKU-002', name: 'Pro Package', revenue: '$412,156', units: 24876, margin: '$252,415' },
    { sku: 'SKU-004', name: 'Standard Plus', revenue: '$384,422', units: 21456, margin: '$235,298' },
    { sku: 'SKU-005', name: 'Value Bundle', revenue: '$298,000', units: 18065, margin: '$182,600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/50 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Sales & Inventory Analytics
              </h1>
              <p className="mt-1 text-sm text-slate-400">90-day performance dashboard</p>
            </div>
            <div className="flex gap-2">
              {['7d', '30d', '90d'].map(period => (
                <button
                  key={period}
                  onClick={() => setDateRange(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    dateRange === period
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
        {/* KPI Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-400">{metric.label}</span>
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.gradient} opacity-80`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-3xl font-bold text-white">{metric.value}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {metric.trend === 'up' ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">{metric.change}</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-4 h-4 text-rose-400" />
                        <span className="text-rose-400">{metric.change}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Revenue Trend */}
          <div className="lg:col-span-2 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Revenue Trend</h2>
            <div className="h-64 flex items-end justify-around gap-2">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${Math.random() * 100 + 20}%` }}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-slate-500">
              <span>May 3</span>
              <span>Jul 31</span>
            </div>
          </div>

          {/* Inventory Status */}
          <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Inventory Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-400">In Stock</span>
                  <span className="text-sm font-semibold text-emerald-400">78%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-400">Low Stock</span>
                  <span className="text-sm font-semibold text-amber-400">18%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/5 bg-gradient-to-r from-amber-500 to-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-400">Out of Stock</span>
                  <span className="text-sm font-semibold text-rose-400">4%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/20 bg-gradient-to-r from-rose-500 to-rose-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regional & Product Performance */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Regional Performance */}
          <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Regional Performance</h2>
            <div className="space-y-3">
              {regions.map((region, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-white">{region.name}</p>
                    <p className="text-xs text-slate-500">{region.units.toLocaleString()} units</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-cyan-400">{region.revenue}</p>
                    <p className="text-xs text-emerald-400">{region.margin} margin</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Top Products by Revenue</h2>
            <div className="space-y-2">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors group">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">{product.sku}</span>
                      <p className="font-medium text-white text-sm">{product.name}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{product.units.toLocaleString()} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-400 text-sm">{product.revenue}</p>
                    <p className="text-xs text-cyan-400">{product.margin} margin</p>
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
