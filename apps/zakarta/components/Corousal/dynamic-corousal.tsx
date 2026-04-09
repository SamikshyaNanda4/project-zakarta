"use client"
import React from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Product {
  id: number
  name: string
  description: string
  image: string
}




interface ProductCarouselProps {
  products: Product[]
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const touchStartX = React.useRef<number | null>(null)

  const nextSlide = React.useCallback(
    () => setCurrentSlide((prev) => (prev + 1) % products.length),
    [products.length]
  )
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + products.length) % products.length)

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const endX = e.changedTouches[0]?.clientX
    if (endX === undefined) return
    const delta = touchStartX.current - endX
    if (delta > 50) nextSlide()
    else if (delta < -50) prevSlide()
    touchStartX.current = null
  }

  React.useEffect(() => {
    if (paused) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [paused, nextSlide])

  return (
    <div className="relative w-full">
        <div className="relative overflow-hidden w-full" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
    <div
      className="flex transition-transform duration-500 ease-out"
      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
    >
      {products.map((product) => (
        <div key={product.id} className="w-full flex-shrink-0">
          <div className="relative h-[50vh] md:h-[50vh] lg:h-[50vh]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40">
              
              <button
                className="absolute top-4 left-4 md:top-1/2 md:-translate-y-1/2 md:left-20 md:right-auto bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-gray-200 transition duration-300"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                Explore
              </button>
              
              <div className="absolute bottom-14 right-4 md:bottom-16 md:right-10 flex flex-col items-start text-left text-white max-w-[60%] md:max-w-md">
                <h2 className="text-base md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2">{product.name}</h2>
                <p className="text-xs md:text-lg lg:text-xl">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    {/* LEFT RIGH ARROWS */}
    <button
      onClick={prevSlide}
      className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition duration-300"
    >
      <ChevronLeft className="w-6 h-6 text-black" />
    </button>
    <button
      onClick={nextSlide}
      className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition duration-300"
    >
      <ChevronRight className="w-6 h-6 text-black" />
    </button>
    {/* dCLICKABLE DOT NAVIGATIONS */}
    <div className="absolute bottom-4 left-0 right-0">
      <div className="flex items-center justify-center gap-2">
        {products.map((_, i) => (
          <button
            key={i}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${currentSlide === i ? 'bg-white scale-110' : 'bg-white bg-opacity-50'}
            `}
            onClick={() => setCurrentSlide(i)}
          />
        ))}
      </div>
    </div>
  </div>
    </div>
  )
}

export default ProductCarousel
