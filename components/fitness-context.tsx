"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { type Workout, sampleWorkouts, type ExerciseType, type MoodType, getWorkoutSuggestion, type WeatherType } from "@/lib/data"

export interface HydrationLog {
    id: string
    amount: number // in ml
    date: string
}

export interface StepLog {
    id: string
    count: number
    date: string
}

interface FitnessContextType {
    workouts: Workout[]
    addWorkout: (workout: Omit<Workout, "id" | "date">) => void
    deleteWorkout: (id: string) => void
    getSuggestion: () => string
    streak: number
    totalWorkouts: number
    thisWeekWorkouts: number
    favoriteExercise: string
    weather: WeatherType
    setWeather: (weather: WeatherType) => void
    hydrationLogs: HydrationLog[]
    stepLogs: StepLog[]
    addHydrationLog: (amount: number) => void
    addStepLog: (count: number) => void
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined)

export function FitnessProvider({ children }: { children: React.ReactNode }) {
    const [workouts, setWorkouts] = useLocalStorage<Workout[]>("fit-track-workouts", [])
    const [weather, setWeather] = useState<WeatherType>("Sunny")
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

    const [hydrationLogs, setHydrationLogs] = useLocalStorage<HydrationLog[]>("fit-track-hydration", [])
    const [stepLogs, setStepLogs] = useLocalStorage<StepLog[]>("fit-track-steps", [])

    const addWorkout = (workout: Omit<Workout, "id" | "date">) => {
        const newWorkout: Workout = {
            ...workout,
            id: Date.now().toString(),
            date: new Date().toISOString(),
        }
        setWorkouts([newWorkout, ...workouts])
    }

    const addHydrationLog = (amount: number) => {
        const newLog: HydrationLog = {
            id: Date.now().toString(),
            amount,
            date: new Date().toISOString(),
        }
        setHydrationLogs([newLog, ...hydrationLogs])
    }

    const addStepLog = (count: number) => {
        const newLog: StepLog = {
            id: Date.now().toString(),
            count,
            date: new Date().toISOString(),
        }
        setStepLogs([newLog, ...stepLogs])
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
        // We can pass a default mood or track it in context later. For now, undefined mood.
        return getWorkoutSuggestion(hour, undefined, weather)
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
                weather,
                setWeather,
                hydrationLogs,
                stepLogs,
                addHydrationLog,
                addStepLog
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
