"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Check } from "lucide-react"
import ProductComparison from "./ProductComparison"
import { useTextCountdown } from "@/hooks/use-text-countdown"

export default function ProductHeroFull() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showSpecifications, setShowSpecifications] = useState(false)

  // Countdown hooks for specifications
  const modelCountdown = useTextCountdown("NICER 2K S15", { duration: 2000 })
  const ramRomTextCountdown = useTextCountdown("4+64 GB", { duration: 2000 })
  const coreCountdown = useTextCountdown("Octa Core", { duration: 2000 })
  const amplifieCountdown = useTextCountdown("TDA7850", { duration: 2000 })
  const radioCountdown = useTextCountdown("TEF6686", { duration: 2000 })
  const screenSizeCountdown = useTextCountdown("11.5 Inch", { duration: 2000 })
  const resolutionCountdown = useTextCountdown("2K (2560x1440)", { duration: 2000 })
  const screenCraftCountdown = useTextCountdown("IPS", { duration: 2000 })
  const androidVersionCountdown = useTextCountdown("10.0 - 15.0", { duration: 2000 })
  const carplayCountdown = useTextCountdown("Wireless", { duration: 2000 })
  const videoFormatsCountdown = useTextCountdown("MP4, AVI, MKV", { duration: 2000 })
  const inputPowerCountdown = useTextCountdown("12V DC", { duration: 2000 })

  const toggleSpecifications = () => {
    setShowSpecifications(!showSpecifications)
  }

  // This is a placeholder for the images in the carousel.
  // In a real application, you would have a state or prop for this.
  const carouselImages = [
    "/CrPic1.png",
    "/CrPic2.png", 
    "/CrPic3.png"
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  // Touch/swipe functionality
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    }
    if (isRightSwipe) {
      prevSlide()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  return (
    <div className="w-full bg-black text-white font-sans">
      {/* Header */}
      <header className="p-4 md:p-6 flex items-center justify-between">
        <div className="font-bold text-lg md:text-xl tracking-widest">DEMONOID</div>
        <nav className="hidden md:flex space-x-6 text-sm uppercase">
          <a href="#" className="hover:text-gray-400 transition-colors">HOME</a>
          <a href="#" className="hover:text-gray-400 transition-colors">STYLE THE MODS</a>
          <a href="#" className="hover:text-gray-400 transition-colors">EAZY INSTALLATION</a>
          <a href="#" className="hover:text-gray-400 transition-colors">HOME INSTALLATION</a>
        </nav>
        <div className="flex items-center space-x-3 md:space-x-4">
          <a href="#" aria-label="Search"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></a>
          <a href="#" aria-label="Account"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></a>
          <a href="#" aria-label="Cart"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.133 1.897.707 2.737L15 21H7a2 2 0 01-2-2v-3.586a1 1 0 01.293-.707l2.293-2.293z" /></svg></a>
        </div>
      </header>

      {/* Main Product Image Section */}
      <div className="relative w-full h-[30vh] md:h-[60vh] flex items-center justify-center bg-black">
        <Image
          src="/hero.png"
          alt="NICER 2K Car Stereo with 2K display"
          fill
          className="object-contain"
        />
      </div>

      {/* Product Information and Compatibility Section */}
      <div className="w-full bg-black p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Part - Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">NICER 2K S15</h1>
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">₹10,000/-</div>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                experience next-level driving entertainment. the nicer 2k s15 car stereo comes with a vibrant 2k touchscreen, android support, bluetooth connectivity, experience next-level driving entertainment.
              </p>
            </div>

            <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <img src="/icons/badge.png" alt="Badge" className="w-6 h-6" />
              <span className="text-white text-sm">No Cost <span className="text-green-400 font-semibold">EMI</span></span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/icons/badge.png" alt="Badge" className="w-6 h-6" />
              <span className="text-white text-sm">Home Installation</span>
            </div>
          </div>

          {/* Service Icons */}
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mb-2">
                <img src="/icons/COD.png" alt="COD" className="w-8 h-8" />
              </div>
              <span className="text-white text-xs text-center">COD Unavailable</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mb-2">
                <img src="/icons/gst.png" alt="GST" className="w-8 h-8" />
              </div>
              <span className="text-white text-xs text-center">GST Available</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mb-2">
                <img src="/icons/warranty.png" alt="Warranty" className="w-8 h-8" />
              </div>
              <span className="text-white text-xs text-center">1 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mb-2">
                <img src="/icons/home-install.png" alt="Home Installation" className="w-8 h-8" />
              </div>
              <span className="text-white text-xs text-center">HOME Installation</span>
            </div>
          </div>
          </div>

          {/* Right Part - Compatibility and Actions */}
          <div className="space-y-6 mt-6 lg:mt-0">
            {/* Check Compatibility Section */}
            <div className="bg-gray-200 text-black p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Check Compatibility</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select>
                  <SelectTrigger className="flex-1 bg-white">
                    <SelectValue placeholder="Type....." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bmw">BMW</SelectItem>
                    <SelectItem value="porsche">Porsche</SelectItem>
                    <SelectItem value="aston-martin">ASTON MARTIN</SelectItem>
                    <SelectItem value="bentley">BENTLEY</SelectItem>
                    <SelectItem value="audi">AUDI</SelectItem>
                    <SelectItem value="mercedes-benz">MERCEDES BENZ</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-gray-800 text-white hover:bg-gray-700 px-6 mt-2 sm:mt-0">CHECK</Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button className="w-full bg-white text-black hover:bg-gray-100 py-4 text-lg font-medium lg:text-xl">
                BUY NOW
              </Button>
              <Button className="w-full bg-black text-white border border-white hover:bg-gray-900 py-4 text-lg font-medium lg:text-xl">
                ADD TO CART
              </Button>
            </div>
          </div>
        </div>
      </div>
        
      {/* Specifications Section */}
      <div className="w-full bg-black p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 lg:col-span-1">
            <div className="text-center space-y-2">
              <div className="text-sm md:text-base text-gray-300 font-medium tracking-wider">RAM & ROM</div>
              <div className="text-4xl md:text-5xl text-white font-bold">4+64 GB</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-sm md:text-base text-gray-300 font-medium tracking-wider">ANDROID VERSION</div>
              <div className="text-4xl md:text-5xl text-white font-bold">10.0 - 15.0</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-sm md:text-base text-gray-300 font-medium tracking-wider">SCREEN SIZE</div>
              <div className="text-4xl md:text-5xl text-white font-bold">11.5 INCH</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-sm md:text-base text-gray-300 font-medium tracking-wider">CARPLAY & ANDROID AUTO</div>
              <div className="text-4xl md:text-5xl text-white font-bold">WIRELESS</div>
            </div>
            <div className="text-center pt-6">
              <button 
                onClick={toggleSpecifications}
                className="border border-white text-white px-8 py-4 text-sm md:text-lg font-medium tracking-wider hover:bg-white hover:text-black transition-colors"
              >
                VIEW ALL SPECIFICATION
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center lg:col-span-1 mt-6 lg:mt-0">
            <div className="relative w-full h-auto aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="/desc.png"
                alt="NICER 2K with 2K display and control knob"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table - Slide Down Animation */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showSpecifications ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white text-black rounded-lg p-6 mt-4 mx-6 md:mx-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">💬</span>
            </div>
            <h3 className="text-lg font-bold">Specification</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Model:</span>
              <span className={modelCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                {modelCountdown.displayValue}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">RAM & ROM:</span>
              <span className={ramRomTextCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                {ramRomTextCountdown.displayValue}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">CORE:</span>
              <span className={coreCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                {coreCountdown.displayValue}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Amplifie IC:</span>
              <span className={amplifieCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                {amplifieCountdown.displayValue}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Radio IC:</span>
              <span className={radioCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                {radioCountdown.displayValue}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Screen Size:</span>
              <span className={screenSizeCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                {screenSizeCountdown.displayValue}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Resolution:</span>
              <span className={resolutionCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                {resolutionCountdown.displayValue}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Screen Craft:</span>
              <span className={screenCraftCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                {screenCraftCountdown.displayValue}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Android Version:</span>
              <span className={androidVersionCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                {androidVersionCountdown.displayValue}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">CarPlay / Android Auto:</span>
              <span className={carplayCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                {carplayCountdown.displayValue}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Video Formats:</span>
              <span className={videoFormatsCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                {videoFormatsCountdown.displayValue}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Input Power:</span>
              <span className={inputPowerCountdown.isAnimating ? 'text-blue-600 font-semibold' : ''}>
                {inputPowerCountdown.displayValue}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Single Knob Quick Control Section */}
      <div className="w-full bg-black p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 lg:col-span-1">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Single Knob Quick Control</h3>
            <h4 className="text-lg md:text-xl font-semibold text-white mb-4">
              Damping Feel & Driving Fun
            </h4>
            <div className="space-y-3 text-sm md:text-base text-gray-300">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-1" />
                <span>Exquisite Single Knob Easy To Use</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-1" />
                <span>Thinner All Metal Body</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-1" />
                <span>Advanced Texture</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-1" />
                <span>Double Fan Smart Connect</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-1" />
                <span>2K High Aesthetic Value Who Installed It & Who Looks Good</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center lg:col-span-1 mt-6 lg:mt-0">
            <div className="relative w-full h-auto aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="/about.png"
                alt="NICER 2K with single knob control and map interface"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Image Carousel */}
      <div className="w-full bg-black p-6 md:p-12">
        <div className="relative overflow-hidden w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* FREE HOME INSTALLATION Text */}
          <div className="text-center mb-6">
            <h3 className="text-gray-600 text-lg font-medium tracking-wider">FREE HOME INSTALLATION</h3>
          </div>
          
          {/* Mobile Single Image View */}
          <div className="lg:hidden flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselImages.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="flex justify-center">
                  <div className="relative w-full max-w-4xl aspect-[16/9]">
                    <Image 
                      src={image} 
                      alt={`Car Interior with Infotainment System ${index + 1}`} 
                      fill 
                      className="object-cover rounded-lg" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop Three-Panel View */}
          <div className="hidden lg:flex justify-center items-center mt-8">
            <div className="grid grid-cols-3 gap-4 w-full max-w-6xl">
              {carouselImages.map((image, index) => (
                <div key={index} className="relative">
                  <div className={`relative aspect-[16/9] rounded-lg overflow-hidden transition-all duration-300 ${
                    currentSlide === index 
                      ? 'scale-100 brightness-100' 
                      : 'scale-95 brightness-50'
                  }`}>
                    <Image 
                      src={image} 
                      alt={`Car Interior Panel ${index + 1}`} 
                      fill 
                      className="object-cover rounded-lg" 
                    />
                    {/* Dimmed overlay for side panels */}
                    {currentSlide !== index && (
                      <div className="absolute inset-0 bg-black/60 rounded-lg"></div>
                    )}
                  </div>
                  {/* Panel labels */}
                  <div className="text-center mt-2">
                    <span className={`text-xs font-medium transition-colors ${
                      currentSlide === index ? 'text-white' : 'text-gray-500'
                    }`}>
                      {index === 0 ? 'Previous' : index === 1 ? 'Current' : 'Next'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Carousel Dots - Show only one on mobile */}
        <div className="flex justify-center mt-6 space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 ${
                currentSlide === index 
                  ? 'h-2 w-8 bg-white rounded-full' 
                  : 'h-2 w-2 bg-gray-500 rounded-full'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>

      <ProductComparison/>
    </div>
  )
}