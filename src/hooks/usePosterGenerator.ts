import { useRef } from "react";
import type { FrameType, PosterType } from "@/components/PosterPreview";

export const usePosterGenerator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const posterImages = {
    poster1: "/lovable-uploads/poster1.png",
    poster2: "/lovable-uploads/poster2.png"
  };

  const generatePoster = async (
    userImage: string,
    frameType: FrameType,
    customMessage: string,
    posterType: PosterType = "poster1"
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Set canvas size to match poster dimensions
      const posterWidth = 1080;
      const posterHeight = 1080;
      canvas.width = posterWidth;
      canvas.height = posterHeight;

      // Load poster template
      const templateImg = new Image();
      templateImg.crossOrigin = 'anonymous';
      
      templateImg.onload = () => {
        // Draw poster template
        ctx.drawImage(templateImg, 0, 0, posterWidth, posterHeight);

        // Load user image
        const userImg = new Image();
        userImg.crossOrigin = 'anonymous';
        
        userImg.onload = () => {
          // Calculate frame position (center of poster)
          const frameSize = 360; // Increased frame size for larger photos
          const frameX = (posterWidth - frameSize) / 2;
          const frameY = (posterHeight - frameSize) / 2 - 50; // Slightly above center

          // Save context for clipping
          ctx.save();

          // Create clipping path based on frame type
          if (frameType === 'circle') {
            ctx.beginPath();
            ctx.arc(
              frameX + frameSize / 2,
              frameY + frameSize / 2,
              frameSize / 2,
              0,
              Math.PI * 2
            );
            ctx.clip();
          } else {
            // Square clipping
            ctx.beginPath();
            ctx.rect(frameX, frameY, frameSize, frameSize);
            ctx.clip();
          }

          // Draw user image within the frame
          ctx.drawImage(userImg, frameX, frameY, frameSize, frameSize);

          // Restore context
          ctx.restore();

          // Add custom message if provided
          if (customMessage && customMessage.trim()) {
            ctx.font = 'bold 28px Inter, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.textAlign = 'center';
            
            // Create text background
            const textY = posterHeight - 120;
            const textMetrics = ctx.measureText(customMessage);
            const textWidth = textMetrics.width;
            const padding = 20;
            
            // Draw text background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(
              (posterWidth - textWidth) / 2 - padding,
              textY - 35,
              textWidth + padding * 2,
              50
            );
            
            // Draw text with outline
            ctx.strokeText(customMessage, posterWidth / 2, textY);
            ctx.fillStyle = '#000000';
            ctx.fillText(customMessage, posterWidth / 2, textY);
          }

          // Convert canvas to data URL
          const dataURL = canvas.toDataURL('image/png', 1.0);
          resolve(dataURL);
        };

        userImg.onerror = () => {
          reject(new Error('Failed to load user image'));
        };

        userImg.src = userImage;
      };

      templateImg.onerror = () => {
        reject(new Error('Failed to load poster template'));
      };

      templateImg.src = posterImages[posterType];
    });
  };

  const downloadPoster = async (
    userImage: string,
    frameType: FrameType,
    customMessage: string,
    posterType: PosterType = "poster1"
  ) => {
    try {
      const posterDataURL = await generatePoster(userImage, frameType, customMessage, posterType);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `GCCD-2025-Poster-${Date.now()}.png`;
      link.href = posterDataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Error generating poster:', error);
      throw error;
    }
  };

  const sharePoster = async (
    userImage: string,
    frameType: FrameType,
    customMessage: string,
    posterType: PosterType = "poster1"
  ) => {
    try {
      const posterDataURL = await generatePoster(userImage, frameType, customMessage, posterType);
      
      // Convert data URL to blob
      const response = await fetch(posterDataURL);
      const blob = await response.blob();
      
      const file = new File([blob], 'GCCD-2025-Poster.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My GCCD 2025 Poster',
          text: 'Check out my Cloud Community Day 2025 poster!',
          files: [file]
        });
        return true;
      } else {
        // Fallback: copy to clipboard if available
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob
            })
          ]);
          return 'clipboard';
        } else {
          // Final fallback: download
          await downloadPoster(userImage, frameType, customMessage, posterType);
          return 'download';
        }
      }
    } catch (error) {
      console.error('Error sharing poster:', error);
      throw error;
    }
  };

  return {
    generatePoster,
    downloadPoster,
    sharePoster
  };
};