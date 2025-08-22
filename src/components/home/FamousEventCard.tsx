'use client';

interface FamousEventCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export default function FamousEventCard({
  title,
  description,
  imageUrl,
  imageAlt,
}: FamousEventCardProps) {
  return (
    <div className="relative rounded-lg overflow-hidden h-64 group cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70">
        <img src={imageUrl} alt={imageAlt} className="w-full h-full object-cover" />
      </div>
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </div>
  );
}
