import { useState, useEffect, useRef, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

export const useObjectDetection = () => {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const detectionIntervalRef = useRef(null);
  const modelLoadAttempts = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    const loadModel = async (retryCount = 0) => {
      try {
        setIsLoading(true);
        setError(null);
        console.log(`🔄 Loading MobileNet model (attempt ${retryCount + 1}/${maxRetries})...`);

        await tf.ready();
        await tf.setBackend('webgl');
        console.log('TensorFlow.js backend:', tf.getBackend());

        const originalFetch = window.fetch;
        window.fetch = async (url, options) => {
          if (typeof url === 'string' && (
            url.includes('tfhub.dev') || 
            url.includes('kaggle.com') || 
            url.includes('storage.googleapis.com/tfjs-models')
          )) {
            const proxyUrl = `/api/proxy-model?url=${encodeURIComponent(url)}`;
            console.log('Using proxy for:', url);
            return originalFetch(proxyUrl, options);
          }
          return originalFetch(url, options);
        };

        let modelConfig;
        if (retryCount === 0) {
          modelConfig = { version: 2, alpha: 1.0 };
        } else if (retryCount === 1) {
          modelConfig = { version: 1, alpha: 1.0 };
        } else {
          modelConfig = { version: 2, alpha: 0.5 };
        }

        console.log('Using config:', modelConfig);

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Model loading timeout (30s exceeded)')), 30000)
        );

        const modelPromise = mobilenet.load(modelConfig);
        const loadedModel = await Promise.race([modelPromise, timeoutPromise]);
        
        window.fetch = originalFetch;
        
        setModel(loadedModel);
        setIsLoading(false);
        console.log('✅ MobileNet model loaded successfully with config:', modelConfig);
        setError(null);
      } catch (err) {
        console.error(`❌ Error loading MobileNet model (attempt ${retryCount + 1}):`, err.message);

        if (retryCount < maxRetries - 1) {
          console.log(`🔄 Retrying with different configuration in 2 seconds...`);
          setTimeout(() => {
            modelLoadAttempts.current = retryCount + 1;
            loadModel(retryCount + 1);
          }, 2000);
        } else {
          console.error('⚠️ Could not load MobileNet model after multiple attempts.');
          console.error('This may be due to network issues or browser compatibility. Try refreshing the page.');
          setError('AI model failed to load - please refresh the page');
          setIsLoading(false);
        }
      }
    };

    loadModel();

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  const detectPetsInImage = useCallback(async (imageElement) => {
    if (!model || !imageElement) return [];

    try {
      const predictions = await model.classify(imageElement);
      console.log("PREDICTIONS:", predictions);
      setPredictions(predictions);
      return predictions;
    } catch (err) {
      console.error('Detection error:', err);
      setError('Detection failed');
      return [];
    }
  }, [model]);

  const classifyBreed = useCallback(async (imageElement) => {
    if (!model || !imageElement) {
      console.warn('Model not available');
      return null;
    }

    try {
      console.log('🔍 Classifying breed...');
      const predictions = await model.classify(imageElement);
      console.log('🏷️ Breed predictions:', predictions);

      return predictions.slice(0, 3).map(pred => ({
        breed: pred.className,
        confidence: Math.round(pred.probability * 100),
        probability: pred.probability
      }));
    } catch (err) {
      console.error('Breed classification error:', err);
      return null;
    }
  }, [model]);

  const detectAndClassify = useCallback(async (imageElement) => {
    if (!model || !imageElement) {
      return { detections: [], breeds: null, detected: false };
    }

    try {
      const allPredictions = await model.classify(imageElement);
      console.log('🏷️ All predictions:', allPredictions);

      const petKeywords = [
        'dog', 'puppy', 'hound', 'terrier', 'retriever', 'shepherd', 'bulldog', 'poodle', 
        'spaniel', 'beagle', 'chihuahua', 'pug', 'corgi', 'husky', 'labrador', 'dachshund',
        'schnauzer', 'doberman', 'rottweiler', 'mastiff', 'boxer', 'collie', 'pointer',
        'setter', 'dalmatian', 'pomeranian', 'shih-tzu', 'yorkshire', 'maltese', 'afghan',
        'basenji', 'borzoi', 'greyhound', 'whippet', 'samoyed', 'spitz', 'malamute',
        
        'cat', 'kitten', 'tabby', 'siamese', 'persian', 'maine coon', 'bengal', 'ragdoll',
        'egyptian cat', 'tiger cat', 'lynx',
        
        'bird', 'parrot', 'parakeet', 'cockatiel', 'canary', 'finch', 'macaw', 'cockatoo',
        'lorikeet', 'budgerigar', 'lovebird', 'conure', 'african grey',
        
        'rabbit', 'bunny', 'hamster', 'guinea pig', 'ferret', 'chinchilla', 'gerbil',
        'wood rabbit', 'angora',
        
        'turtle', 'tortoise', 'lizard', 'iguana', 'gecko', 'chameleon', 'tailed frog',
        'box turtle', 'terrapin',
        
        'horse', 'pony', 'stallion', 'mare', 'colt', 'arabian', 'appaloosa', 'sorrel',
        'goldfish', 'koi', 'beta'
      ];

      // Filter predictions to only those that match pet keywords with minimum 10% confidence
      const petPredictions = allPredictions.filter(pred => {
        const lowerClassName = pred.className.toLowerCase();
        const matchesPet = petKeywords.some(keyword => lowerClassName.includes(keyword));
        const hasMinConfidence = pred.probability >= 0.10; // At least 10% confidence
        return matchesPet && hasMinConfidence;
      });

      const isPet = petPredictions.length > 0 && petPredictions[0].probability >= 0.15;

      const breedPredictions = isPet ? petPredictions.slice(0, 3).map(pred => ({
        breed: pred.className,
        confidence: Math.round(pred.probability * 100),
        probability: pred.probability
      })) : null;

      const result = {
        breeds: breedPredictions,
        detected: isPet,
        petType: isPet && breedPredictions ? breedPredictions[0].breed : null,
        confidence: isPet && breedPredictions ? breedPredictions[0].confidence : 0,
        allDetections: breedPredictions || [],
        timestamp: new Date().toISOString()
      };

      console.log('🎯 Detection result:', result);
      return result;
    } catch (err) {
      console.error('Detection and classification error:', err);
      setError('AI analysis failed');
      return { detections: [], breeds: null, detected: false };
    }
  }, [model]);

  const startDetection = useCallback((mediaElement, intervalMs = 100) => {
    if (!model) return;
    setIsDetecting(true);
    setError(null);
    detectionIntervalRef.current = setInterval(async () => {
      await detectPetsInImage(mediaElement);
    }, intervalMs);
  }, [model, detectPetsInImage]);

  const stopDetection = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setIsDetecting(false);
    setPredictions([]);
  }, []);

  return {
    model,
    isLoading,
    isDetecting,
    predictions,
    error,
    detectPetsInImage,
    classifyBreed,
    detectAndClassify,
    startDetection,
    stopDetection,
    modelLoaded: !!model,
  };
};
