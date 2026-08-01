import { TrendingUp, TrendingDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: 'up' | 'down';
  gradient: string;
}

export default function StatCard({ label, value, change, icon: Icon, trend, gradient }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 group">
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-400">{label}</span>
          <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} opacity-80`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="mb-3">
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="flex items-center gap-1 text-sm">
          {trend === 'up' ? (
            <>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">{change}</span>
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span className="text-rose-400">{change}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
