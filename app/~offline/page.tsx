"use client";

import { GlobalHeader } from "@/components/global-header";
import { BottomNavigation } from "@/components/bottom-navigation";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-16 flex flex-col">
      {/* Spacer to push content down slightly to center it visually better without header/footer */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto">
        <div className="text-6xl mb-2 grayscale opacity-80">📡</div>
        <h1 className="text-2xl font-bold text-foreground">
          আপনি অফলাইনে আছেন
        </h1>
        <p className="text-muted-foreground">
          ইন্টারনেট সংযোগ না থাকায় পুনরায় পৃষ্ঠা লোড করা সম্ভব হচ্ছে না। অনুগ্রহ
          করে কানেকশন চেক করুন।
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold shadow-lg ring-1 ring-primary/50"
        >
          আবার চেষ্টা করুন
        </button>
      </main>
    </div>
  );
}
