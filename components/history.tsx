"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, FileText, CalendarDays, BarChart3 } from "lucide-react"
import { exerciseIcons } from "@/lib/data"
import { useFitness } from "@/components/fitness-context"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

export function History() {
  const { workouts } = useFitness()

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  // Calculate weekly activity
  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(d.toISOString().split('T')[0])
    }
    return days
  }

  const last7Days = getLast7Days()
  const weeklyData = last7Days.map(date => {
    const dayWorkouts = workouts.filter(w => w.date.startsWith(date))
    const totalDuration = dayWorkouts.reduce((acc, w) => acc + w.duration, 0)
    const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
    return {
      name: dayLabel,
      duration: totalDuration,
      date: date
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-2 rounded-lg border border-white/10 shadow-xl">
          <p className="text-white font-medium mb-1">{label}</p>
          <p className="text-[#00D9FF] text-sm">
            {payload[0].value} mins
          </p>
        </div>
      )
    }
    return null
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-4 border border-white/10">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No workouts yet</h3>
        <p className="text-muted-foreground max-w-[200px] mx-auto">Start your journey by logging your first workout!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Workout History</h2>
        <div className="p-2 rounded-full glass border border-white/10">
          <CalendarDays className="w-5 h-5 text-[#00D9FF]" />
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <Card className="glass border-[#00D9FF]/20 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#00D9FF]" />
            Weekly Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="duration" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.duration > 0 ? '#00D9FF' : 'rgba(255,255,255,0.1)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider ml-1">Recent Workouts</h3>
        {workouts.map((workout, index) => (
          <Card
            key={workout.id}
            className="glass border-white/5 hover:border-[#00D9FF]/40 hover:bg-white/5 transition-all duration-300 cursor-pointer group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00D9FF]/20 to-[#00D9FF]/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 border border-[#00D9FF]/20">
                    {exerciseIcons[workout.type]}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{workout.type}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(workout.date)}</span>
                      <span>•</span>
                      <span className="capitalize">{workout.mood}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 text-[#00D9FF] bg-[#00D9FF]/10 px-3 py-1 rounded-full border border-[#00D9FF]/20">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-bold text-sm">{workout.duration}m</span>
                  </div>
                </div>
              </div>
              {workout.notes && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-sm text-muted-foreground italic line-clamp-2">"{workout.notes}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
