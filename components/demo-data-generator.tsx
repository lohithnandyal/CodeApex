"use client"

import { Button } from "@/components/ui/button"
import { useFitness } from "@/components/fitness-context"
import { Database } from "lucide-react"
import type { ExerciseType, MoodType } from "@/lib/data"

const exerciseTypes: ExerciseType[] = ["Yoga", "Running", "HIIT", "Walking", "Strength"]
const moodTypes: MoodType[] = ["😰 Stressed", "⚡ Energetic", "😴 Tired", "😊 Happy", "😟 Anxious"]

export function DemoDataGenerator() {
    const { addWorkout, workouts } = useFitness()

    const generateData = () => {
        // Generate 20 random workouts over the last 30 days
        for (let i = 0; i < 20; i++) {
            const daysAgo = Math.floor(Math.random() * 30)
            const date = new Date()
            date.setDate(date.getDate() - daysAgo)

            const type = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)]
            const mood = moodTypes[Math.floor(Math.random() * moodTypes.length)]
            const duration = 15 + Math.floor(Math.random() * 45) // 15-60 mins

            addWorkout({
                type,
                duration,
                mood,
                date: date.toISOString(),
                notes: "Generated demo workout",
            })
        }
    }

    if (workouts.length > 5) return null // Hide if we already have data

    return (
        <div className="fixed bottom-24 right-4 z-50">
            <Button
                onClick={generateData}
                size="sm"
                variant="outline"
                className="glass text-xs border-[#00D9FF]/30 hover:bg-[#00D9FF]/10"
            >
                <Database className="w-3 h-3 mr-2" />
                Demo Data
            </Button>
        </div>
    )
}
