'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react';

export default function UpcomingEvents() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-12">UPCOMING EVENTS</h2>

      <div className="relative">
        {/* Navigation buttons */}
        <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12">
          {/* SABRIJAM Event */}
          <div className="relative rounded-lg overflow-hidden h-80 group cursor-pointer">
            <div className="absolute inset-0">
              <img
                src="/api/placeholder/300/400"
                alt="Sabrijam event"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold mb-1">SABRIJAM</h3>
              <p className="text-sm opacity-90">SAMEDI 4 SEPTEMBRE</p>
            </div>
          </div>

          {/* AFTERGUTS Event (Featured) */}
          <div className="relative rounded-lg overflow-hidden h-80 group cursor-pointer">
            <div className="absolute inset-0">
              <img
                src="/api/placeholder/300/400"
                alt="Afterguts event"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-4 left-4 text-white">
              <h3 className="text-2xl font-bold mb-2">AFTERGUTS</h3>
              <p className="text-sm opacity-90 mb-1">JEUDI 1er décembre</p>
            </div>

            {/* Event Details Card */}
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-4">
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Bar SOURDRIANK, 24 avenue mansion de Paris</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-3">
                <Users className="w-4 h-4 mr-1" />
                <span>12 personnes inscrites</span>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Voir</Button>
            </div>
          </div>

          {/* THE HIT SOFT SHOW Event */}
          <div className="relative rounded-lg overflow-hidden h-80 group cursor-pointer">
            <div className="absolute inset-0">
              <img
                src="/api/placeholder/300/400"
                alt="The Hit Soft Show event"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold mb-1">THE HIT SOFT</h3>
              <h3 className="text-xl font-bold mb-1">SHOW</h3>
              <p className="text-sm opacity-90">LUNDI 12 DÉCEMBRE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
