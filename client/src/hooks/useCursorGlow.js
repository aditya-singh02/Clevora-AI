import { useState, useEffect } from 'react'

export function useCursorGlow() {
    const [pos, setPos] = useState({ x: -1000, y: -1000 })

    useEffect(() => {
        const fn = (e) => setPos({ x: e.clientX, y: e.clientY })
        window.addEventListener('mousemove', fn, { passive: true })
        return () => window.removeEventListener('mousemove', fn)
    }, [])

    return pos
}