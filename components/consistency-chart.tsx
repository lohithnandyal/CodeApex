"use client"

import { useMemo } from "react"
import { useFitness } from "@/components/fitness-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Activity } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useInView } from "@/hooks/use-in-view"

export function ConsistencyChart() {
    const { workouts } = useFitness()

    const days = useMemo(() => {
        const today = new Date()
        const daysArray = []

        // Generate last 30 days
        for (let i = 29; i >= 0; i--) {
            const d = new Date()
            d.setDate(today.getDate() - i)
            d.setHours(0, 0, 0, 0)

            const dateStr = d.toDateString()
            const dayWorkouts = workouts.filter(w => new Date(w.date).toDateString() === dateStr)

            // Calculate intensity based on duration or count
            const totalDuration = dayWorkouts.reduce((acc, w) => acc + w.duration, 0)
            let intensity = 0 // 0: none, 1: light, 2: medium, 3: heavy

            if (totalDuration > 0) intensity = 1
            if (totalDuration > 30) intensity = 2
            if (totalDuration > 60) intensity = 3

            daysArray.push({
                date: d,
                count: dayWorkouts.length,
                duration: totalDuration,
                intensity
            })
        }
        return daysArray
    }, [workouts])

    const getIntensityColor = (intensity: number) => {
        switch (intensity) {
            case 0: return "bg-slate-800/50"
            case 1: return "bg-[#00D9FF]/40"
            case 2: return "bg-[#00D9FF]/70"
            case 3: return "bg-[#00D9FF]"
            default: return "bg-slate-800/50"
        }
    }

    const { ref, isInView } = useInView({ threshold: 0.2 })

    return (
        <div ref={ref} className={`transition-all duration-700 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="glass border-[#39FF14]/20 h-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#39FF14]" />
                        Consistency Patterns
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-7 gap-2">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                <div key={day} className="text-xs text-center text-muted-foreground font-medium">
                                    {day}
                                </div>
                            ))}
                            {days.map((day, i) => (
                                <TooltipProvider key={i}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                className={`aspect-square rounded-sm transition-all duration-300 hover:scale-110 cursor-pointer ${getIntensityColor(day.intensity)}`}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-slate-900 border-slate-800 text-white">
                                            <p className="font-semibold">{day.date.toLocaleDateString()}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {day.count} workouts • {day.duration} mins
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                        <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                            <span>Less</span>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-sm bg-slate-800/50" />
                                <div className="w-3 h-3 rounded-sm bg-[#00D9FF]/40" />
                                <div className="w-3 h-3 rounded-sm bg-[#00D9FF]/70" />
                                <div className="w-3 h-3 rounded-sm bg-[#00D9FF]" />
                            </div>
                            <span>More</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
