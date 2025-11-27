"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Target, Award, Zap, Activity, Calendar } from "lucide-react"
import { useFitness } from "@/components/fitness-context"
import { calculateEffortStreak, getMotivationalMessage } from "@/lib/data"
import type { Workout } from "@/lib/data"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useInView } from "@/hooks/use-in-view"

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

  // Exercise breakdown for Pie Chart
  const exerciseCounts = workouts.reduce(
    (acc: Record<string, number>, w: Workout) => {
      acc[w.type] = (acc[w.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const pieData = Object.entries(exerciseCounts).map(([name, value]) => ({
    name,
    value,
  }))

  // Colors for the pie chart
  const COLORS = ["#00D9FF", "#39FF14", "#FF006E", "#FFD700", "#9D4EDD", "#FF9E00"]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-2 rounded-lg border border-white/10 shadow-xl">
          <p className="text-white font-medium">{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <div ref={ref} className={`space-y-6 pb-6 transition-all duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Your Progress</h2>
        <div className="px-3 py-1 rounded-full glass border border-[#00D9FF]/30 text-[#00D9FF] text-xs font-medium">
          Last 30 Days
        </div>
      </div>

      {/* Exercise Breakdown Chart */}
      <Card className="glass border-[#00D9FF]/20 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00D9FF]" />
            Exercise Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-muted-foreground ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Empty State if no data */}
          {pieData.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
              <p className="text-muted-foreground text-sm">No workout data yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass border-[#00D9FF]/20 glow-blue overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="p-5 relative z-10">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF]">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {totalHours}<span className="text-lg text-muted-foreground font-normal">h</span> {remainingMinutes}<span className="text-lg text-muted-foreground font-normal">m</span>
            </p>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Time</p>
          </CardContent>
        </Card>

        <Card className="glass border-[#39FF14]/20 glow-green overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="p-5 relative z-10">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-lg bg-[#39FF14]/10 text-[#39FF14]">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {avgDuration}<span className="text-lg text-muted-foreground font-normal">m</span>
            </p>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Effort Streak Banner */}
      <Card className="glass border-[#FFD700]/20 glow-yellow overflow-hidden relative">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#FFD700]/10 rounded-full blur-3xl" />
        <CardContent className="p-5 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-[#FFD700]/10 text-[#FFD700]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Effort Streak</h3>
                <p className="text-xs text-muted-foreground">Keep the momentum going!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-white leading-none">{streak}</p>
              <p className="text-[10px] uppercase tracking-widest text-[#FFD700] font-bold">Days</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
            <p className="text-sm text-[#FFD700] italic text-center">"{motivationalMessage}"</p>
          </div>
        </CardContent>
      </Card>

      {/* Mood & Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass border-[#FF006E]/20 overflow-hidden relative">
          <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full">
            <div className="p-3 rounded-full bg-[#FF006E]/10 text-[#FF006E] mb-3">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-white mb-1 capitalize">{commonMood}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Top Mood</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/10 overflow-hidden relative">
          <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full">
            <div className="p-3 rounded-full bg-white/10 text-white mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{workouts.length}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Workouts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
