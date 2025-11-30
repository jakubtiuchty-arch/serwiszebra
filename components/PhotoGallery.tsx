'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import Image from 'next/image'

interface PhotoGalleryProps {
  photos: string[]
  title?: string
}

export default function PhotoGallery({ photos, title = 'Zdjęcia urządzenia' }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!photos || photos.length === 0) {
    return null
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
  }

  const downloadImage = async () => {
    const url = photos[currentIndex]
    const filename = url.split('/').pop() || 'image.jpg'
    
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
        <h2 className="text-base font-bold text-gray-900 mb-3">{title}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity cursor-pointer group"
            >
              <Image
                src={photo}
                alt={`Zdjęcie ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Powiększ
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs font-medium text-gray-500 mt-3">
          {photos.length} {photos.length === 1 ? 'zdjęcie' : photos.length < 5 ? 'zdjęcia' : 'zdjęć'}
        </p>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-[10001]"
            aria-label="Zamknij"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Download button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              downloadImage()
            }}
            className="absolute top-4 right-16 text-white hover:text-gray-300 transition-colors z-[10001]"
            aria-label="Pobierz"
          >
            <Download className="w-8 h-8" />
          </button>

          {/* Previous button */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-[10001]"
              aria-label="Poprzednie"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
          )}

          {/* Next button */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-[10001]"
              aria-label="Następne"
            >
              <ChevronRight className="w-12 h-12" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[currentIndex]}
              alt={`Zdjęcie ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-semibold bg-black bg-opacity-50 px-4 py-2 rounded-full z-[10001]">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  )
}