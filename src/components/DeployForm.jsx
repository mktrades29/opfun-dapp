import { useState } from 'react'
import { Rocket, Loader2, Sparkles, Coins, Tag, Hash, Zap, Shield } from 'lucide-react'
import { deployToken } from '../utils/deploy'

export default function DeployForm({ onSuccess }) {
  const [name, setName] = useState('')
  const [ticker, setTicker] = useState('')
  const [supply, setSupply] = useState('')
  const [deploying, setDeploying] = useState(false)
  const [step, setStep] = useState('')
  const [progress, setProgress] = useState(0)

  const isValid = name.trim() && ticker.trim() && supply.trim() && Number(supply) > 0

  const handleDeploy = async () => {
    if (!isValid || deploying) return

    setDeploying(true)
    setProgress(0)

    const steps = [
      { text: 'Connecting to OP_NET...', pct: 15 },
      { text: 'Compiling OP_20 contract...', pct: 35 },
      { text: 'Inscribing to Bitcoin L1...', pct: 55 },
      { text: 'Minting supply to deployer...', pct: 75 },
      { text: 'Confirming on Regtest...', pct: 90 },
    ]

    for (const s of steps) {
      setStep(s.text)
      setProgress(s.pct)
      await new Promise((r) => setTimeout(r, 600))
    }

    try {
      const result = await deployToken({
        name: name.trim(),
        ticker: ticker.trim().toUpperCase(),
        supply: supply.replace(/,/g, ''),
      })
      setProgress(100)
      await new Promise((r) => setTimeout(r, 300))
      onSuccess(result)
      setName('')
      setTicker('')
      setSupply('')
    } catch {
      setStep('Deployment failed. Try again.')
    } finally {
      setDeploying(false)
      setStep('')
      setProgress(0)
    }
  }

  return (
    <section className="w-full max-w-lg mx-auto px-4 sm:px-6" id="launch">
      <div className="glass-strong rounded-3xl p-8 gradient-border relative overflow-hidden">
        {/* Shimmer overlay */}
        {!deploying && <div className="absolute inset-0 animate-shimmer rounded-3xl pointer-events-none" />}

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-btc-orange/10 border border-btc-orange/20 text-btc-orange text-xs font-semibold mb-4">
              <Sparkles className="w-3 h-3" />
              NO CODE REQUIRED
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Launch Your Token
            </h2>
            <p className="text-btc-muted text-sm">
              Deploy an OP_20 token to Bitcoin L1 in seconds
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Token Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-btc-muted mb-2">
                <Tag className="w-4 h-4 text-btc-orange" />
                Token Name
              </label>
              <input
                type="text"
                placeholder="e.g. OPfun Coin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={deploying}
                className="w-full px-4 py-3.5 rounded-xl font-medium"
              />
            </div>

            {/* Ticker */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-btc-muted mb-2">
                <Hash className="w-4 h-4 text-btc-gold" />
                Ticker Symbol
              </label>
              <input
                type="text"
                placeholder="e.g. OPFUN"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase().slice(0, 8))}
                disabled={deploying}
                maxLength={8}
                className="w-full px-4 py-3.5 rounded-xl font-mono font-semibold uppercase"
              />
            </div>

            {/* Total Supply */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-btc-muted mb-2">
                <Coins className="w-4 h-4 text-btc-orange" />
                Total Supply
              </label>
              <input
                type="text"
                placeholder="e.g. 1000000000"
                value={supply}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '')
                  setSupply(raw)
                }}
                disabled={deploying}
                className="w-full px-4 py-3.5 rounded-xl font-mono"
              />
              {supply && (
                <p className="text-xs text-btc-muted mt-1.5 font-mono">
                  = {Number(supply).toLocaleString()} tokens
                </p>
              )}
            </div>

            {/* Quick Supply Buttons */}
            <div className="flex gap-2">
              {[
                { label: '1M', val: '1000000' },
                { label: '100M', val: '100000000' },
                { label: '1B', val: '1000000000' },
                { label: '69B', val: '69000000000' },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={() => setSupply(q.val)}
                  disabled={deploying}
                  className="flex-1 py-2 rounded-lg text-xs font-mono text-btc-muted bg-btc-surface border border-btc-border hover:border-btc-orange/30 hover:text-btc-orange transition-all cursor-pointer disabled:opacity-50"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Info Row */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-btc-dark/30 border border-btc-border/30">
              <span className="text-sm text-btc-muted flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-btc-success" />
                Decimals
              </span>
              <span className="text-sm text-white font-mono">18 (OP_20 standard)</span>
            </div>

            {/* Progress Bar */}
            {deploying && (
              <div className="space-y-2">
                <div className="w-full h-2 rounded-full bg-btc-surface overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-btc-orange to-btc-gold transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-btc-muted text-center font-mono">{progress}%</p>
              </div>
            )}

            {/* Deploy Button */}
            <button
              onClick={handleDeploy}
              disabled={!isValid || deploying}
              className={`
                w-full py-4 rounded-2xl font-bold text-lg transition-all cursor-pointer
                flex items-center justify-center gap-3
                ${
                  isValid && !deploying
                    ? 'bg-gradient-to-r from-btc-orange via-amber-500 to-btc-gold text-btc-dark animate-pulse-glow hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]'
                    : deploying
                      ? 'bg-btc-surface text-btc-orange border border-btc-orange/30'
                      : 'bg-btc-surface text-btc-muted border border-btc-border cursor-not-allowed'
                }
              `}
            >
              {deploying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">{step}</span>
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  FORGE TOKEN
                  <Zap className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Fine Print */}
            <p className="text-center text-[10px] text-btc-muted/40">
              Deploys an OP_20 token on OP_NET (Bitcoin L1).
              <br />
              Gas fees paid in BTC. Regtest deployment is free.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
