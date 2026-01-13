'use client';

import { useState, useRef } from 'react';

export default function ImageDropzone({ 
  onImageSelect, 
  selectedImage, 
  removeImage, 
  onAIDetect,
  isAnalyzing = false 
}) {
  const [dragActive, setDragActive] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleImageChange(file);
      } else {
        alert('Please upload only image files');
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        handleImageChange(file);
      } else {
        alert('Please upload only image files');
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleImageChange = (file) => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    onImageSelect(file);
  };

  const handleImageRemove = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    if (removeImage) removeImage();
  };

  return (
    <div className="photo-upload">
      <div
        className={`upload-area border-2 border-dashed rounded-xl p-6 md:p-8 text-center transition-all cursor-pointer
          ${
            dragActive
              ? 'border-orange-500 bg-orange-50'
              : selectedImage
              ? 'border-gray-300 bg-white'
              : 'border-gray-300 bg-gray-50 hover:border-orange-400 hover:bg-orange-50/50'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!selectedImage ? openFileDialog : undefined}
      >
        {!selectedImage ? (
          <>
            <svg
              className="w-10 h-10 md:w-12 md:h-12 mx-auto text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-700 font-medium mb-1">
              {dragActive ? 'Drop image here' : 'Upload pet photo'}
            </p>
            <p className="text-gray-500 text-xs md:text-sm mb-3">
              Drag and drop or click to browse
            </p>
            <p className="text-gray-400 text-xs">
              Supports: JPG, PNG, GIF, WebP
            </p>
          </>
        ) : (
          <div className="relative">
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Zoom In"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Zoom Out"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetZoom();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Reset Zoom"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <div className="text-xs text-center text-gray-600 px-1 py-1 border-t">
                {Math.round(zoom * 100)}%
              </div>
            </div>

            <div 
              className="overflow-hidden rounded-lg bg-gray-100 relative"
              style={{ 
                height: '320px',
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={URL.createObjectURL(selectedImage)}
                alt="Uploaded pet"
                className="absolute top-1/2 left-1/2 max-h-full max-w-full object-contain shadow-md transition-transform"
                style={{
                  transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${zoom})`,
                  transformOrigin: 'center',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
                draggable={false}
              />
            </div>
            
            <div className="mt-3 text-sm text-gray-600 text-center">
              {selectedImage.name} ({(selectedImage.size / 1024).toFixed(1)} KB)
              {zoom > 1 && <span className="ml-2 text-blue-600">• Drag to pan</span>}
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {selectedImage && (
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onAIDetect) onAIDetect();
            }}
            disabled={isAnalyzing}
            className={`flex-1 w-full px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              isAnalyzing 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-linear-to-r from-orange-light to-orange-lighter text-white hover:from-orange-primary hover:to-orange-secondary shadow-md hover:shadow-lg'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                Analyzing...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 3C9.23 3 6.19 5.95 6 9.66l-1.92 2.88c-.3.47-.48 1-.48 1.57V17c0 1.1.9 2 2 2h2v-4h8v4h2c1.1 0 2-.9 2-2v-2.89c0-.57-.18-1.1-.48-1.57L17.99 9.66C17.81 5.95 14.77 3 13 3z" />
                </svg>
                AI Breed Detection
              </>
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleImageRemove();
            }}
            className="flex-1 w-full px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-all shadow-md hover:shadow-lg"
          >
            Remove Image
          </button>
        </div>
      )}
    </div>
  );
}
