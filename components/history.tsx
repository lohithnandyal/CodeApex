"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, FileText } from "lucide-react"
import { exerciseIcons } from "@/lib/data"
import { useFitness } from "@/components/fitness-context"

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

  if (workouts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No workouts yet</h3>
        <p className="text-muted-foreground">Start your journey!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Workout History</h2>

      {workouts.map((workout, index) => (
        <Card
          key={workout.id}
          className="glass border-[#00D9FF]/20 hover:border-[#00D9FF]/40 hover:glow-blue transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-2"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-2xl">
                  {exerciseIcons[workout.type]}
                </div>
                <div>
                  <p className="font-semibold text-white">{workout.type}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(workout.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-[#00D9FF]">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold">{workout.duration}m</span>
                </div>
                <p className="text-lg mt-1">{workout.mood.split(" ")[0]}</p>
              </div>
            </div>
            {workout.notes && (
              <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border/50">{workout.notes}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
