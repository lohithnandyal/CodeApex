"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dumbbell, X } from "lucide-react"
import { type ExerciseType, type MoodType, calculateEffortStreak, getMotivationalMessage, type Workout } from "@/lib/data"
import { useFitness } from "@/components/fitness-context"
import { CelebrationModal } from "@/components/celebration-modal"

interface WorkoutLoggerProps {
  open: boolean
  onClose: () => void
  initialValues?: {
    type?: ExerciseType
    duration?: string
    mood?: MoodType
    notes?: string
  }
}

const exerciseTypes: ExerciseType[] = ["Yoga", "Running", "HIIT", "Walking", "Strength", "Custom"]
const moodTypes: MoodType[] = ["😰 Stressed", "⚡ Energetic", "😴 Tired", "😊 Happy", "😟 Anxious"]

export function WorkoutLogger({ open, onClose, initialValues }: WorkoutLoggerProps) {
  const { addWorkout, workouts, addHydrationLog, addStepLog } = useFitness()
  const [type, setType] = useState<ExerciseType>(initialValues?.type || "Yoga")
  const [duration, setDuration] = useState(initialValues?.duration || "")
  const [mood, setMood] = useState<MoodType>(initialValues?.mood || "😊 Happy")
  const [notes, setNotes] = useState(initialValues?.notes || "")
  const [hydration, setHydration] = useState("")
  const [steps, setSteps] = useState("")

  // Update state when initialValues change or modal opens
  useEffect(() => {
    if (open && initialValues) {
      if (initialValues.type) setType(initialValues.type)
      if (initialValues.duration) setDuration(initialValues.duration)
      if (initialValues.mood) setMood(initialValues.mood)
      if (initialValues.notes) setNotes(initialValues.notes)
    }
  }, [open, initialValues])

  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationData, setCelebrationData] = useState({ streak: 0, message: "" })

  const handleClose = () => {
    onClose()
    // Reset celebration state after modal closes
    setTimeout(() => setShowCelebration(false), 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!duration) return

    const newWorkout: Workout = {
      id: "temp", // Temporary ID for calculation
      type,
      duration: Number.parseInt(duration),
      mood,
      notes: notes || undefined,
      date: new Date().toISOString(),
    }

    // Calculate new streak and get message
    const updatedWorkouts = [newWorkout, ...workouts]
    const streak = calculateEffortStreak(updatedWorkouts)
    const message = getMotivationalMessage(streak, newWorkout)

    // Set celebration data and show modal
    setCelebrationData({ streak, message })
    setShowCelebration(true)

    addWorkout({
      type,
      duration: Number.parseInt(duration),
      mood,
      notes: notes || undefined,
    })

    if (hydration) {
      addHydrationLog(Number.parseInt(hydration))
    }

    if (steps) {
      addStepLog(Number.parseInt(steps))
    }

    // Reset form
    setType("Yoga")
    setDuration("")
    setMood("😊 Happy")
    setNotes("")
    setHydration("")
    setSteps("")
    // Don't close immediately, let the celebration modal handle flow
    // onClose() 
  }

  return (
    <>
      <CelebrationModal
        open={showCelebration}
        onClose={handleClose}
        streak={celebrationData.streak}
        message={celebrationData.message}
      />

      <Dialog open={open && !showCelebration} onOpenChange={onClose}>
        <DialogContent className="glass border-[#00D9FF]/30 glow-blue max-w-md mx-4 rounded-2xl max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-[#00D9FF]" />
              Log Workout
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Exercise Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-muted-foreground">
                Exercise Type
              </Label>
              <Select value={type} onValueChange={(v) => setType(v as ExerciseType)}>
                <SelectTrigger className="bg-input border-border/50 focus:border-[#00D9FF] focus:ring-[#00D9FF]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-[#00D9FF]/20">
                  {exerciseTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-muted-foreground">
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="300"
                placeholder="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-input border-border/50 focus:border-[#00D9FF] focus:ring-[#00D9FF]/20"
                required
              />
            </div>

            {/* Mood */}
            <div className="space-y-2">
              <Label htmlFor="mood" className="text-muted-foreground">
                How are you feeling?
              </Label>
              <Select value={mood} onValueChange={(v) => setMood(v as MoodType)}>
                <SelectTrigger className="bg-input border-border/50 focus:border-[#00D9FF] focus:ring-[#00D9FF]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-[#00D9FF]/20">
                  {moodTypes.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Daily Stats Section */}
            <div className="pt-4 border-t border-border/50 space-y-4">
              <h3 className="text-sm font-semibold text-white">Daily Stats (Optional)</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hydration" className="text-muted-foreground">
                    Hydration (ml)
                  </Label>
                  <Input
                    id="hydration"
                    type="number"
                    min="0"
                    placeholder="500"
                    value={hydration}
                    onChange={(e) => setHydration(e.target.value)}
                    className="bg-input border-border/50 focus:border-[#00D9FF] focus:ring-[#00D9FF]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="steps" className="text-muted-foreground">
                    Steps
                  </Label>
                  <Input
                    id="steps"
                    type="number"
                    min="0"
                    placeholder="5000"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    className="bg-input border-border/50 focus:border-[#00D9FF] focus:ring-[#00D9FF]/20"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-muted-foreground">
                Notes (optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="How did it go?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-input border-border/50 focus:border-[#00D9FF] focus:ring-[#00D9FF]/20 resize-none"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold gradient-btn border-0 text-white hover:scale-[1.02] transition-all duration-300"
            >
              Log Workout
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
