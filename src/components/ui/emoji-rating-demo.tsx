import { RatingInteraction } from "@/components/ui/emoji-rating"

export default function EmojiRatingDemo() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-8 w-full">
      <div className="flex flex-col items-center gap-8">
      
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">
          How was your experience?
        </p>

        <RatingInteraction />
        
        <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </main>
  )
}
