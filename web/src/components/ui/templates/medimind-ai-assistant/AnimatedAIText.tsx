// components/AnimatedAIText.tsx
import React, { useState, useEffect } from 'react';

interface AnimatedAITextProps {
  text: string;
  className?: string;
}

const AnimatedAIText: React.FC<AnimatedAITextProps> = ({ text, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;
    
    const typeText = () => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text.charAt(currentIndex));
        currentIndex++;
        timeout = setTimeout(typeText, Math.random() * 50 + 20); // Velocidade variável
      } else {
        setIsTyping(false);
      }
    };

    typeText();

    return () => clearTimeout(timeout);
  }, [text]);

  // Efeito para o cursor piscante
  useEffect(() => {
    if (!isTyping) {
      const interval = setInterval(() => {
        setCursorVisible(v => !v);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  return (
    <div className={`relative ${className}`}>
      <span>{displayText}</span>
      <span 
        className={`inline-block w-0.5 h-5 ml-1 bg-current transition-opacity duration-100
          ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ verticalAlign: 'middle' }}
      />
      <style jsx>{`
        @keyframes glow {
          0% { text-shadow: 0 0 5px rgba(0,128,255,0.5); }
          50% { text-shadow: 0 0 15px rgba(0,128,255,0.8); }
          100% { text-shadow: 0 0 5px rgba(0,128,255,0.5); }
        }
        span {
          animation: glow 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default AnimatedAIText;