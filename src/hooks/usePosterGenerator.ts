import { useRef } from "react";
  import type { FrameType, PosterType } from "@/components/PosterPreview";

  export const usePosterGenerator = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const posterImages = {
      poster1: "/lovable-uploads/cffb072f-1803-4498-b64e-f201089facda.png",
      poster2: "/lovable-uploads/aa43d408-f9f1-488d-a569-3f933ac1d31a.png"
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

      const posterWidth = 1080;
      const posterHeight = 1920;
      canvas.width = posterWidth;
      canvas.height = posterHeight;

      const templateImg = new Image();
      templateImg.crossOrigin = 'anonymous';

      templateImg.onload = () => {
        ctx.drawImage(templateImg, 0, 0, posterWidth, posterHeight);

        const userImg = new Image();
        userImg.crossOrigin = 'anonymous';

        userImg.onload = () => {
          const frameSize = 360;
          const frameX = (posterWidth - frameSize) / 2;
          const frameY = (posterHeight - frameSize) / 2 + posterHeight * 0.06;

          ctx.save();

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
            ctx.beginPath();
            ctx.rect(frameX, frameY, frameSize, frameSize);
            ctx.clip();
          }
          
          ctx.drawImage(userImg, frameX, frameY, frameSize, frameSize);
          ctx.restore();

          // Custom message logic
          if (customMessage && customMessage.trim()) {
            ctx.save();
            ctx.translate(100, 150); // Top-left offset
            ctx.rotate(-30 * Math.PI / 180);
            ctx.font = 'bold 36px Orbitron, sans-serif';
            ctx.lineWidth = 4;
            ctx.strokeStyle = `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;
            ctx.strokeText(customMessage, 0, 0);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(customMessage, 0, 0);
            ctx.restore();
          }

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