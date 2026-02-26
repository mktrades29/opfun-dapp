import { useState } from 'react'
import AnimatedBackground from './components/AnimatedBackground'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import DeployForm from './components/DeployForm'
import RecentForges from './components/RecentForges'
import SuccessModal from './components/SuccessModal'

export default function App() {
  const [result, setResult] = useState(null)

  return (
    <div className="min-h-screen bg-btc-dark relative overflow-hidden">
      {/* Background image — the orange glow arc */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Repeat at top, flipped */}
      <div
        className="fixed inset-0 z-0 opacity-40"
        style={{
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          transform: 'rotate(180deg)',
        }}
      />
      {/* Subtle grid overlay */}
      <div className="fixed inset-0 z-0 bg-grid opacity-30" />

      {/* Animated particles canvas */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <HeroSection />
        <DeployForm onSuccess={setResult} />
        <RecentForges />

        {/* Footer */}
        <footer className="text-center py-16 mt-20 border-t border-btc-border/20">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img
              src="/logo.png"
              alt="OPfun"
              className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(247,147,26,0.4)]"
            />
            <span className="text-lg font-bold">
              <span className="text-btc-orange">OP</span>
              <span className="text-white">fun</span>
            </span>
          </div>
          <p className="text-btc-muted text-sm">
            The fastest token launcher on{' '}
            <span className="text-btc-orange font-semibold">Bitcoin L1</span>{' '}
            via <span className="text-btc-gold font-semibold">OP_NET</span>
          </p>
          <p className="text-btc-muted/30 text-xs mt-2">
            OPfun &copy; {new Date().getFullYear()} &mdash; Vibecode Contest Entry
          </p>
        </footer>
      </div>

      {/* Success Modal */}
      {result && (
        <SuccessModal result={result} onClose={() => setResult(null)} />
      )}
    </div>
  )
}
