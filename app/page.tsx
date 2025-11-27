"use client"

import { useState, useEffect } from "react"
import { Dashboard } from "@/components/dashboard"
import { History } from "@/components/history"
import { Stats } from "@/components/stats"
import { Navigation } from "@/components/navigation"
import { WorkoutLogger } from "@/components/workout-logger"
import { DemoDataGenerator } from "@/components/demo-data-generator"
import { DailyStats } from "@/components/daily-stats"

function FitnessApp() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "history" | "stats">("dashboard")
  const [isLoggerOpen, setIsLoggerOpen] = useState(false)

  useEffect(() => {
    // Scroll to bottom/middle on load
    window.scrollTo({
      top: document.body.scrollHeight / 2, // Scroll to middle initially as requested
      behavior: "smooth"
    })

    // Small timeout to ensure content is loaded then scroll to bottom if preferred, 
    // or just leave at middle as requested "bottom or the mid way"
    // Let's aim for a nice middle-to-bottom reveal
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      })
    }, 800)
  }, [])

  return (
    <main className="min-h-screen pb-24">
      <div className="container mx-auto px-4 py-6 max-w-lg">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">
            <span className="text-[#00D9FF]">Fit</span>
            <span className="text-[#FF006E]">-Track</span>
          </h1>
          <p className="text-muted-foreground text-sm">Your fitness journey starts here</p>
        </header>

        {/* Main Content */}
        <div className="animate-in fade-in duration-500">
          {activeTab === "dashboard" && <Dashboard onOpenLogger={() => setIsLoggerOpen(true)} />}
          {activeTab === "history" && (
            <>
              <History />
              <DailyStats />
            </>
          )}
          {activeTab === "stats" && <Stats />}
        </div>
      </div>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Workout Logger Modal */}
      <WorkoutLogger open={isLoggerOpen} onClose={() => setIsLoggerOpen(false)} />

      {/* Demo Data Generator */}
      <DemoDataGenerator />
    </main>
  )
}

export default function Home() {
  return (
    <FitnessApp />
  )
}
