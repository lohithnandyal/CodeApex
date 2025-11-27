"use client"

import { LayoutDashboard, History, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationProps {
  activeTab: "dashboard" | "history" | "stats"
  onTabChange: (tab: "dashboard" | "history" | "stats") => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "history" as const, label: "History", icon: History },
    { id: "stats" as const, label: "Stats", icon: BarChart3 },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-[#00D9FF]/20 backdrop-blur-xl">
      <div className="container mx-auto max-w-lg">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-300",
                  isActive ? "text-[#00D9FF]" : "text-muted-foreground hover:text-white",
                )}
              >
                <div className="relative">
                  <Icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(0,217,255,0.8)]")} />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00D9FF] shadow-[0_0_8px_rgba(0,217,255,0.8)]" />
                  )}
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
