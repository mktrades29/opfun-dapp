import { Rocket, TrendingUp, Users, Coins, ArrowDown } from 'lucide-react'

const STATS = [
  { icon: Coins, value: '24,891', label: 'Tokens Launched', color: 'text-btc-orange' },
  { icon: TrendingUp, value: '$12.4M', label: 'Total Volume', color: 'text-btc-gold' },
  { icon: Users, value: '18,203', label: 'Traders', color: 'text-btc-success' },
]

export default function HeroSection() {
  return (
    <section className="relative pt-16 pb-10 px-4 text-center overflow-visible">
      {/* Large floating pill logo — hero centerpiece */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <img
            src="/logo.png"
            alt="OPfun Orange Pill"
            className="w-32 sm:w-40 md:w-48 h-auto drop-shadow-[0_0_40px_rgba(247,147,26,0.4)] animate-float"
          />
          {/* Glow ring behind the pill */}
          <div className="absolute inset-0 -z-10 rounded-full bg-btc-orange/10 blur-3xl scale-150" />
        </div>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-btc-orange/10 border border-btc-orange/20 text-btc-orange text-xs font-semibold mb-6 animate-fade-in-up">
        <Rocket className="w-3.5 h-3.5" />
        THE #1 TOKEN LAUNCHER ON BITCOIN L1
      </div>

      {/* Main Title */}
      <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-none mb-6">
        <span className="text-gradient-orange">OP</span>
        <span className="text-white">fun</span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-btc-muted max-w-lg mx-auto mb-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        Launch your token in <span className="text-btc-orange font-semibold">60 seconds</span>.
        <br />
        No code. No BS. Just <span className="text-btc-gold font-semibold">deploy & moon</span>.
      </p>

      {/* Chain pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
        {[
          { label: 'OP_NET Powered', color: 'bg-btc-orange' },
          { label: 'OP_20 Standard', color: 'bg-btc-gold' },
          { label: 'Bitcoin L1', color: 'bg-btc-success' },
          { label: 'No Code', color: 'bg-btc-gold' },
        ].map((tag) => (
          <span
            key={tag.label}
            className="inline-flex items-center gap-1.5 text-[11px] text-btc-muted"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${tag.color}`} />
            {tag.label}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 sm:gap-10 mb-10 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className={`text-2xl sm:text-3xl font-bold font-mono ${stat.color}`}>
                {stat.value}
              </span>
            </div>
            <p className="text-[11px] text-btc-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="animate-bounce">
        <ArrowDown className="w-5 h-5 text-btc-muted/40 mx-auto" />
      </div>

      {/* Small floating pills (decorative) */}
      <img src="/logo.png" alt="" className="absolute top-20 left-[8%] w-8 sm:w-12 opacity-15 animate-float pointer-events-none" />
      <img src="/logo.png" alt="" className="absolute top-40 right-[10%] w-6 sm:w-10 opacity-10 animate-float-delayed pointer-events-none" />
      <img src="/logo.png" alt="" className="absolute bottom-10 left-[15%] w-5 sm:w-8 opacity-8 animate-float-slow pointer-events-none" />
      <img src="/logo.png" alt="" className="absolute top-60 right-[5%] w-4 sm:w-6 opacity-5 animate-float pointer-events-none" />
    </section>
  )
}
