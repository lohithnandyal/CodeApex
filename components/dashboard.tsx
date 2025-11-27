"use client"

import { useState, useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Flame, Calendar, Heart, Lightbulb, Sparkles, Sun, CloudRain, Cloud } from "lucide-react"
import { WeeklyChart } from "@/components/weekly-chart"
import { MoodChart } from "@/components/mood-chart"
import { ConsistencyChart } from "@/components/consistency-chart"
import { WeatherWidget } from "@/components/weather-widget"
import { useFitness } from "@/components/fitness-context"
import { type WeatherType } from "@/lib/data"
import { cn } from "@/lib/utils"

interface DashboardProps {
  onOpenLogger: () => void
}

export function Dashboard({ onOpenLogger }: DashboardProps) {
  const {
    streak,
    totalWorkouts,
    thisWeekWorkouts,
    favoriteExercise,
    getSuggestion,
    weather,
    setWeather
  } = useFitness()

  const [suggestion, setSuggestion] = useState("")

  useEffect(() => {
    setSuggestion(getSuggestion())
  }, [getSuggestion, weather]) // Re-run when weather changes

  return (
    <div className="space-y-6">
      {/* Streak Counter */}
      <Card className="glass border-[#00D9FF]/20 glow-blue overflow-hidden">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-6 h-6 text-[#FF006E]" />
            <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Effort Streak</span>
            <Flame className="w-6 h-6 text-[#FF006E]" />
          </div>
          <div className="animate-float">
            <span className="text-6xl font-bold bg-gradient-to-r from-[#00D9FF] to-[#39FF14] bg-clip-text text-transparent">
              {streak}
            </span>
            <span className="text-2xl font-semibold text-white ml-2">Days</span>
          </div>
          <p className="text-muted-foreground text-sm mt-2">Keep it going! 🔥</p>
        </CardContent>
      </Card>

      {/* Log Workout Button */}
      <Button
        onClick={onOpenLogger}
        className="w-full h-14 text-lg font-semibold gradient-btn border-0 text-white hover:scale-[1.02] transition-all duration-300 animate-pulse-glow"
      >
        <Dumbbell className="w-5 h-5 mr-2" />
        Log Workout
      </Button>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="glass border-[#00D9FF]/20 hover:glow-blue transition-all duration-300">
          <CardContent className="p-4 text-center">
            <Calendar className="w-5 h-5 text-[#00D9FF] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{totalWorkouts}</p>
            <p className="text-xs text-muted-foreground">Total Workouts</p>
          </CardContent>
        </Card>
        <Card className="glass border-[#39FF14]/20 hover:glow-green transition-all duration-300">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-5 h-5 text-[#39FF14] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{thisWeekWorkouts}</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
        <Card className="glass border-[#FF006E]/20 hover:glow-pink transition-all duration-300">
          <CardContent className="p-4 text-center">
            <Heart className="w-5 h-5 text-[#FF006E] mx-auto mb-2" />
            <p className="text-lg font-bold text-white truncate">{favoriteExercise}</p>
            <p className="text-xs text-muted-foreground">Favorite</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Chart */}
      <Card className="glass border-[#00D9FF]/20">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00D9FF]" />
            Weekly Activity
          </h3>
          <WeeklyChart />
        </CardContent>
      </Card>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 gap-4">
        <MoodChart />
        <ConsistencyChart />
      </div>

      {/* Smart Suggestion */}
      <div className="space-y-4">
        <WeatherWidget onWeatherChange={setWeather} />

        <Card className="glass border-[#39FF14]/20 glow-green transition-all duration-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-[#39FF14]/10">
                <Lightbulb className="w-5 h-5 text-[#39FF14]" />
              </div>
              <span className="text-sm font-medium text-[#39FF14]">Smart Suggestion</span>
            </div>

            <div className="pl-1">
              <p className="text-lg font-semibold text-white animate-in fade-in slide-in-from-bottom-2 duration-500 key={suggestion}">
                {suggestion}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Quote */}
      <div className="text-center py-4">
        <p className="text-muted-foreground italic">{'"Progress, not perfection! 🎉"'}</p>
      </div>
    </div>
  )
}
