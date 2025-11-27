"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trophy, Zap, Star } from "lucide-react"
import confetti from "canvas-confetti"

interface CelebrationModalProps {
    open: boolean
    onClose: () => void
    streak: number
    message: string
}

export function CelebrationModal({ open, onClose, streak, message }: CelebrationModalProps) {
    useEffect(() => {
        if (open) {
            // Fire confetti
            const duration = 3000
            const animationEnd = Date.now() + duration
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now()

                if (timeLeft <= 0) {
                    return clearInterval(interval)
                }

                const particleCount = 50 * (timeLeft / duration)

                // since particles fall down, start a bit higher than random
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                })
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                })
            }, 250)

            return () => clearInterval(interval)
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="glass border-[#FFD700]/30 glow-yellow max-w-md mx-4 rounded-2xl text-center">
                <DialogHeader>
                    <DialogTitle className="sr-only">Celebration</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center py-6 space-y-6">
                    {/* Animated Icon */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#FFD700] blur-2xl opacity-20 rounded-full animate-pulse" />
                        <div className="w-24 h-24 rounded-full glass border border-[#FFD700]/50 flex items-center justify-center relative z-10 animate-bounce">
                            {streak >= 3 ? (
                                <Zap className="w-12 h-12 text-[#FFD700] fill-[#FFD700]" />
                            ) : (
                                <Star className="w-12 h-12 text-[#FFD700] fill-[#FFD700]" />
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">Awesome Job! 🎉</h2>
                        <p className="text-[#FFD700] font-medium text-lg italic">"{message}"</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 w-full border border-white/10">
                        <p className="text-muted-foreground text-sm mb-1">Current Streak</p>
                        <div className="flex items-center justify-center gap-2">
                            <Zap className="w-6 h-6 text-[#FFD700]" />
                            <span className="text-4xl font-bold text-white">{streak}</span>
                            <span className="text-xl text-white/60">days</span>
                        </div>
                    </div>

                    <Button
                        onClick={onClose}
                        className="w-full h-12 text-base font-semibold bg-[#FFD700] text-black hover:bg-[#FFD700]/90 hover:scale-[1.02] transition-all duration-300"
                    >
                        Keep it up!
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
