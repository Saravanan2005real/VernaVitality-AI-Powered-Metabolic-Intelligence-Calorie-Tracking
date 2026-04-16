'use client';
import { compressImage } from '@/lib/utils/clientImageProcessing';
import React, { useEffect, useRef, useState } from 'react';
import { FaImage, FaStar, FaCamera, FaMagic } from 'react-icons/fa';

interface MealFormProps {
  mealDescription: string;
  setMealDescription: (description: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onImageUpload: (file: File) => Promise<void>;
  isLoading: boolean;
  onOpenFavorites: () => void;
  compact?: boolean;
}

export default function MealForm({
  mealDescription,
  setMealDescription,
  onSubmit,
  onImageUpload,
  isLoading,
  onOpenFavorites,
  compact = false,
}: MealFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleImageSelect = async (file: File) => {
    try {
      setIsCompressing(true);
      setError(null);

      const MAX_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        throw new Error('Image is too large. Maximum size is 10MB.');
      }

      const compressedFile = await compressImage(file);
      const imageUrl = URL.createObjectURL(compressedFile);
      setSelectedImage(imageUrl);
      setSelectedFile(compressedFile);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to process image. Please try a different image.';
      setError(errorMessage);
      console.error('Image compression error:', err);

      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
      setSelectedImage(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDeleteImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedFile) {
      try {
        await onImageUpload(selectedFile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again.');
      }
    } else {
      try {
        await onSubmit(e);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to analyze meal. Please try again.');
      }
    }
  };

  if (!isMounted) return null;

  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      {!compact && (
        <div className="flex justify-between items-center">
          <label htmlFor="mealDescription" className="font-semibold text-white text-sm tracking-wide uppercase">
            Track Your Meal
          </label>
          <button
            type="button"
            onClick={onOpenFavorites}
            className="group flex items-center gap-1.5 p-1 px-3 bg-white/5 hover:bg-yellow-500/10 rounded-full transition-all"
          >
            <FaStar className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition-transform" />
            <span className="text-gray-400 text-xs font-medium group-hover:text-yellow-500">Favorites</span>
          </button>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className={compact ? "space-y-4" : "space-y-6"}>
        <div className="relative group">
          <textarea
            id="mealDescription"
            value={mealDescription}
            onChange={e => setMealDescription(e.target.value)}
            className={`bg-zinc-900/50 border border-white/10 group-focus-within:border-blue-500/50 rounded-2xl w-full text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none ${compact ? "p-3 text-xs" : "p-4"}`}
            placeholder={
              selectedImage
                ? 'Add photo details...'
                : 'What did you eat?'
            }
            rows={compact ? 2 : 3}
            required={selectedFile === null}
            disabled={isLoading}
          />
          <div className="absolute right-3 bottom-3 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
            <FaMagic className="text-blue-500/50" />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 p-4 border border-red-500/20 rounded-2xl text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          {/* ... existing input refs ... */}
          {selectedImage ? (
            <div className={`flex-1 relative group bg-white/5 p-1.5 rounded-xl border border-white/10 ${compact ? "h-16" : "h-24 sm:h-32"}`}>
              <img src={selectedImage} alt="Selected food" className="w-full h-full object-cover rounded-lg" />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="-top-2 -right-2 absolute bg-rose-600 hover:bg-rose-500 shadow-lg p-1.5 rounded-full text-white transition-colors"
                disabled={isLoading || isCompressing}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => !isLoading && !isCompressing && fileInputRef.current?.click()}
                className={`flex flex-1 justify-center items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-400 font-bold transition-all active:scale-95 ${compact ? "p-2 text-[10px]" : "p-4 text-sm"}`}
                disabled={isLoading || isCompressing}
              >
                <FaImage className={compact ? "w-3 h-3 text-blue-400" : "w-5 h-5 text-blue-400"} />
                Upload
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('camera-input')?.click()}
                className={`flex flex-1 justify-center items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-400 font-bold transition-all active:scale-95 ${compact ? "p-2 text-[10px]" : "p-4 text-sm"}`}
                disabled={isLoading || isCompressing}
              >
                <FaCamera className={compact ? "w-3 h-3 text-emerald-400" : "w-5 h-5 text-emerald-400"} />
                Camera
              </button>
            </>
          )}
        </div>

        <button
          type="submit"
          className={`relative group bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 shadow-xl shadow-blue-600/20 rounded-xl w-full text-white font-black uppercase tracking-widest transition-all overflow-hidden disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] ${compact ? "p-3 text-[10px]" : "p-4 text-sm"}`}
          disabled={isLoading || isCompressing}
        >
          <span className="relative z-10 flex justify-center items-center gap-2">
            {isLoading ? (
              <>
                <div className="border-2 border-white/30 border-t-white rounded-full w-3 h-3 animate-spin" />
                Analyzing...
              </>
            ) : isCompressing ? (
              'Processing...'
            ) : (
              <>
                <FaMagic className={compact ? "w-3 h-3" : "w-4 h-4"} />
                Sync Nutrition
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
      </form>
    </div>
  );
}
