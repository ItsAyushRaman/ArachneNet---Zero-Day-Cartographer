import { useState, useEffect } from 'react';

const useTypewriter = (text, speed = 18, enabled = true) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayed(text || '');
      setDone(true);
      return;
    }
    
    setDisplayed('');
    setDone(false);
    let i = 0;
    
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(iv);
        setDone(true);
      }
    }, speed);
    
    return () => clearInterval(iv);
  }, [text, speed, enabled]);

  return { displayed, done };
};

export default useTypewriter;
