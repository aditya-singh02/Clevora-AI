import { useState, useEffect } from 'react'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function useCounter(target, duration = 2000) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true })
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!inView) return
        const steps = 60
        let step = 0
        const timer = setInterval(() => {
            step++
            setCount(Math.round(target * (step / steps)))
            if (step >= steps) clearInterval(timer)
        }, duration / steps)
        return () => clearInterval(timer)
    }, [inView, target, duration])

    return { count, ref }
}