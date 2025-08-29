interface LogoProps {
  variant?: 'default' | 'white';
}

export default function Logo({ variant = 'default' }: LogoProps) {
  const textColor = variant === 'white' ? 'text-white' : 'text-black';

  return (
    <div className="font-bold text-xl tracking-wide select-none text-primary">
      <h1 className={textColor}>ISEPBANDS</h1>
      <h2 className={`${textColor} text-sm font-normal -mt-2`}>Year 2025-2026</h2>
    </div>
  );
}
