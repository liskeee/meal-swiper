'use client'

import { useState, useRef, useCallback } from 'react'

interface DragOffset {
  x: number
  y: number
}

export function useSwipe(threshold = 120) {
  const [dragOffset, setDragOffset] = useState<DragOffset>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartPos = useRef({ x: 0, y: 0 })

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true)
    dragStartPos.current = { x: clientX, y: clientY }
  }, [])

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return
      const deltaX = clientX - dragStartPos.current.x
      const deltaY = clientY - dragStartPos.current.y
      setDragOffset({ x: deltaX, y: deltaY })
    },
    [isDragging]
  )

  const handleDragEnd = useCallback((): 'left' | 'right' | null => {
    if (!isDragging) return null
    setIsDragging(false)

    const currentOffset = dragOffset.x
    if (Math.abs(currentOffset) > threshold) {
      return currentOffset > 0 ? 'right' : 'left'
    }
    setDragOffset({ x: 0, y: 0 })
    return null
  }, [isDragging, dragOffset.x, threshold])

  const animateOut = useCallback((direction: 'left' | 'right') => {
    setDragOffset({ x: direction === 'right' ? 1000 : -1000, y: 0 })
  }, [])

  const reset = useCallback(() => {
    setDragOffset({ x: 0, y: 0 })
    setIsDragging(false)
  }, [])

  const rotation = isDragging ? dragOffset.x / 20 : 0
  const opacity = Math.abs(dragOffset.x) / 120

  const handlers = {
    onMouseDown: (e: React.MouseEvent) => handleDragStart(e.clientX, e.clientY),
    onMouseMove: (e: React.MouseEvent) => handleDragMove(e.clientX, e.clientY),
    onMouseUp: handleDragEnd,
    onMouseLeave: handleDragEnd,
    onTouchStart: (e: React.TouchEvent) =>
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY),
    onTouchMove: (e: React.TouchEvent) =>
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY),
    onTouchEnd: handleDragEnd,
  }

  return {
    dragOffset,
    isDragging,
    rotation,
    opacity,
    handlers,
    animateOut,
    reset,
  }
}
