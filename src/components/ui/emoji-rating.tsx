"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

interface RatingInteractionProps {
  onChange?: (rating: number) => void
  className?: string
}

const ratingData = [
  { emoji: "😔", label: "Terrible", color: "from-red-400 to-red-500" },
  { emoji: "😕", label: "Poor", color: "from-orange-400 to-orange-500" },
  { emoji: "😐", label: "Okay", color: "from-yellow-400 to-yellow-500" },
  { emoji: "🙂", label: "Good", color: "from-lime-400 to-lime-500" },
  { emoji: "😍", label: "Amazing", color: "from-emerald-400 to-emerald-500" },
]

export function RatingInteraction({ onChange, className }: RatingInteractionProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleClick = async (value: number) => {
    if (isSubmitting || isSubmitted) return
    
    setRating(value)
    onChange?.(value)
    setIsSubmitting(true)

    const item = ratingData[value - 1]

    try {
      // Direct insertion to Supabase database!
      const { error } = await supabase
        .from('ratings')
        .insert([
          {
            rating: value,
            label: item.label,
            created_at: new Date().toISOString()
          }
        ])

      if (error) {
        console.warn("Supabase ratings sync warning (table 'ratings' may need creation):", error)
      }
    } catch (err) {
      console.error("Failed to sync rating to database:", err)
    } finally {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div className={cn("w-full flex flex-col items-center justify-center", className)}>
      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center py-4 px-2 animate-bounce-in text-center">
          <span className="text-[#CCFF00] font-bold text-base tracking-wide mb-1 block">
            Feedback Secured! 🐅
          </span>
          <span className="text-white/40 font-mono text-[10px] tracking-[0.15em] uppercase">
            Thank you for helping us build greatness.
          </span>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center gap-5">
          {/* Emoji rating buttons container */}
          <div className="flex items-center justify-between w-full px-2 sm:px-6">
            {ratingData.map((item, i) => {
              const value = i + 1
              const isActive = value <= displayRating

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleClick(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={isSubmitting}
                  className="group relative focus:outline-none transition-transform active:scale-95 disabled:opacity-50"
                  aria-label={`Rate ${value}: ${item.label}`}
                >
                  <div
                    className={cn(
                      "relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl transition-all duration-300 ease-out",
                      isActive 
                        ? "scale-115 drop-shadow-[0_0_15px_rgba(255,107,0,0.3)] bg-white/[0.04] border border-white/10" 
                        : "scale-100 group-hover:scale-110 bg-transparent border border-transparent"
                    )}
                  >
                    {/* Emoji with smooth grayscale/brightness shift */}
                    <span
                      className={cn(
                        "text-3xl transition-all duration-300 ease-out select-none",
                        isActive
                          ? "grayscale-0 drop-shadow-lg scale-110"
                          : "grayscale opacity-35 group-hover:opacity-85 group-hover:grayscale-[0.1]"
                      )}
                    >
                      {item.emoji}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Feedback label box */}
          <div className="relative h-6 w-full flex items-center justify-center">
            {/* Default prompt */}
            <div
              className={cn(
                "absolute flex items-center justify-center transition-all duration-300 ease-out",
                displayRating > 0 ? "opacity-0 blur-md scale-95" : "opacity-100 blur-0 scale-100"
              )}
            >
              <span className="text-xs font-semibold text-white/30 uppercase tracking-[0.15em] font-mono">
                {isSubmitting ? "Securing rating..." : "Rate your experience"}
              </span>
            </div>

            {/* Hover labels */}
            {ratingData.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "absolute flex items-center justify-center transition-all duration-300 ease-out",
                  displayRating === i + 1 ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105"
                )}
              >
                <span className="text-xs font-black tracking-[0.2em] text-[#FF6B00] uppercase font-mono">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
