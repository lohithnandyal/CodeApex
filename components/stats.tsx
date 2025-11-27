"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Target, Award, Zap } from "lucide-react"
import { useFitness } from "@/components/fitness-context"
import { calculateEffortStreak, getMotivationalMessage } from "@/lib/data"
import type { Workout } from "@/lib/data"

export function Stats() {
  const { workouts } = useFitness()

  // Calculate total duration
  const totalMinutes = workouts.reduce((acc, w) => acc + w.duration, 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  // Average workout duration
  const avgDuration = workouts.length > 0 ? Math.round(totalMinutes / workouts.length) : 0

  // Effort Streak
  const streak = calculateEffortStreak(workouts)
  const lastWorkout = workouts.length > 0 ? workouts[workouts.length - 1] : undefined
  const motivationalMessage = getMotivationalMessage(streak, lastWorkout)

  // Most common mood
  const moodCounts = workouts.reduce(
    (acc: Record<string, number>, w: Workout) => {
      acc[w.mood] = (acc[w.mood] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  const commonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

  // Exercise breakdown
  const exerciseCounts = workouts.reduce(
    (acc: Record<string, number>, w: Workout) => {
      acc[w.type] = (acc[w.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-4">Your Stats</h2>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass border-[#00D9FF]/20 glow-blue">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-[#00D9FF] mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">
              {totalHours}h {remainingMinutes}m
            </p>
            <p className="text-xs text-muted-foreground">Total Time</p>
          </CardContent>
        </Card>
        <Card className="glass border-[#39FF14]/20 glow-green">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-[#39FF14] mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{avgDuration}m</p>
            <p className="text-xs text-muted-foreground">Avg Duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Effort Streak */}
      <Card className="glass border-[#FFD700]/20 glow-yellow">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-[#FFD700]" />
            <h3 className="font-semibold text-white">Effort Streak</h3>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-white">{streak}</p>
            <p className="text-sm text-muted-foreground mb-1">days</p>
          </div>
          <p className="text-sm text-[#FFD700] mt-2 italic">"{motivationalMessage}"</p>
        </CardContent>
      </Card>

      {/* Mood Stats */}
      <Card className="glass border-[#FF006E]/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-[#FF006E]" />
            <h3 className="font-semibold text-white">Most Common Mood</h3>
          </div>
          <p className="text-2xl">{commonMood}</p>
        </CardContent>
      </Card>

      {/* Exercise Breakdown */}
      <Card className="glass border-[#00D9FF]/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-[#00D9FF]" />
            <h3 className="font-semibold text-white">Exercise Breakdown</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(exerciseCounts).map(([type, count]) => {
              const percentage = Math.round((count / workouts.length) * 100)
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{type}</span>
                    <span className="text-white font-medium">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00D9FF] to-[#39FF14] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
