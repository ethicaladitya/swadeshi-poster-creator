import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Square, Circle } from "lucide-react";
import posterTemplate from "/lovable-uploads/8eb6e34c-f83c-40a8-a46a-161b638b754e.png";

export type FrameType = "square" | "circle";

interface PosterPreviewProps {
  userImage?: string;
  frameType: FrameType;
  onFrameTypeChange: (type: FrameType) => void;
  onCameraClick: () => void;
  onUploadClick: () => void;
  customMessage?: string;
}

export const PosterPreview = ({
  userImage,
  frameType,
  onFrameTypeChange,
  onCameraClick,
  onUploadClick,
  customMessage
}: PosterPreviewProps) => {
  return (
    <div className="flex flex-col items-center space-y-4 sm:space-y-6">
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
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-br from-primary-light to-accent">
          {/* Background Poster Template */}
          <img
            src={posterTemplate}
            alt="Poster Template"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* User Image Frame - positioned in the center area of the poster */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-4">
            <div 
              className={`relative w-28 h-28 sm:w-36 sm:h-36 border-2 sm:border-4 border-white shadow-lg overflow-hidden ${
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

          {/* Custom Message Overlay */}
          {customMessage && (
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-lg">
                <p className="text-xs sm:text-sm font-medium text-foreground text-center leading-relaxed">
                  {customMessage}
                </p>
              </div>
            </div>
          )}
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