"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Droplets, Footprints } from "lucide-react"
import { useFitness } from "@/components/fitness-context"

export function DailyStats() {
    const { hydrationLogs, stepLogs } = useFitness()

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) return "Today"
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
        return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    }

    if (hydrationLogs.length === 0 && stepLogs.length === 0) {
        return null
    }

    // Combine and sort logs by date (newest first)
    const allLogs = [
        ...hydrationLogs.map(log => ({ ...log, type: 'hydration' as const })),
        ...stepLogs.map(log => ({ ...log, type: 'steps' as const }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return (
        <div className="space-y-3 mt-8">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider ml-1">Daily Activity</h3>

            {allLogs.map((log, index) => (
                <Card
                    key={log.id}
                    className="glass border-white/5 hover:border-[#00D9FF]/40 hover:bg-white/5 transition-all duration-300 cursor-pointer group"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00D9FF]/20 to-[#00D9FF]/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 border border-[#00D9FF]/20 text-[#00D9FF]">
                                    {log.type === 'hydration' ? <Droplets className="w-6 h-6" /> : <Footprints className="w-6 h-6" />}
                                </div>
                                <div>
                                    <p className="font-bold text-white text-lg">
                                        {log.type === 'hydration' ? 'Hydration' : 'Steps'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{formatDate(log.date)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-1.5 text-[#00D9FF] bg-[#00D9FF]/10 px-3 py-1 rounded-full border border-[#00D9FF]/20">
                                    <span className="font-bold text-sm">
                                        {log.type === 'hydration' ? `${(log as any).amount} ml` : `${(log as any).count}`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
