export type ExerciseType = "Yoga" | "Running" | "HIIT" | "Walking" | "Strength" | "Custom"

export type MoodType = "😰 Stressed" | "⚡ Energetic" | "😴 Tired" | "😊 Happy" | "😟 Anxious"

export interface Workout {
  id: string
  type: ExerciseType
  duration: number
  mood: MoodType
  notes?: string
  date: string
}

export const sampleWorkouts: Workout[] = [
  {
    id: "1",
    type: "HIIT",
    duration: 30,
    mood: "⚡ Energetic",
    date: new Date().toISOString(),
  },
  {
    id: "2",
    type: "Yoga",
    duration: 45,
    mood: "😊 Happy",
    notes: "Morning flow session",
    date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    type: "Running",
    duration: 25,
    mood: "⚡ Energetic",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "4",
    type: "Strength",
    duration: 50,
    mood: "😊 Happy",
    notes: "Upper body focus",
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "5",
    type: "Walking",
    duration: 40,
    mood: "😴 Tired",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
]

export const weeklyData = [
  { day: "Mon", workouts: 2 },
  { day: "Tue", workouts: 1 },
  { day: "Wed", workouts: 0 },
  { day: "Thu", workouts: 1 },
  { day: "Fri", workouts: 2 },
  { day: "Sat", workouts: 1 },
  { day: "Sun", workouts: 0 },
]

export const exerciseIcons: Record<ExerciseType, string> = {
  Yoga: "🧘",
  Running: "🏃",
  HIIT: "🔥",
  Walking: "🚶",
  Strength: "💪",
  Custom: "⭐",
}

export type WeatherType = "Sunny" | "Rainy" | "Cloudy" | "Indoors"

export function getWorkoutSuggestion(hour: number, mood?: MoodType, weather?: WeatherType): string {
  // Weather-based overrides (High Priority)
  if (weather === "Rainy") {
    if (mood === "⚡ Energetic") return "Indoor HIIT Blast"
    return "Cozy Home Yoga"
  }

  if (weather === "Indoors") {
    return "Living Room Strength"
  }

  if (weather === "Sunny") {
    if (hour < 10) return "Morning Sunshine Run"
    if (hour > 17) return "Sunset Park Walk"
    return "Outdoor Power Cardio"
  }

  // Mood-based suggestions
  if (mood === "😰 Stressed" || mood === "😟 Anxious") {
    return "Calming Yoga Flow"
  }
  if (mood === "😴 Tired") {
    return "Light Walking"
  }

  // Time-based defaults
  if (hour < 10) return "Morning Energizer HIIT"
  if (hour < 14) return "Lunch Break Power Walk"
  if (hour < 18) return "Afternoon Strength Session"
  return "Evening Relaxation Yoga"
}

export function calculateEffortStreak(workouts: Workout[]): number {
  if (workouts.length === 0) return 0

  // Sort workouts by date descending
  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  let currentDate = today

  // Check if there's a workout today
  const hasWorkoutToday = sortedWorkouts.some(w => {
    const wDate = new Date(w.date)
    wDate.setHours(0, 0, 0, 0)
    return wDate.getTime() === today.getTime()
  })

  // If no workout today, check if there was one yesterday to keep streak alive
  if (!hasWorkoutToday) {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const hasWorkoutYesterday = sortedWorkouts.some(w => {
      const wDate = new Date(w.date)
      wDate.setHours(0, 0, 0, 0)
      return wDate.getTime() === yesterday.getTime()
    })

    if (!hasWorkoutYesterday) return 0
    // If we have a workout yesterday but not today, we start counting from yesterday
    currentDate.setDate(currentDate.getDate() - 1)
  }

  // Count consecutive days
  while (true) {
    const hasWorkoutOnDate = sortedWorkouts.some(w => {
      const wDate = new Date(w.date)
      wDate.setHours(0, 0, 0, 0)
      return wDate.getTime() === currentDate.getTime()
    })

    if (hasWorkoutOnDate) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

export function getMotivationalMessage(streak: number, lastWorkout?: Workout): string {
  if (streak === 0) return "Every journey starts with a single step. You got this!"

  if (lastWorkout && lastWorkout.duration < 15) {
    return `Did ${lastWorkout.duration} mins? That's ${lastWorkout.duration} mins more than zero! Keep it up!`
  }

  if (streak >= 7) return "Wow! One week of showing up! You're unstoppable! 🔥"
  if (streak >= 3) return "3 days in a row! You're building a solid habit! 🚀"

  return "Consistency is key! Great job showing up today! ✨"
}
