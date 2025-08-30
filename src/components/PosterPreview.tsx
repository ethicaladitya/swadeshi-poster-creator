import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Square, Circle } from "lucide-react";

export type FrameType = "square" | "circle";
export type PosterType = "poster1" | "poster2";

interface PosterPreviewProps {
  userImage?: string;
  frameType: FrameType;
  posterType: PosterType;
  onFrameTypeChange: (type: FrameType) => void;
  onPosterTypeChange: (type: PosterType) => void;
  onCameraClick: () => void;
  onUploadClick: () => void;
}

export const PosterPreview = ({
  userImage,
  frameType,
  posterType,
  onFrameTypeChange,
  onPosterTypeChange,
  onCameraClick,
  onUploadClick,
}: PosterPreviewProps) => {
  const posterImages = {
    poster1: "/uploads/poster1.png",
    poster2: "/uploads/poster2.png"
  };
  return (
    <div className="flex flex-col items-center space-y-4 sm:space-y-6">
      {/* Poster Selection */}
      <div className="flex flex-col items-center space-y-3">
        <span className="text-sm font-medium text-muted-foreground">Choose Poster:</span>
        <div className="flex items-center space-x-4">
          <div 
            className={`relative cursor-pointer transition-all duration-200 ${
              posterType === "poster1" ? "ring-2 ring-primary scale-105" : "hover:scale-102"
            }`}
            onClick={() => onPosterTypeChange("poster1")}
          >
            <img
              src={posterImages.poster1}
              alt="Poster Option 1"
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border-2 border-muted"
            />
          </div>
          <div 
            className={`relative cursor-pointer transition-all duration-200 ${
              posterType === "poster2" ? "ring-2 ring-primary scale-105" : "hover:scale-102"
            }`}
            onClick={() => onPosterTypeChange("poster2")}
          >
            <img
              src={posterImages.poster2}
              alt="Poster Option 2"
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border-2 border-muted"
            />
          </div>
        </div>
      </div>

      {/* Frame Type Selection */}
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <span className="text-sm font-medium text-muted-foreground">Frame Shape:</span>
        <div className="flex items-center space-x-2">
          <Button
            variant={frameType === "square" ? "default" : "outline"}
            size="sm"
            onClick={() => onFrameTypeChange("square")}
            className="flex items-center space-x-2"
          >
            <Square className="w-4 h-4" />
            <span>Square</span>
          </Button>
          <Button
            variant={frameType === "circle" ? "default" : "outline"}
            size="sm"
            onClick={() => onFrameTypeChange("circle")}
            className="flex items-center space-x-2"
          >
            <Circle className="w-4 h-4" />
            <span>Circle</span>
          </Button>
        </div>
      </div>

      {/* Poster Preview */}
      <Card className="relative overflow-hidden border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-smooth">
        <div className="relative w-72 h-128 sm:w-80 sm:h-144 bg-gradient-to-br from-primary-light to-accent" style={{ aspectRatio: '9/16' }}>
          {/* Background Poster Template */}
          <img
            src={posterImages[posterType]}
            alt="Poster Template"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* User Image Frame - positioned in the middle center of the poster */}
          <div className="absolute left-1/2 top-[38%] transform -translate-x-1/2">
            <div 
              className={`relative w-40 h-40 sm:w-48 sm:h-48 border-2 sm:border-4 border-white shadow-lg overflow-hidden ${
                frameType === "circle" ? "poster-frame-circle" : "poster-frame-square"
              }`}
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto bg-muted-foreground/10 rounded-full flex items-center justify-center">
                      <Camera className="w-4 h-4 sm:w-6 sm:h-6 text-muted-foreground" />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">Your Photo</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-sm">
        <Button
          onClick={onCameraClick}
          variant="outline"
          className="flex items-center space-x-2 w-full sm:w-auto"
        >
          <Camera className="w-4 h-4" />
          <span>Take Photo</span>
        </Button>
        <Button
          onClick={onUploadClick}
          variant="outline"
          className="flex items-center space-x-2 w-full sm:w-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Photo</span>
        </Button>
      </div>
    </div>
  );
};