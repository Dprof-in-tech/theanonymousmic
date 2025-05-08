// app/components/AnimatedText.tsx
'use client';

import { useEffect, useState } from "react";

export default function AnimatedText() {
  const [titleText, setTitleText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const fullTitle = "The Anonymous Mic";
  const fullDescription = "Share anonymous messages with featured individuals. No login required, completely anonymous.";
  
  useEffect(() => {
    let titleIndex = 0;
    let descIndex = 0;
    let titleTimer: NodeJS.Timeout;
    let descTimer: NodeJS.Timeout;
    
    // Type out title first
    const typeTitle = () => {
      if (titleIndex < fullTitle.length) {
        setTitleText(fullTitle.substring(0, titleIndex + 1));
        titleIndex++;
        titleTimer = setTimeout(typeTitle, 300);
      } else {
        setTimeout(() => {
          descTimer = setInterval(typeDescription, 200);
        }, 500);
      }
    };
    
    // Type out description
    const typeDescription = () => {
      if (descIndex < fullDescription.length) {
        setDescriptionText(fullDescription.substring(0, descIndex + 1));
        descIndex++;
      } else {
        clearInterval(descTimer);
      }
    };
    
    titleTimer = setTimeout(typeTitle, 800);
    
    return () => {
      clearTimeout(titleTimer);
      clearInterval(descTimer);
    };
  }, []);

  return (
    <div className="w-[fit] text-center lg:text-right bottom-20 lg:top-[20%] right-8 px-8 fixed">
      <h1 className="text-2xl lg:text-4xl font-bold mb-3">
        {titleText}
        <span className={`${titleText.length === fullTitle.length ? 'hidden' : 'inline-block'} animate-blink`}>|</span>
      </h1>
      <p className="text-lg max-w-lg mx-auto">
        {descriptionText}
        <span className={`${descriptionText.length === fullDescription.length ? 'hidden' : 'inline-block'} animate-blink`}>|</span>
      </p>
    </div>
  );
}