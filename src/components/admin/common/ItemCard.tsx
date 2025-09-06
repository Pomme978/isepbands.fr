'use client';

import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface BadgeInfo {
  text: string;
  className: string;
}

interface ActionButton {
  icon: ReactNode;
  onClick: () => void;
  className?: string;
  title?: string;
}

interface CreatorInfo {
  name: string;
  date: string;
}

interface ItemCardProps {
  id: string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  description?: string;
  badges: BadgeInfo[];
  images?: string[];
  currentImageIndex?: number;
  onPrevImage?: () => void;
  onNextImage?: () => void;
  onImageClick?: (url: string) => void;
  actions: ActionButton[];
  creator?: CreatorInfo;
  additionalInfo?: ReactNode;
  className?: string;
}

export default function ItemCard({
  id,
  name,
  category,
  brand,
  model,
  description,
  badges,
  images = [],
  currentImageIndex = 0,
  onPrevImage,
  onNextImage,
  onImageClick,
  actions,
  creator,
  additionalInfo,
  className = "bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
}: ItemCardProps) {
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;

  return (
    <div className={className}>
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
        {hasImages ? (
          <div className="relative group h-full">
            <Image
              src={images[currentImageIndex]}
              alt={name}
              width={300}
              height={200}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => onImageClick?.(images[currentImageIndex])}
            />
            
            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrevImage?.();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNextImage?.();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full ${
                        idx === currentImageIndex ? 'bg-white' : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Badges overlay */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {badges.map((badge, index) => (
                <Badge key={index} className={`text-xs ${badge.className}`}>
                  {badge.text}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <Camera className="w-8 h-8 text-gray-400 mb-1" />
            <p className="text-xs text-gray-500 font-ubuntu">Aucune photo</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Header */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <Badge className="text-xs bg-primary/10 text-primary font-medium">
              {category}
            </Badge>
            {additionalInfo}
          </div>
          
          <h3 className="font-bold text-base font-outfit text-gray-900 leading-tight mb-1">
            {name}
          </h3>
          
          {(brand || model) && (
            <p className="text-xs text-gray-600 font-ubuntu">
              {[brand, model].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-600 font-ubuntu mb-2 line-clamp-2 italic">
            &ldquo;{description}&rdquo;
          </p>
        )}

        {/* Actions and Creator */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex gap-1">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={action.onClick}
                className={action.className || "text-gray-600 hover:text-primary p-1 h-auto"}
                title={action.title}
              >
                {action.icon}
              </Button>
            ))}
          </div>

          {creator && (
            <div className="text-right">
              <p className="text-xs text-gray-400 font-ubuntu">
                {creator.name}
              </p>
              <p className="text-xs text-gray-400 font-ubuntu">
                {creator.date}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}