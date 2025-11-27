"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dumbbell, X } from "lucide-react"
import type { ExerciseType, MoodType } from "@/lib/data"
import { useFitness } from "@/components/fitness-context"

interface WorkoutLoggerProps {
  open: boolean
  onClose: () => void
}

const exerciseTypes: ExerciseType[] = ["Yoga", "Running", "HIIT", "Walking", "Strength", "Custom"]
const moodTypes: MoodType[] = ["😰 Stressed", "⚡ Energetic", "😴 Tired", "😊 Happy", "😟 Anxious"]

export function WorkoutLogger({ open, onClose }: WorkoutLoggerProps) {
  const { addWorkout } = useFitness()
  const [type, setType] = useState<ExerciseType>("Yoga")
  const [duration, setDuration] = useState("")
  const [mood, setMood] = useState<MoodType>("😊 Happy")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!duration) return

    addWorkout({
      type,
      duration: Number.parseInt(duration),
      mood,
      notes: notes || undefined,
    })

    // Reset form
    setType("Yoga")
    setDuration("")
    setMood("😊 Happy")
    setNotes("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass border-[#00D9FF]/30 glow-blue max-w-md mx-4 rounded-2xl">
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
  )
}
