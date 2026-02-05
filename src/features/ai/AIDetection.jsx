'use client';

import { useEffect } from 'react';
import { useObjectDetection } from './useObjectDetection';

export default function AIDetection({ file, onResult }) {
  const {
    detectAndClassify,
    modelLoaded,
    isLoading,
    error
  } = useObjectDetection();

  useEffect(() => {
    if (!file || !modelLoaded) return;

    const run = async () => {
      try {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = () => {
          img.onload = async () => {
            const result = await detectAndClassify(img);
            if (onResult) onResult(result);
          };
          img.src = reader.result;
        };

        reader.readAsDataURL(file);
      } catch (err) {
        console.error('AI detection failed:', err);
        if (onResult) onResult(null);
      }
    };

    run();
  }, [file, modelLoaded, detectAndClassify, onResult]);

  if (isLoading) {
    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
        🤖 Loading AI model…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
        ❌ {error}
      </div>
    );
  }

  return null; // No UI, just logic
}
