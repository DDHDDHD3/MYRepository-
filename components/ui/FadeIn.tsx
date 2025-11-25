import React, { useEffect, useRef, useState } from 'react';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number; // in milliseconds
  direction?: 'up' | 'left' | 'right' | 'none';
  className?: string;
  fullWidth?: boolean;
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  delay = 0, 
  direction = 'up', 
  className = '',
  fullWidth = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  const getAnimationClass = () => {
    switch (direction) {
      case 'up': return 'animate-fade-in-up';
      case 'left': return 'animate-fade-in-left';
      case 'right': return 'animate-fade-in-right';
      default: return 'animate-[fadeIn_1s_ease-out_forwards]';
    }
  };

  return (
    <div
      ref={domRef}
      className={`${className} ${isVisible ? getAnimationClass() : 'opacity-0'} ${fullWidth ? 'w-full' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};