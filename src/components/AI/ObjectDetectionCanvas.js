import { useRef, useEffect } from 'react';

export const ObjectDetectionCanvas = ({ predictions, videoRef }) => {
  const canvasRef = useRef(null);

  const drawBoundingBoxes = (predictions, canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      const text = `${prediction.class} (${Math.round(prediction.score * 100)}%)`;

      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = '#00FF00';
      ctx.font = 'bold 16px Arial';
      const textWidth = ctx.measureText(text).width;
      ctx.fillRect(x, y - 25, textWidth + 10, 25);

      ctx.fillStyle = '#000000';
      ctx.fillText(text, x + 5, y - 7);
    });
  };
    
     useEffect(() => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    drawBoundingBoxes(predictions, canvas);
  }, [predictions, videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-none"
    />
  );
};
