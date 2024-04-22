import { useState, useEffect } from 'react';

const useTypingAnimation = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayText(text.substring(0, currentIndex));
      currentIndex++;
      if (currentIndex > text.length) clearInterval(interval);
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayText;
};

export default useTypingAnimation;
