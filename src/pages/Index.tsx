import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PosterPreview, type FrameType } from "@/components/PosterPreview";
import { CameraCapture } from "@/components/CameraCapture";
import { PhotoEditor } from "@/components/PhotoEditor";
import { MessageEditor } from "@/components/MessageEditor";
import { usePosterGenerator } from "@/hooks/usePosterGenerator";
import { Download, Share2, Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [userImage, setUserImage] = useState<string>("");
  const [frameType, setFrameType] = useState<FrameType>("circle");
  const [customMessage, setCustomMessage] = useState("Excited to be part of Cloud Community Day 2025! 🚀");
  const [showCamera, setShowCamera] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const { downloadPoster, sharePoster } = usePosterGenerator();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCameraCapture = (imageData: string) => {
    setUserImage(imageData);
    toast({
      title: "Photo Captured!",
      description: "Your photo has been added to the poster.",
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setShowEditor(true);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
    }
  };

  const handleEditorConfirm = (editedImageData: string) => {
    setUserImage(editedImageData);
    setShowEditor(false);
    setSelectedFile(null);
    toast({
      title: "Photo Updated!",
      description: "Your edited photo has been added to the poster.",
    });
  };

  const handleEditorDiscard = () => {
    setShowEditor(false);
    setSelectedFile(null);
  };

  const handleDownload = async () => {
    if (!userImage) {
      toast({
        title: "No Photo",
        description: "Please add your photo first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await downloadPoster(userImage, frameType, customMessage);
      toast({
        title: "Success!",
        description: "Your poster has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your poster. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!userImage) {
      toast({
        title: "No Photo",
        description: "Please add your photo first.",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    try {
      const result = await sharePoster(userImage, frameType, customMessage);
      
      if (result === 'clipboard') {
        toast({
          title: "Copied to Clipboard!",
          description: "Your poster has been copied to clipboard. You can now paste it in your social media apps.",
        });
      } else if (result === 'download') {
        toast({
          title: "Downloaded!",
          description: "Sharing not supported on this device. Your poster has been downloaded instead.",
        });
      } else {
        toast({
          title: "Shared Successfully!",
          description: "Your poster is ready to share on social media.",
        });
      }
    } catch (error) {
      console.error("Share error:", error);
      toast({
        title: "Share Failed",
        description: "There was an error sharing your poster. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-accent/30">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-foreground">
                  GCCD 2025 Poster Creator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create your custom Cloud Community Day poster
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Left Column - Poster Preview */}
          <div className="space-y-4 lg:space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <PosterPreview
                  userImage={userImage}
                  frameType={frameType}
                  onFrameTypeChange={setFrameType}
                  onCameraClick={() => setShowCamera(true)}
                  onUploadClick={handleUploadClick}
                  customMessage={customMessage}
                />
              </CardContent>
            </Card>

            {/* Generate Poster Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold font-display">Generate Your Poster</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Button
                      onClick={handleDownload}
                      className="flex items-center justify-center space-x-2 h-11"
                      disabled={!userImage || isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      <span>{isGenerating ? "Generating..." : "Download Poster"}</span>
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="flex items-center justify-center space-x-2 h-11"
                      disabled={!userImage || isSharing}
                    >
                      {isSharing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                      <span>{isSharing ? "Sharing..." : "Share on Social"}</span>
                    </Button>
                  </div>
                  {!userImage && (
                    <p className="text-sm text-muted-foreground text-center">
                      Add your photo to enable poster generation
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Message Editor */}
          <div className="space-y-4 lg:space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border-0 shadow-lg">
              <MessageEditor
                value={customMessage}
                onChange={setCustomMessage}
              />
            </div>

            {/* Instructions */}
            <Card className="bg-success-light border-success/20">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold font-display text-success-foreground mb-3">
                  How to Create Your Poster
                </h3>
                <div className="space-y-2 text-sm text-success-foreground">
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold flex-shrink-0">1.</span>
                    <span>Choose your frame shape (square or circle)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold flex-shrink-0">2.</span>
                    <span>Add your photo using camera or upload</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold flex-shrink-0">3.</span>
                    <span>Customize your message or use our suggestions</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold flex-shrink-0">4.</span>
                    <span>Generate and share your poster!</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Photo Editor Modal */}
      {showEditor && selectedFile && (
        <PhotoEditor
          imageFile={selectedFile}
          onConfirm={handleEditorConfirm}
          onDiscard={handleEditorDiscard}
        />
      )}
    </div>
  );
};

export default Index;