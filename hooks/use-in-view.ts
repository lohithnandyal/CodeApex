"use client"

import { useEffect, useState, useRef } from "react"

export function useInView(options?: IntersectionObserverInit) {
    const ref = useRef<HTMLDivElement>(null)
    const [isInView, setIsInView] = useState(false)
    const [hasTriggered, setHasTriggered] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasTriggered) {
                    setIsInView(true)
                    setHasTriggered(true)
                }
            },
            {
                threshold: 0.1,
                ...options,
            }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [options, hasTriggered])

    return { ref, isInView }
}
