import { Flame, TrendingUp, Clock } from 'lucide-react'

const MOCK_FORGES = [
  { name: 'PEPE', supply: '69B', time: '12s ago', emoji: '🐸', change: '+420%' },
  { name: 'BONK', supply: '1T', time: '34s ago', emoji: '🐕', change: '+180%' },
  { name: 'MOON', supply: '100M', time: '1m ago', emoji: '🌙', change: '+95%' },
  { name: 'WAGMI', supply: '10B', time: '2m ago', emoji: '🚀', change: '+67%' },
  { name: 'DEGEN', supply: '420M', time: '3m ago', emoji: '🎰', change: '+230%' },
  { name: 'COPE', supply: '1B', time: '4m ago', emoji: '😭', change: '+45%' },
  { name: 'BASED', supply: '69M', time: '5m ago', emoji: '🧠', change: '+310%' },
  { name: 'SHILL', supply: '500M', time: '6m ago', emoji: '📢', change: '+89%' },
  { name: 'FOMO', supply: '999M', time: '8m ago', emoji: '😱', change: '+156%' },
  { name: 'NGMI', supply: '666M', time: '10m ago', emoji: '💀', change: '+12%' },
]

export default function RecentForges() {
  const items = [...MOCK_FORGES, ...MOCK_FORGES]

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-btc-orange" />
          <h2 className="text-xl font-bold text-white">Trending Forges</h2>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold tracking-wider animate-pulse">
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-btc-muted">
          <Clock className="w-3 h-3" />
          Updates every block
        </div>
      </div>

      {/* Scrolling Ticker */}
      <div className="glass rounded-2xl overflow-hidden py-4 mb-6">
        <div className="flex animate-scroll whitespace-nowrap">
          {items.map((forge, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-3 mx-3 px-4 py-2.5 rounded-xl bg-btc-surface/60 border border-btc-border/50 shrink-0 hover:border-btc-orange/30 transition-colors group cursor-pointer"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{forge.emoji}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-btc-orange">${forge.name}</span>
                <span className="text-btc-muted text-xs">{forge.supply}</span>
              </div>
              <span className="text-btc-success text-xs font-mono font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                {forge.change}
              </span>
              <span className="text-[10px] text-btc-muted/50">{forge.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Token Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-btc-border/30 flex items-center justify-between">
          <span className="text-sm font-semibold text-btc-muted">Recent Launches</span>
          <span className="text-[10px] text-btc-muted/50 font-mono">Last 24h</span>
        </div>
        <div className="divide-y divide-btc-border/20">
          {MOCK_FORGES.slice(0, 5).map((token, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-btc-surface/30 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <span className="text-btc-muted text-xs font-mono w-4">#{i + 1}</span>
                <span className="text-lg">{token.emoji}</span>
                <div>
                  <span className="font-semibold text-white group-hover:text-btc-orange transition-colors">${token.name}</span>
                  <p className="text-[11px] text-btc-muted">{token.supply} supply</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-btc-success text-sm font-mono font-semibold">{token.change}</span>
                <p className="text-[10px] text-btc-muted">{token.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
