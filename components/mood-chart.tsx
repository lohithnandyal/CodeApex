"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { useFitness } from "@/components/fitness-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smile, Activity } from "lucide-react"

export function MoodChart() {
    const { workouts } = useFitness()

    const data = useMemo(() => {
        const exerciseTypes = Array.from(new Set(workouts.map(w => w.type)))
        const moods = Array.from(new Set(workouts.map(w => w.mood)))

        return exerciseTypes.map(type => {
            const typeWorkouts = workouts.filter(w => w.type === type)
            const moodCounts: Record<string, number> = {}

            moods.forEach(mood => {
                moodCounts[mood] = typeWorkouts.filter(w => w.mood === mood).length
            })

            return {
                name: type,
                ...moodCounts,
                total: typeWorkouts.length // for sorting if needed
            }
        }).sort((a, b) => b.total - a.total).slice(0, 5) // Top 5 exercises
    }, [workouts])

    const moodColors: Record<string, string> = {
        "😰 Stressed": "#ef4444", // Red
        "⚡ Energetic": "#eab308", // Yellow
        "😴 Tired": "#64748b", // Slate
        "😊 Happy": "#22c55e", // Green
        "😟 Anxious": "#f97316", // Orange
    }

    // Get all unique moods present in the data for the legend
    const activeMoods = useMemo(() => {
        const moods = new Set<string>()
        workouts.forEach(w => moods.add(w.mood))
        return Array.from(moods)
    }, [workouts])

    if (workouts.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                No mood data available yet. Log a workout!
            </div>
        )
    }

    return (
        <Card className="glass border-[#FF006E]/20 h-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <Smile className="w-5 h-5 text-[#FF006E]" />
                    Mood Correlations
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={80}
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }}
                                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: "10px" }} />
                            {activeMoods.map((mood) => (
                                <Bar
                                    key={mood}
                                    dataKey={mood}
                                    stackId="a"
                                    fill={moodColors[mood] || "#8884d8"}
                                    radius={[0, 4, 4, 0]} // This might look weird stacked, usually only top one gets radius
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
