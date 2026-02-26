import { useEffect, useRef } from 'react'

// Floating orange pills + particle system
export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    let animationId

    const handleResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Particles
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.6 ? '#F7931A' : Math.random() > 0.5 ? '#FFD700' : '#9945FF',
    }))

    // Floating pills
    const pills = Array.from({ length: 8 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      width: Math.random() * 40 + 20,
      height: Math.random() * 16 + 8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.005,
      opacity: Math.random() * 0.12 + 0.03,
    }))

    function drawPill(x, y, w, h, rotation, opacity) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.beginPath()
      const r = h / 2
      ctx.moveTo(-w / 2 + r, -h / 2)
      ctx.lineTo(w / 2 - r, -h / 2)
      ctx.arc(w / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2)
      ctx.lineTo(-w / 2 + r, h / 2)
      ctx.arc(-w / 2 + r, 0, r, Math.PI / 2, -Math.PI / 2)
      ctx.closePath()

      const grad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0)
      grad.addColorStop(0, `rgba(247, 147, 26, ${opacity})`)
      grad.addColorStop(1, `rgba(255, 215, 0, ${opacity * 0.7})`)
      ctx.fillStyle = grad
      ctx.fill()

      ctx.strokeStyle = `rgba(247, 147, 26, ${opacity * 0.5})`
      ctx.lineWidth = 0.5
      ctx.stroke()
      ctx.restore()
    }

    function animate() {
      ctx.clearRect(0, 0, w, h)

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(247, 147, 26, ${0.03 * (1 - dist / 150)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color.replace(')', `, ${p.opacity})`).replace('rgb', 'rgba').replace('#F7931A', 'rgba(247,147,26').replace('#FFD700', 'rgba(255,215,0').replace('#9945FF', 'rgba(153,69,255')
        // Simpler approach
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.fill()
        ctx.globalAlpha = 1

        p.x += p.vx
        p.y += p.vy
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w }
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
      }

      // Draw floating pills
      for (const pill of pills) {
        drawPill(pill.x, pill.y, pill.width, pill.height, pill.rotation, pill.opacity)
        pill.x += pill.vx
        pill.y += pill.vy
        pill.rotation += pill.rotSpeed
        if (pill.x < -60) pill.x = w + 60
        if (pill.x > w + 60) pill.x = -60
        if (pill.y < -60) pill.y = h + 60
        if (pill.y > h + 60) pill.y = -60
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
