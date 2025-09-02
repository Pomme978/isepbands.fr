interface StackEffectProps {
  count: number;
  isVisible: boolean;
}

export default function StackEffect({ count, isVisible }: StackEffectProps) {
  if (!isVisible || count <= 1) return null;

  return (
    <>
      {Array.from({ length: Math.min(count - 1, 5) }, (_, i) => (
        <div
          key={`stack-${i}`}
          className="absolute inset-0 bg-white rounded-lg shadow-md border border-gray-200 transition-all duration-300"
          style={{
            transform: `translate(${(i + 1) * 4}px, ${(i + 1) * 4}px) rotate(${(i + 1) * (Math.random() * 4 - 2)}deg)`,
            zIndex: -1 - i,
            opacity: Math.max(0.4, 1 - i * 0.15),
          }}
        />
      ))}
    </>
  );
}