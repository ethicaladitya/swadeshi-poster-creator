// Send name and phone to Google Sheet via Google Form
async function sendToGoogleSheet(name: string, phone: string) {
  const formData = new FormData();
  formData.append("entry.331566778", name);
  formData.append("entry.956618258", phone);
  await fetch(
    "https://docs.google.com/forms/d/e/1FAIpQLSdIcy1jbVS0waogiU7C0pjoHp9YJ1YwkPDJxUPWLrTkwqHfXA/formResponse",
    {
      method: "POST",
      mode: "no-cors",
      body: formData,
    }
  );
}
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PosterPreview, type FrameType, type PosterType } from "@/components/PosterPreview";
import { CameraCapture } from "@/components/CameraCapture";
import { PhotoEditor } from "@/components/PhotoEditor";
import SocialShareModal from "@/components/SocialShareModal";
import { usePosterGenerator } from "@/hooks/usePosterGenerator";
import { Download, Share2, Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [userImage, setUserImage] = useState<string>("");
  const [frameType, setFrameType] = useState<FrameType>("circle");
  const [posterType, setPosterType] = useState<PosterType>("poster1");
  const [showCamera, setShowCamera] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatedPosterURL, setGeneratedPosterURL] = useState<string>("");

  // User info form state
  const [showUserForm, setShowUserForm] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [formTouched, setFormTouched] = useState(false);
  
  const { downloadPoster, sharePoster, generatePoster } = usePosterGenerator();
  
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


  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);
    if (userName.trim() && userPhone.trim()) {
      setShowUserForm(false);
      
      // Check for photo before proceeding
      if (!userImage) {
        toast({
          title: "No Photo",
          description: "Please add your photo first.",
          variant: "destructive",
        });
        return;
      }

      // Send to Google Sheet
      try {
        await sendToGoogleSheet(userName.trim(), userPhone.trim());
      } catch (error) {
        console.error("Error sending to Google Sheet:", error);
      }

      // Proceed with download
      setIsGenerating(true);
      try {
        await downloadPoster(userImage, frameType, "", posterType);
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
    }
  };

  const handleDownload = async () => {
    // Always show the form before every download
    setUserName(""); // Clear previous values
    setUserPhone("");
    setShowUserForm(true);
    setFormTouched(false);
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
      // Generate the poster and get the data URL
      const posterDataURL = await generatePoster(userImage, frameType, "", posterType);
      setGeneratedPosterURL(posterDataURL);
      setShowShareModal(true);
    } catch (error) {
      console.error("Share error:", error);
      toast({
        title: "Share Failed",
        description: "There was an error generating your poster. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareDownload = async () => {
    if (generatedPosterURL) {
      const link = document.createElement("a");
      link.download = `Swadeshi-Poster-${Date.now()}.png`;
      link.href = generatedPosterURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Downloaded!",
        description: "Your poster has been downloaded successfully.",
      });
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
                  Swadeshi Bharat Abhiyan - Poster Creator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Bharat ko Atmanirbhar banane ki disha mein ham sabka sankalp. 
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
                {/* Upload Button Enhancement */}
                <div className="flex flex-col items-center mb-6">
                  <span className="text-base font-semibold text-primary mb-2">Upload Your Photo</span>
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold py-3 px-6 rounded-full shadow-lg border-2 border-orange-500 hover:scale-105 hover:shadow-xl transition-all duration-200 flex items-center gap-2 text-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
                    Upload Photo
                  </button>
                </div>
                {/* Existing PosterPreview component below */}
                <PosterPreview
                  userImage={userImage}
                  frameType={frameType}
                  posterType={posterType}
                  onFrameTypeChange={setFrameType}
                  onPosterTypeChange={setPosterType}
                  onCameraClick={() => setShowCamera(true)}
                  onUploadClick={handleUploadClick}
                />
              </CardContent>
            </Card>

            {/* Generate Poster Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* User Info Modal */}
                  <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
                    <DialogContent>
                      <form onSubmit={handleUserFormSubmit} className="space-y-4">
                        <h2 className="text-lg font-semibold">Enter your details to download</h2>
                        <div>
                          <Label htmlFor="userName">Name <span className="text-red-500">*</span></Label>
                          <Input
                            id="userName"
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                            placeholder="Your Name"
                            required
                            className={formTouched && !userName ? 'border-red-500' : ''}
                          />
                          {formTouched && !userName && (
                            <div className="text-xs text-red-500 mt-1">Name is required</div>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="userPhone">Phone Number <span className="text-red-500">*</span></Label>
                          <Input
                            id="userPhone"
                            value={userPhone}
                            onChange={e => setUserPhone(e.target.value)}
                            placeholder="Phone Number"
                            required
                            type="tel"
                            pattern="[0-9]{10,}"
                            className={formTouched && !userPhone ? 'border-red-500' : ''}
                          />
                          {formTouched && !userPhone && (
                            <div className="text-xs text-red-500 mt-1">Phone number is required</div>
                          )}
                        </div>
                        <button type="submit" className="w-full bg-primary text-white rounded-md py-2 font-semibold mt-2">Continue</button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <h3 className="text-lg font-semibold font-display mb-4">Generate Your Poster</h3>
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

            {/* Instructions */}
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold font-display text-white mb-3">
                  How to Create Your Poster
                </h3>
                <div className="space-y-2 text-sm text-slate-200">
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

            {/* Captions Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold font-display mb-4">Share with these captions:</h3>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-700">General/Instagram</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            navigator.clipboard.writeText("🇮🇳हम भारत वासी🇮🇳\n\nसंकल्प करे और संकल्प करवायें\nस्वदेशी अपनाएं और सभी को प्रेरित करे\n\n🤳 अपनी Selfie लेकर संकल्प करे भारत को आत्मनिर्भर बनाने का\nसेल्फी को डाउनलोड करके स्टेटस लगाए एवं लिंक को शेयर करे\n✨ आपका सहयोग ही हमारे अभियान की ताक़त है।\n\n— टीम 'स्वदेशी भारत अभियान'\n\n📌 Facebook: Swadeshibharatabhiyan\n📌 Instagram: Swadeshibharatabhiyan100\n📌 X: Swadeshibharatabhiyan");                          toast({
                            title: "Copied!",
                            description: "Caption copied to clipboard",
                          });
                        }}
                        className="flex items-center space-x-1"
                      >
                        <span>📋</span>
                        <span>Copy</span>
                      </Button>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      🇮🇳 हम भारतवासी संकल्प लें और संकल्प करवाएँ — स्वदेशी अपनाएँ, सभी को प्रेरित करें और आत्मनिर्भर भारत बनाएं 📸 अपनी सेल्फी लेकर संकल्प करें, स्टेटस लगाएँ और लिंक शेयर करें ✨ आपका सहयोग ही हमारे अभियान की ताक़त है #SwadeshiBharatAbhiyan
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-700">LinkedIn</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText("🇮🇳 हम भारतवासी संकल्प लें और संकल्प करवाएँ — स्वदेशी अपनाएँ, सभी को प्रेरित करें और आत्मनिर्भर भारत बनाएं 📸 अपनी सेल्फी लेकर संकल्प करें, स्टेटस लगाएँ और लिंक शेयर करें ✨ आपका सहयोग ही हमारे अभियान की ताक़त है, आइए मिलकर स्वदेशी भारत अभियान को गति दें #SwadeshiBharatAbhiyan");
                          toast({
                            title: "Copied!",
                            description: "LinkedIn caption copied to clipboard",
                          });
                        }}
                        className="flex items-center space-x-1"
                      >
                        <span>📋</span>
                        <span>Copy</span>
                      </Button>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      🇮🇳 हम भारतवासी संकल्प लें और संकल्प करवाएँ — स्वदेशी अपनाएँ, सभी को प्रेरित करें और आत्मनिर्भर भारत बनाएं 📸 अपनी सेल्फी लेकर संकल्प करें, स्टेटस लगाएँ और लिंक शेयर करें ✨ आपका सहयोग ही हमारे अभियान की ताक़त है, आइए मिलकर स्वदेशी भारत अभियान को गति दें #SwadeshiBharatAbhiyan
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-700">Twitter/X</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText("🇮🇳 हम भारतवासी संकल्प लें और संकल्प करवाएँ — स्वदेशी अपनाएँ, सभी को प्रेरित करें और आत्मनिर्भर भारत बनाएं 📸 अपनी सेल्फी लेकर संकल्प करें, स्टेटस लगाएँ और लिंक शेयर करें ✨ आपका सहयोग ही हमारे अभियान की ताक़त है, आइए मिलकर स्वदेशी भारत अभियान को गति दें #SwadeshiBharatAbhiyan");
                          toast({
                            title: "Copied!",
                            description: "Twitter caption copied to clipboard",
                          });
                        }}
                        className="flex items-center space-x-1"
                      >
                        <span>📋</span>
                        <span>Copy</span>
                      </Button>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      🇮🇳 हम भारतवासी संकल्प लें और संकल्प करवाएँ — स्वदेशी अपनाएँ, सभी को प्रेरित करें और आत्मनिर्भर भारत बनाएं 📸 अपनी सेल्फी लेकर संकल्प करें, स्टेटस लगाएँ और लिंक शेयर करें ✨ आपका सहयोग ही हमारे अभियान की ताक़त है, आइए मिलकर स्वदेशी भारत अभियान को गति दें #SwadeshiBharatAbhiyan
                    </p>
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

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        posterDataURL={generatedPosterURL}
        onDownload={handleShareDownload}
      />
    </div>
  );
};

export default Index;