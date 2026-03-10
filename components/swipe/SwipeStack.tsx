'use client'

import type { MotionValue, PanInfo } from 'framer-motion'
import type { Meal } from '@/types'
import SwipeCard from './SwipeCard'

interface SwipeStackProps {
  stackCards: Meal[]
  currentIndex: number
  totalCards: number
  x: MotionValue<number>
  rotate: MotionValue<number>
  likeOpacity: MotionValue<number>
  nopeOpacity: MotionValue<number>
  onDragEnd: (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void
  onPointerDown: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
  people: number
}

export default function SwipeStack({
  stackCards,
  currentIndex,
  totalCards,
  x,
  rotate,
  likeOpacity,
  nopeOpacity,
  onDragEnd,
  onPointerDown,
  onPointerUp,
  people,
}: SwipeStackProps) {
  return (
    <div
      className="relative w-full max-w-sm flex-1 min-h-0"
      style={{ minHeight: '420px', maxHeight: 'calc(100vh - 320px)' }}
    >
      {stackCards
        .slice()
        .reverse()
        .map((meal, reverseIdx) => {
          const stackIdx = stackCards.length - 1 - reverseIdx
          const isTop = stackIdx === 0

          if (isTop) {
            return (
              <SwipeCard
                key={`card-${currentIndex}`}
                meal={meal}
                x={x}
                rotate={rotate}
                likeOpacity={likeOpacity}
                nopeOpacity={nopeOpacity}
                onDragEnd={onDragEnd}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                people={people}
                currentIndex={currentIndex}
                totalCards={totalCards}
              />
            )
          }

          // Background stack cards
          const scale = 1 - stackIdx * 0.05
          const translateY = stackIdx * 8
          const cardOpacity = stackIdx === 1 ? 0.7 : 0.4

          return (
            <div
              key={`stack-${currentIndex + stackIdx}`}
              className="absolute inset-0 rounded-2xl shadow-xl overflow-hidden pointer-events-none"
              style={{
                transform: `scale(${scale}) translateY(${translateY}px)`,
                opacity: cardOpacity,
                zIndex: 10 - stackIdx,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={meal.nazwa}
                className="absolute inset-0 w-full h-full object-cover"
                src={meal.photo_url}
                draggable="false"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 pb-6 text-white">
                <h2 className="text-2xl font-bold leading-tight drop-shadow-lg">{meal.nazwa}</h2>
              </div>
            </div>
          )
        })}
    </div>
  )
}
