"use client"

import { useState, useEffect } from "react"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { useFitness } from "@/components/fitness-context"

export function WeeklyChart() {
  const { workouts } = useFitness()
  const [data, setData] = useState<{ day: string; workouts: number }[]>([])

  useEffect(() => {
    // Calculate last 7 days data
    const chartData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" })
      const dateStr = d.toDateString()

      const count = workouts.filter(w => new Date(w.date).toDateString() === dateStr).length

      return {
        day: dayName,
        workouts: count
      }
    })
    setData(chartData)
  }, [workouts])

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="20%">
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis hide />
          <Bar dataKey="workouts" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.workouts > 0 ? "#00D9FF" : "#1e293b"}
                style={{
                  filter: entry.workouts > 0 ? "drop-shadow(0 0 8px rgba(0, 217, 255, 0.5))" : "none",
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
