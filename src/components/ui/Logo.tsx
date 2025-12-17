import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className = '', width = 150, height = 50 }: LogoProps) {
  return (
    <Image
      src="/images/logo.svg"
      alt="Gojo Logo"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      priority
      style={{ width: 'auto', height: 'auto', maxHeight: `${height}px`, maxWidth: `${width}px` }}
    />
  );
}
