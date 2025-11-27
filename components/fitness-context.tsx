"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { type Workout, sampleWorkouts, type ExerciseType, type MoodType } from "@/lib/data"

interface FitnessContextType {
    workouts: Workout[]
    addWorkout: (workout: Omit<Workout, "id" | "date">) => void
    deleteWorkout: (id: string) => void
    getSuggestion: () => string
    streak: number
    totalWorkouts: number
    thisWeekWorkouts: number
    favoriteExercise: string
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined)

export function FitnessProvider({ children }: { children: React.ReactNode }) {
    const [workouts, setWorkouts] = useLocalStorage<Workout[]>("fit-track-workouts", [])
    const [isInitialized, setIsInitialized] = useState(false)

    // Initialize with sample data if empty on first load
    useEffect(() => {
        if (!isInitialized) {
            const stored = localStorage.getItem("fit-track-workouts")
            if (!stored) {
                setWorkouts(sampleWorkouts)
            }
            setIsInitialized(true)
        }
    }, [isInitialized, setWorkouts])

    const addWorkout = (workout: Omit<Workout, "id" | "date">) => {
        const newWorkout: Workout = {
            ...workout,
            id: Date.now().toString(),
            date: new Date().toISOString(),
        }
        setWorkouts([newWorkout, ...workouts])
    }

    const deleteWorkout = (id: string) => {
        setWorkouts(workouts.filter((w) => w.id !== id))
    }

    // Derived state
    const totalWorkouts = workouts.length

    const thisWeekWorkouts = workouts.filter((w) => {
        const workoutDate = new Date(w.date)
        const weekAgo = new Date(Date.now() - 7 * 86400000)
        return workoutDate >= weekAgo
    }).length

    const exerciseCounts = workouts.reduce(
        (acc: Record<string, number>, w: Workout) => {
            acc[w.type] = (acc[w.type] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    const favoriteExercise = Object.entries(exerciseCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None yet"

    // Simplified streak calculation (mocked for now as per original design, but could be real)
    // For now, let's keep the "15 days" logic or calculate it if we want to be fancy.
    // Let's make it semi-real: count unique days with workouts
    const uniqueDays = new Set(workouts.map(w => new Date(w.date).toDateString())).size
    const streak = uniqueDays > 0 ? uniqueDays : 0

    const getSuggestion = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Morning Energizer"
        if (hour < 17) return "Afternoon Power Session"
        return "Evening Relaxation Yoga"
    }

    return (
        <FitnessContext.Provider
            value={{
                workouts,
                addWorkout,
                deleteWorkout,
                getSuggestion,
                streak,
                totalWorkouts,
                thisWeekWorkouts,
                favoriteExercise,
            }}
        >
            {children}
        </FitnessContext.Provider>
    )
}

export function useFitness() {
    const context = useContext(FitnessContext)
    if (context === undefined) {
        throw new Error("useFitness must be used within a FitnessProvider")
    }
    return context
}
