import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  posterDataURL: string;
  onDownload: () => void;
}

const SocialShareModal = ({ isOpen, onClose, posterDataURL, onDownload }: SocialShareModalProps) => {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const websiteURL = "https://www.swadeshibharatabhiyan.com/";
  const shareText = "🇮🇳 Check out my Swadeshi Bharat Abhiyan poster! Join the movement for Atmanirbhar Bharat. Create yours at " + websiteURL;

  const shareToClipboard = async () => {
    try {
      const response = await fetch(posterDataURL);
      const blob = await response.blob();
      
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]);
        toast({
          title: "Copied to Clipboard!",
          description: "Image copied. You can now paste it in any app.",
        });
      } else {
        throw new Error("Clipboard not supported");
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast({
        title: "Copy Failed",
        description: "Please try downloading instead.",
        variant: "destructive",
      });
    }
  };

  const shareToSocialMedia = (platform: string) => {
    setIsSharing(true);
    let url = "";
    
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteURL)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(websiteURL)}&title=${encodeURIComponent("Swadeshi Bharat Abhiyan")}&summary=${encodeURIComponent(shareText)}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        break;
      case "telegram":
        url = `https://t.me/share/url?url=${encodeURIComponent(websiteURL)}&text=${encodeURIComponent(shareText)}`;
        break;
      case "instagram":
        // Instagram doesn't support direct sharing via URL, so we'll copy and show instructions
        shareToClipboard();
        toast({
          title: "Ready for Instagram!",
          description: "Image copied to clipboard. Open Instagram and paste to share your story.",
          duration: 5000,
        });
        return;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
    
    setTimeout(() => setIsSharing(false), 1000);
  };

  const socialPlatforms = [
    { name: "WhatsApp", id: "whatsapp", color: "bg-green-500 hover:bg-green-600", icon: "📱" },
    { name: "Facebook", id: "facebook", color: "bg-blue-600 hover:bg-blue-700", icon: "📘" },
    { name: "Twitter/X", id: "twitter", color: "bg-black hover:bg-gray-800", icon: "🐦" },
    { name: "LinkedIn", id: "linkedin", color: "bg-blue-700 hover:bg-blue-800", icon: "💼" },
    { name: "Telegram", id: "telegram", color: "bg-blue-500 hover:bg-blue-600", icon: "✈️" },
    { name: "Instagram", id: "instagram", color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600", icon: "📷" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Share Your Poster</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preview */}
          <div className="flex justify-center">
            <img 
              src={posterDataURL} 
              alt="Generated Poster" 
              className="w-32 h-56 object-cover rounded-lg border shadow-sm"
            />
          </div>

          {/* Share message preview */}
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm text-slate-600 font-medium mb-1">Share message:</p>
            <p className="text-sm text-slate-800">{shareText}</p>
          </div>

          {/* Social Media Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {socialPlatforms.map((platform) => (
              <Button
                key={platform.id}
                onClick={() => shareToSocialMedia(platform.id)}
                className={`${platform.color} text-white flex items-center justify-center space-x-2 h-11`}
                disabled={isSharing}
              >
                <span className="text-lg">{platform.icon}</span>
                <span className="font-medium">{platform.name}</span>
              </Button>
            ))}
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <Button
              onClick={shareToClipboard}
              variant="outline"
              className="flex items-center justify-center space-x-2 h-11"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Image</span>
            </Button>
            <Button
              onClick={onDownload}
              variant="outline"
              className="flex items-center justify-center space-x-2 h-11"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Button>
          </div>

          <div className="text-xs text-slate-500 text-center">
            💡 Tip: For Instagram, copy the image and paste it in your story or post
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialShareModal;