'use client';

interface Event {
  id: string;
  text: string;
}

interface EventsScrollerProps {
  events: Event[];
}

export default function EventsScroller({ events }: EventsScrollerProps) {
  // Diviser les événements en deux lignes pour mobile
  const halfLength = Math.ceil(events.length / 2);
  const firstLineEvents = events.slice(0, halfLength);
  const secondLineEvents = events.slice(halfLength);

  return (
    <div className="w-full relative overflow-visible">
      {/* Container avec max-width qui centre le défilement mais laisse les shadows déborder */}
      <div className="max-w-7xl mx-auto relative">
        {/* Version Desktop - Une ligne */}
        <div className="hidden md:block overflow-hidden relative h-30 flex justify-center items-center">
          <div
            className="flex animate-scroll whitespace-nowrap mt-10"
            style={{
              animation: 'scroll 110s linear infinite',
              width: 'max-content',
            }}
          >
            {/* Dupliquer suffisamment les événements pour un défilement vraiment continu */}
            {[...events, ...events, ...events, ...events, ...events].map((event, index) => (
              <span
                key={`${event.id}-${index}`}
                className="font-press-start-2p text-center mx-8 inline-block"
                style={{
                  color: '#00E6FF',
                  textShadow:
                    '0 0 74px rgba(0, 230, 255, 0.23), 0 0 43.338px rgba(0, 230, 255, 0.38), 0 0 23.57px rgba(0, 230, 255, 0.48), 0 0 12.025px rgba(0, 230, 255, 0.58), 0 0 6.03px rgba(0, 230, 255, 0.73), 0 0 2.912px rgba(0, 230, 255, 0.96)',
                }}
              >
                {event.text}
              </span>
            ))}
          </div>

          {/* Shadows sur les bords du défilement */}
          <div
            className="absolute left-0 top-0 h-full w-16 pointer-events-none z-10"
            style={{
              background:
                'linear-gradient(to right, rgba(12, 14, 18, 1) 0%, rgba(12, 14, 18, 0.6) 60%, rgba(12, 14, 18, 0) 100%)',
            }}
          />
          <div
            className="absolute right-0 top-0 h-full w-16 pointer-events-none z-10"
            style={{
              background:
                'linear-gradient(to left, rgba(12, 14, 18, 1) 0%, rgba(12, 14, 18, 0.6) 60%, rgba(12, 14, 18, 0) 100%)',
            }}
          />
        </div>

        {/* Version Mobile - Deux lignes */}
        <div className="md:hidden relative overflow-x-hidden h-40 flex flex-col justify-center items-center">
          {/* Première ligne */}
          <div className=" relative h-10 flex justify-center items-center">
            <div
              className="flex animate-scroll whitespace-nowrap"
              style={{
                animation: 'scroll 60s linear infinite',
                width: 'max-content',
              }}
            >
              {[...firstLineEvents, ...firstLineEvents, ...firstLineEvents].map((event, index) => (
                <span
                  key={`line1-${event.id}-${index}`}
                  className="font-press-start-2p text-center mx-4 inline-block text-xs"
                  style={{
                    color: '#00E6FF',
                    textShadow:
                      '0 0 74px rgba(0, 230, 255, 0.23), 0 0 43.338px rgba(0, 230, 255, 0.38), 0 0 23.57px rgba(0, 230, 255, 0.48), 0 0 12.025px rgba(0, 230, 255, 0.58), 0 0 6.03px rgba(0, 230, 255, 0.73), 0 0 2.912px rgba(0, 230, 255, 0.96)',
                  }}
                >
                  {event.text}
                </span>
              ))}
            </div>
          </div>

          {/* Deuxième ligne */}
          <div className=" relative h-10 flex justify-center items-center">
            <div
              className="flex animate-scroll whitespace-nowrap"
              style={{
                animation: 'scroll 65s linear infinite reverse',
                width: 'max-content',
              }}
            >
              {[...secondLineEvents, ...secondLineEvents, ...secondLineEvents].map(
                (event, index) => (
                  <span
                    key={`line2-${event.id}-${index}`}
                    className="font-press-start-2p text-center mx-4 inline-block text-xs"
                    style={{
                      color: '#00E6FF',
                      textShadow:
                        '0 0 74px rgba(0, 230, 255, 0.23), 0 0 43.338px rgba(0, 230, 255, 0.38), 0 0 23.57px rgba(0, 230, 255, 0.48), 0 0 12.025px rgba(0, 230, 255, 0.58), 0 0 6.03px rgba(0, 230, 255, 0.73), 0 0 2.912px rgba(0, 230, 255, 0.96)',
                    }}
                  >
                    {event.text}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Shadows sur les bords - Mobile */}
          <div
            className="absolute left-0 top-0 h-full w-8 pointer-events-none z-10"
            style={{
              background:
                'linear-gradient(to right, rgba(12, 14, 18, 1) 0%, rgba(12, 14, 18, 0.6) 60%, rgba(12, 14, 18, 0) 100%)',
            }}
          />
          <div
            className="absolute right-0 top-0 h-full w-8 pointer-events-none z-10"
            style={{
              background:
                'linear-gradient(to left, rgba(12, 14, 18, 1) 0%, rgba(12, 14, 18, 0.6) 60%, rgba(12, 14, 18, 0) 100%)',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-20%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </div>
  );
}
