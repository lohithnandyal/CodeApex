"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface WorkoutTimerProps {
    open: boolean
    onClose: () => void
    onComplete: (duration: number) => void
    initialDuration: number // in minutes
    workoutName: string
}

const QUOTES = [
    "Don't stop when you're tired. Stop when you're done.",
    "Your body can stand almost anything. It's your mind that you have to convince.",
    "The only bad workout is the one that didn't happen.",
    "Sweat is just fat crying.",
    "Motivation is what gets you started. Habit is what keeps you going.",
    "A one-hour workout is 4% of your day. No excuses.",
    "Sweat is your body's way of showing progress.",
    "Pain is temporary, but pride is forever.",
    "The only bad workout is the one you didn't do.",
    "Results happen over time, not overnight. Work hard, stay consistent.",
    "Strong today, stronger tomorrow.",
    "Working out is not about being better than someone else. It's about being better than you used to be.",
    "Lift heavy, live light.",
    "Make your workout your daily therapy.",
    "The gym is my playground, and the weights are my toys. – Lee Priest",
    "It never gets easier, you just get stronger.",
    "Push yourself because no one else is going to do it for you.",
    "You don't find willpower; you create it.",
    "Obstacles are opportunities in disguise. Embrace the challenge.",
    "The harder the battle, the sweeter the victory. – Les Brown",
    "Challenge yourself to overcome, and the finish line will be within reach.",
    "Your strength doesn't come from what you can do; it comes from overcoming the things you once thought you couldn't.",
    "When you feel like quitting, remember why you started.",
    "Every accomplishment starts with the decision to try. – John F. Kennedy",
    "In every race, there's a moment when you think you can't go any further. That's when you dig deep and find out what you're really made of. – Steve Prefontaine",
    "Every obstacle is an opportunity to prove your strength.",
    "A Viking does not fear the storm; he becomes it.",
    "A warrior's strength is not measured by his sword, but by his spirit.",
    "With each battle, we carve our names into the sagas of history.",
    "In the heat of battle, you find your true self.",
    "The path to glory is paved with courage and sacrifice.",
    "The true measure of a Viking is his ability to rise after each fall.",
    "Embrace the struggle, for it shapes the warrior within.",
    "In the heart of every Viking beats the rhythm of the fjords.",
    "The brave may not live forever, but the cautious do not live at all. – Richard Branson",
]

export function WorkoutTimer({ open, onClose, onComplete, initialDuration, workoutName }: WorkoutTimerProps) {
    const [duration, setDuration] = useState(initialDuration) // in minutes
    const [timeLeft, setTimeLeft] = useState(initialDuration * 60) // in seconds
    const [isActive, setIsActive] = useState(false)
    const [quote, setQuote] = useState("")
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (open) {
            setDuration(initialDuration)
            setTimeLeft(initialDuration * 60)
            setIsActive(false)
            setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
        }
    }, [open, initialDuration])

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsActive(false)
            if (timerRef.current) clearInterval(timerRef.current)
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [isActive, timeLeft])

    const toggleTimer = () => {
        setIsActive(!isActive)
    }

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(duration * 60)
    }

    const handleDurationChange = (newDuration: number) => {
        setDuration(newDuration)
        setTimeLeft(newDuration * 60)
        setIsActive(false)
    }

    const handleFinish = () => {
        onComplete(duration)
        onClose()
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="glass border-[#00D9FF]/30 glow-blue max-w-md mx-4 rounded-2xl p-0 overflow-hidden">
                <div className="p-6 space-y-6 relative">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">{workoutName}</h2>
                        <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Timer Display */}
                    <div className="relative flex items-center justify-center py-8">
                        {/* Circular Progress Background */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 rounded-full border-4 border-white/5"></div>
                        </div>

                        {/* Timer Text */}
                        <div className="text-center z-10">
                            <div className="text-7xl font-bold font-mono tracking-wider bg-gradient-to-r from-[#00D9FF] to-[#39FF14] bg-clip-text text-transparent animate-pulse-slow">
                                {formatTime(timeLeft)}
                            </div>
                            <p className="text-muted-foreground mt-2 font-medium uppercase tracking-widest text-xs">Time Remaining</p>
                        </div>
                    </div>

                    {/* Duration Selection */}
                    <div className="flex justify-center gap-3">
                        {[5, 10, 15].map((mins) => (
                            <button
                                key={mins}
                                onClick={() => handleDurationChange(mins)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                    duration === mins
                                        ? "bg-[#00D9FF] text-black shadow-[0_0_15px_rgba(0,217,255,0.5)]"
                                        : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {mins} min
                            </button>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-6">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={resetTimer}
                            className="h-12 w-12 rounded-full border-white/10 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </Button>

                        <Button
                            size="icon"
                            onClick={toggleTimer}
                            className={cn(
                                "h-20 w-20 rounded-full shadow-xl transition-all duration-300 hover:scale-105",
                                isActive
                                    ? "bg-[#FF006E] hover:bg-[#FF006E]/90 shadow-[0_0_30px_rgba(255,0,110,0.4)]"
                                    : "bg-[#39FF14] hover:bg-[#39FF14]/90 text-black shadow-[0_0_30px_rgba(57,255,20,0.4)]"
                            )}
                        >
                            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                        </Button>

                        <Button
                            size="icon"
                            variant="outline"
                            onClick={handleFinish}
                            className="h-12 w-12 rounded-full border-[#39FF14]/30 text-[#39FF14] hover:bg-[#39FF14]/10 hover:text-[#39FF14] transition-colors"
                        >
                            <Check className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Quote */}
                    <div className="text-center px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-sm text-white/80 italic">"{quote}"</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
