"use client"

import { useState } from "react"
import { Plus, Zap, Move, Flame, Dumbbell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { WorkoutLogger } from "@/components/workout-logger"
import { WorkoutTimer } from "@/components/workout-timer"
import { type ExerciseType, type MoodType } from "@/lib/data"

interface WorkoutTemplate {
    name: string
    description: string
    icon: React.ReactNode
    data: {
        type: ExerciseType
        duration: string
        mood: MoodType
        notes: string
    }
    color: string
}

const templates: WorkoutTemplate[] = [
    {
        name: "Morning Energizer",
        description: "Start the day right with a quick flow",
        icon: <Zap className="w-5 h-5" />,
        data: {
            type: "Yoga",
            duration: "10",
            mood: "⚡ Energetic",
            notes: "Morning Energizer session to wake up!",
        },
        color: "text-[#FFD700]", // Gold
    },
    {
        name: "Desk Break Stretch",
        description: "Relieve tension from sitting",
        icon: <Move className="w-5 h-5" />,
        data: {
            type: "Yoga", // or Stretching if available, but Yoga fits
            duration: "5",
            mood: "😊 Happy",
            notes: "Quick desk break stretch.",
        },
        color: "text-[#00D9FF]", // Cyan
    },
    {
        name: "Stress Buster",
        description: "Burn off some steam quickly",
        icon: <Flame className="w-5 h-5" />,
        data: {
            type: "HIIT",
            duration: "15",
            mood: "😰 Stressed", // Converting stress to energy
            notes: "Stress buster session!",
        },
        color: "text-[#FF006E]", // Pink
    },
]

export function QuickWorkoutButton() {
    const [open, setOpen] = useState(false)
    const [loggerOpen, setLoggerOpen] = useState(false)
    const [timerOpen, setTimerOpen] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null)
    const [completedDuration, setCompletedDuration] = useState<number>(0)

    const handleTemplateClick = (template: WorkoutTemplate) => {
        setSelectedTemplate(template)
        setOpen(false)
        setTimerOpen(true) // Open timer first
    }

    const handleTimerComplete = (duration: number) => {
        setCompletedDuration(duration)
        setTimerOpen(false)
        setLoggerOpen(true) // Open logger after timer
    }

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button
                        size="icon"
                        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg gradient-btn border-0 text-white hover:scale-110 transition-all duration-300 z-50 animate-in zoom-in"
                    >
                        <Zap className="h-6 w-6 fill-current" />
                        <span className="sr-only">Quick Workout</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="glass border-t-[#00D9FF]/20 rounded-t-[2rem]">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-white text-xl flex items-center gap-2">
                            <Dumbbell className="w-5 h-5 text-[#00D9FF]" />
                            Quick Workout
                        </SheetTitle>
                        <SheetDescription className="text-muted-foreground">
                            Choose a template to get started instantly.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 pb-8">
                        {templates.map((template) => (
                            <button
                                key={template.name}
                                onClick={() => handleTemplateClick(template)}
                                className="flex items-center gap-4 p-4 rounded-xl glass border-white/5 hover:bg-white/10 transition-all duration-300 text-left group"
                            >
                                <div className={`p-3 rounded-full bg-white/5 ${template.color} group-hover:scale-110 transition-transform`}>
                                    {template.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-white">{template.name}</h3>
                                    <p className="text-sm text-muted-foreground">{template.description}</p>
                                </div>
                                <div className="text-xs font-medium text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
                                    {template.data.duration} min
                                </div>
                            </button>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>

            {selectedTemplate && (
                <WorkoutTimer
                    open={timerOpen}
                    onClose={() => setTimerOpen(false)}
                    onComplete={handleTimerComplete}
                    initialDuration={Number.parseInt(selectedTemplate.data.duration)}
                    workoutName={selectedTemplate.name}
                />
            )}

            <WorkoutLogger
                open={loggerOpen}
                onClose={() => setLoggerOpen(false)}
                initialValues={
                    selectedTemplate
                        ? {
                            ...selectedTemplate.data,
                            duration: completedDuration.toString(),
                        }
                        : undefined
                }
            />
        </>
    )
}
