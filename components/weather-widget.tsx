"use client"

import { useState, useEffect } from "react"
import { Cloud, CloudRain, Sun, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { type WeatherType } from "@/lib/data"

interface WeatherWidgetProps {
    onWeatherChange: (weather: WeatherType) => void
}

export function WeatherWidget({ onWeatherChange }: WeatherWidgetProps) {
    const [weather, setWeather] = useState<WeatherType>("Sunny")

    useEffect(() => {
        onWeatherChange(weather)
    }, [weather, onWeatherChange])

    const toggleWeather = () => {
        const weathers: WeatherType[] = ["Sunny", "Rainy", "Cloudy", "Indoors"]
        const currentIndex = weathers.indexOf(weather)
        const nextIndex = (currentIndex + 1) % weathers.length
        setWeather(weathers[nextIndex])
    }

    const getWeatherIcon = () => {
        switch (weather) {
            case "Sunny":
                return <Sun className="h-6 w-6 text-yellow-500" />
            case "Rainy":
                return <CloudRain className="h-6 w-6 text-blue-400" />
            case "Cloudy":
                return <Cloud className="h-6 w-6 text-gray-400" />
            case "Indoors":
                return <Home className="h-6 w-6 text-indigo-400" />
        }
    }

    const getWeatherLabel = () => {
        switch (weather) {
            case "Sunny":
                return "Sunny & Warm"
            case "Rainy":
                return "Rainy Day"
            case "Cloudy":
                return "Cloudy & Cool"
            case "Indoors":
                return "Staying Inside"
        }
    }

    return (
        <Card className="bg-black/40 border-white/10 p-4 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-full">{getWeatherIcon()}</div>
                <div>
                    <p className="text-sm text-muted-foreground">Current Vibe</p>
                    <p className="font-medium text-white">{getWeatherLabel()}</p>
                </div>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={toggleWeather}
                className="text-xs border-white/20 bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
            >
                Change
            </Button>
        </Card>
    )
}
