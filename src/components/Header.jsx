import { useState } from 'react'
import { Wallet, Wifi, WifiOff, ChevronDown } from 'lucide-react'

export default function Header() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState('')

  const connectWallet = async () => {
    setConnected(true)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789'
    let addr = ''
    for (let i = 0; i < 8; i++) addr += chars[Math.floor(Math.random() * chars.length)]
    setAddress(addr + '...' + addr.slice(0, 4))
  }

  const disconnect = () => {
    setConnected(false)
    setAddress('')
  }

  return (
    <header className="glass-strong sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="OPfun"
            className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(247,147,26,0.5)] hover:scale-110 hover:rotate-6 transition-all duration-300"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-none">
              <span className="text-gradient-orange">OP</span>
              <span className="text-white">fun</span>
            </h1>
            <p className="text-[9px] text-btc-muted tracking-[0.2em] uppercase">
              Bitcoin L1 Token Launcher
            </p>
          </div>
        </div>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-6">
          {['Launch', 'Tokens', 'Trending', 'Docs'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-btc-muted hover:text-btc-orange transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Network + Wallet */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-btc-surface border border-btc-border text-xs">
            {connected ? (
              <Wifi className="w-3 h-3 text-btc-success" />
            ) : (
              <WifiOff className="w-3 h-3 text-btc-muted" />
            )}
            <span className="text-btc-muted">Bitcoin Regtest</span>
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-btc-success animate-pulse' : 'bg-btc-danger'}`} />
          </div>

          {connected ? (
            <button
              onClick={disconnect}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-btc-surface border border-btc-orange/20 text-sm text-btc-orange hover:bg-btc-orange/10 hover:border-btc-orange/40 transition-all cursor-pointer group"
            >
              <div className="w-2 h-2 rounded-full bg-btc-success" />
              <span className="font-mono text-xs">{address}</span>
              <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition" />
            </button>
          ) : (
            <button
              onClick={connectWallet}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-btc-orange to-btc-amber text-btc-dark font-semibold text-sm hover:brightness-110 hover:scale-105 transition-all glow-orange cursor-pointer active:scale-95"
            >
              <Wallet className="w-4 h-4" />
              Connect OP_WALLET
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
