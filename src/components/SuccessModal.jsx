import { CheckCircle, Copy, ExternalLink, X, PartyPopper, Rocket } from 'lucide-react'
import { useState } from 'react'

export default function SuccessModal({ result, onClose }) {
  const [copied, setCopied] = useState('')

  if (!result) return null

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-strong rounded-3xl p-8 max-w-md w-full animate-fade-in-up glow-orange-intense overflow-hidden">
        {/* Confetti-like decorative elements */}
        <div className="absolute top-4 left-8 w-3 h-3 orange-pill opacity-30 animate-float" />
        <div className="absolute top-12 right-12 w-4 h-2 orange-pill opacity-20 animate-float-delayed" />
        <div className="absolute bottom-16 left-6 w-5 h-2 orange-pill opacity-15 animate-float-slow" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-btc-muted hover:text-white transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon — Orange Pill */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src="/logo.png"
              alt="Success"
              className="w-20 h-20 object-contain drop-shadow-[0_0_30px_rgba(0,230,118,0.3)] animate-float"
            />
            <div className="absolute -top-1 -right-1">
              <PartyPopper className="w-6 h-6 text-btc-gold animate-bounce" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-center mb-1">
          <span className="text-gradient-orange">Token Forged!</span>
        </h3>
        <p className="text-center text-btc-muted text-sm mb-6">
          Your token is live on Bitcoin L1 via OP_NET
        </p>

        {/* Token Info Card */}
        <div className="bg-btc-dark/60 rounded-2xl p-5 space-y-3 mb-6 border border-btc-border/30">
          <div className="flex justify-between items-center">
            <span className="text-btc-muted text-sm">Token</span>
            <span className="text-white font-bold text-lg">
              <span className="text-btc-orange">${result.token.ticker}</span>
              <span className="text-btc-muted text-xs ml-2">({result.token.name})</span>
            </span>
          </div>
          <div className="h-px bg-btc-border/30" />
          <div className="flex justify-between">
            <span className="text-btc-muted text-sm">Supply</span>
            <span className="text-btc-gold font-mono font-semibold">
              {Number(result.token.supply).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-btc-muted text-sm">Block Height</span>
            <span className="text-btc-muted font-mono text-sm">
              #{result.blockHeight.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-btc-muted text-sm">Network</span>
            <span className="text-btc-success text-sm font-semibold">{result.network}</span>
          </div>
        </div>

        {/* Signature */}
        <div className="space-y-2 mb-3">
          <label className="text-xs text-btc-muted font-medium">Transaction Hash</label>
          <div className="flex items-center gap-2 bg-btc-dark/60 rounded-xl p-3 border border-btc-border/20">
            <code className="text-[11px] text-btc-orange font-mono truncate flex-1">
              {result.txHash}
            </code>
            <button
              onClick={() => copyToClipboard(result.txHash, 'sig')}
              className="text-btc-muted hover:text-btc-orange transition cursor-pointer shrink-0"
            >
              {copied === 'sig' ? <CheckCircle className="w-4 h-4 text-btc-success" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mint Address */}
        <div className="space-y-2">
          <label className="text-xs text-btc-muted font-medium">Contract Address</label>
          <div className="flex items-center gap-2 bg-btc-dark/60 rounded-xl p-3 border border-btc-border/20">
            <code className="text-[11px] text-btc-gold font-mono truncate flex-1">
              {result.contractAddress}
            </code>
            <button
              onClick={() => copyToClipboard(result.contractAddress, 'mint')}
              className="text-btc-muted hover:text-btc-gold transition cursor-pointer shrink-0"
            >
              {copied === 'mint' ? <CheckCircle className="w-4 h-4 text-btc-success" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-btc-surface border border-btc-border text-sm text-white hover:bg-btc-border hover:border-btc-orange/20 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            Forge Another
          </button>
          <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-btc-orange to-btc-gold text-btc-dark font-semibold text-sm hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95">
            <ExternalLink className="w-4 h-4" />
            View Explorer
          </button>
        </div>
      </div>
    </div>
  )
}
