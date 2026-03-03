import { useEffect, useRef } from 'react'

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches
  ) {
    return null
  }

  const mouse = useRef({ x: 0, y: 0 })
  const glowPos = useRef({ x: 0, y: 0 })
  const hover = useRef(false)
  const clicked = useRef(false)

  useEffect(() => {
    // Zero latency for the main tip, slight "luxury" lag for the glow (0.75)
    const GLOW_SPEED = 0.75
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      const target = e.target as HTMLElement
      hover.current = !!target.closest("button, a, [role='button'], .clickable")
    }

    const onDown = () => (clicked.current = true)
    const onUp = () => (clicked.current = false)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    let raf: number
    const animate = () => {
      // Fancy Rotate: -25deg for that aggressive top-left "stealth" look
      const rotation = -25
      const scale = clicked.current ? 0.8 : hover.current ? 1.6 : 1

      if (cursorRef.current) {
        cursorRef.current.style.transform = `
          translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)
          translate(-50%, -50%)
          rotate(${rotation}deg)
          scale(${scale})
        `
      }

      glowPos.current.x = lerp(glowPos.current.x, mouse.current.x, GLOW_SPEED)
      glowPos.current.y = lerp(glowPos.current.y, mouse.current.y, GLOW_SPEED)

      if (glowRef.current) {
        glowRef.current.style.transform = `
          translate3d(${glowPos.current.x}px, ${glowPos.current.y}px, 0)
          translate(-50%, -50%)
          scale(${hover.current ? 1.8 : 1})
        `
        glowRef.current.style.opacity = hover.current ? '0.7' : '0.3'
      }

      raf = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  return (
    <>
      {/* THE FANCY POINTER */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[2147483647]"
        style={{
          width: 22,
          height: 26,
          // Gradient using your Tailwind v4 theme colors
          background:
            'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)',
          // Fancy wide-chevron shape (Pointing Up-Left)
          clipPath: 'polygon(50% 0%, 100% 100%, 50% 75%, 0% 100%)',
          boxShadow: '0 0 20px var(--color-accent)',
          willChange: 'transform',
          transition: 'scale 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      />

      {/* THE FANCY GLOW */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-[2147483646]"
        style={{
          width: 65,
          height: 65,
          borderRadius: '50%',
          // Dual layered glow
          background:
            'radial-gradient(circle, var(--color-accent) 0%, transparent 65%)',
          filter: 'blur(14px)',
          mixBlendMode: 'screen', // Makes it look brighter on dark backgrounds
          willChange: 'transform',
        }}
      />
    </>
  )
}
