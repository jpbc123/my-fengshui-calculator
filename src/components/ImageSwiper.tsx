'use client'

import * as React from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MeditationOption {
  title: string
  description: string
  image: string
  link: string
}

interface ImageSwiperProps extends React.HTMLAttributes<HTMLDivElement> {
  images?: string[]
  meditationOptions?: MeditationOption[]
}

export function ImageSwiper({ 
  images, 
  meditationOptions, 
  className, 
  ...props 
}: ImageSwiperProps) {
  const [imgIndex, setImgIndex] = React.useState(0)
  const dragX = useMotionValue(0)
  const navigate = useNavigate()

  // Use meditation options if provided, otherwise fall back to images
  const items = meditationOptions || images?.map(img => ({ image: img })) || []
  const itemCount = items.length

  const onDragEnd = () => {
    const x = dragX.get()
    if (x <= -10 && imgIndex < itemCount - 1) {
      setImgIndex((prev) => prev + 1)
    } else if (x >= 10 && imgIndex > 0) {
      setImgIndex((prev) => prev - 1)
    }
  }

  const handleItemClick = () => {
    if (meditationOptions && meditationOptions[imgIndex]) {
      navigate(meditationOptions[imgIndex].link)
    }
  }

  if (itemCount === 0) return null

  return (
    <div
      className={cn(
        'group relative aspect-[4/3] h-full w-full overflow-hidden rounded-lg',
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 z-10">
        {imgIndex > 0 && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              className="pointer-events-auto h-8 w-8 rounded-full bg-white/80 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setImgIndex((prev) => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4 text-neutral-600" />
            </Button>
          </div>
        )}
        
        {imgIndex < itemCount - 1 && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <Button
              variant="ghost" 
              size="icon"
              className="pointer-events-auto h-8 w-8 rounded-full bg-white/80 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setImgIndex((prev) => prev + 1)}
            >
              <ChevronRight className="h-4 w-4 text-neutral-600" />
            </Button>
          </div>
        )}

        <div className="absolute bottom-2 w-full flex justify-center">
          <div className="flex min-w-9 items-center justify-center rounded-md bg-black/80 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            {imgIndex + 1}/{itemCount}
          </div>
        </div>

        {/* Text overlay for meditation options */}
        {meditationOptions && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
            <h3 className="text-lg font-bold mb-2">
              {meditationOptions[imgIndex]?.title}
            </h3>
            <p className="text-sm text-white/90 mb-4">
              {meditationOptions[imgIndex]?.description}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="pointer-events-auto bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={handleItemClick}
            >
              Try It Now
            </Button>
          </div>
        )}
      </div>

      <motion.div
        drag="x"
        dragConstraints={{
          left: 0,
          right: 0
        }}
        dragMomentum={false}
        style={{
          x: dragX
        }}
        animate={{
          translateX: `-${imgIndex * 100}%`
        }}
        onDragEnd={onDragEnd}
        transition={{ damping: 18, stiffness: 90, type: 'spring', duration: 0.2 }}
        className="flex h-full cursor-grab items-center rounded-[inherit] active:cursor-grabbing"
      >
        {items.map((item, i) => {
          const imageSrc = 'image' in item ? item.image : item
          return (
            <motion.div
              key={i}
              className="h-full w-full shrink-0 overflow-hidden bg-neutral-800 object-cover first:rounded-l-[inherit] last:rounded-r-[inherit]"
            >
              <img 
                src={imageSrc} 
                alt={meditationOptions?.[i]?.title || `Image ${i + 1}`}
                className="pointer-events-none h-full w-full object-cover" 
              />
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}