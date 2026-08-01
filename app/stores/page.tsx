'use client';

import { MapPin, Users, TrendingUp, Award } from 'lucide-react';
import Navbar from '@/components/navbar';
import StatCard from '@/components/stat-card';

export default function StoresPage() {
  const metrics = [
    {
      label: 'Total Stores',
      value: '5',
      change: 'Locations',
      icon: MapPin,
      trend: 'up' as const,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      label: 'Avg Store Revenue',
      value: '$524,120',
      change: '+10.8%',
      icon: TrendingUp,
      trend: 'up' as const,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      label: 'Top Store',
      value: 'East Store',
      change: '$721,089',
      icon: Award,
      trend: 'up' as const,
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      label: 'Avg Customers',
      value: '43,295',
      change: '+6.2%',
      icon: Users,
      trend: 'up' as const,
      gradient: 'from-violet-500 to-purple-600'
    }
  ];

  const stores = [
    { name: 'North Store', region: 'North', revenue: '$680,456', units: 54821, customers: 42156, margin: '61.2%', status: 'performing' },
    { name: 'East Store', region: 'East', revenue: '$721,089', units: 62134, customers: 48234, margin: '60.8%', status: 'top' },
    { name: 'South Store', region: 'South', revenue: '$584,123', units: 48956, customers: 38123, margin: '62.1%', status: 'performing' },
    { name: 'West Store', region: 'West', revenue: '$634,933', units: 50563, customers: 41342, margin: '61.9%', status: 'performing' }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Regional Performance</h1>
          <p className="mt-2 text-slate-400">Store-level metrics and regional analysis</p>
        </div>

        {/* KPI Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {metrics.map((metric, idx) => (
            <StatCard key={idx} {...metric} />
          ))}
        </div>

        {/* Store Performance Grid */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {stores.map((store, idx) => (
            <div key={idx} className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50 hover:border-slate-600/70 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{store.name}</h3>
                  <p className="text-sm text-slate-400">{store.region} Region</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  store.status === 'top' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {store.status === 'top' ? 'Top Performer' : 'Performing Well'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Revenue</p>
                  <p className="text-xl font-bold text-cyan-400">{store.revenue}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Units Sold</p>
                  <p className="text-xl font-bold text-emerald-400">{store.units.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Customers</p>
                  <p className="text-xl font-bold text-violet-400">{store.customers.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Margin %</p>
                  <p className="text-xl font-bold text-amber-400">{store.margin}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-500">Revenue Performance</p>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                    style={{ width: `${(parseFloat(store.revenue.replace(/[$,]/g, '')) / 721089) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Regional Summary */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Regional Comparison</h2>
            <div className="space-y-4">
              {[
                { region: 'East', revenue: '$721,089', percent: 28, trend: '+15.2%' },
                { region: 'North', revenue: '$680,456', percent: 26, trend: '+12.1%' },
                { region: 'West', revenue: '$634,933', percent: 24, trend: '+9.8%' },
                { region: 'South', revenue: '$584,123', percent: 22, trend: '+8.5%' }
              ].map((reg, idx) => (
                <div key={idx} className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-white">{reg.region}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-cyan-400 font-semibold">{reg.revenue}</span>
                      <span className="text-xs text-emerald-400">{reg.trend}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400" style={{ width: `${reg.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Store Efficiency</h2>
            <div className="space-y-4">
              {[
                { metric: 'Revenue per Customer', value: '$60.45', change: '+4.2%', color: 'cyan' },
                { metric: 'Avg Transaction Value', value: '$145.23', change: '+3.8%', color: 'emerald' },
                { metric: 'Inventory Turnover', value: '4.3x', change: '+1.5%', color: 'violet' },
                { metric: 'Margin per Store', value: '$347,285', change: '+2.1%', color: 'amber' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-slate-400">{item.metric}</p>
                  <div className="text-right">
                    <p className={`text-sm font-semibold text-${item.color}-400`}>{item.value}</p>
                    <p className="text-xs text-emerald-400">{item.change}</p>
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
