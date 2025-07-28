import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Sparkles } from "lucide-react";

interface MessageEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const SUGGESTED_MESSAGES = [
  "Excited to be part of Cloud Community Day 2025! 🚀",
  "Learning, networking, and growing with the cloud community! ☁️",
  "Cloud Community Day 2025 - Where innovation meets collaboration! 💡",
  "Proud to be part of the GDG community! #CCD2025",
  "Building the future with cloud technology! 🌟",
  "Connecting with amazing cloud enthusiasts at CCD 2025! 🤝",
];

export const MessageEditor = ({ value, onChange }: MessageEditorProps) => {
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleSuggestionClick = (message: string) => {
    onChange(message);
    setIsCustomizing(false);
  };

  const handleCustomize = () => {
    setIsCustomizing(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center space-x-2">
          <MessageSquare className="w-5 h-5" />
          <span>Custom Message</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCustomizing ? (
          <div className="space-y-4">
            {/* Current Message Display */}
            {value && (
              <div className="p-3 bg-primary-light rounded-lg border">
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
            )}

            {/* Suggested Messages */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Suggested Messages:</span>
              </div>
              <div className="grid gap-2">
                {SUGGESTED_MESSAGES.map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-3 text-left justify-start"
                    onClick={() => handleSuggestionClick(message)}
                  >
                    <span className="text-sm leading-relaxed">{message}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Customize Button */}
            <Button 
              variant="outline" 
              onClick={handleCustomize}
              className="w-full"
            >
              Write Custom Message
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Custom Message Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Message:</label>
              <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Write your custom message for the poster..."
                className="min-h-[100px] resize-none"
                maxLength={150}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {value.length}/150 characters
                </span>
                <Badge variant="secondary" className="text-xs">
                  Keep it short for best results
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCustomizing(false)}
                className="flex-1"
              >
                Back to Suggestions
              </Button>
              <Button
                onClick={() => setIsCustomizing(false)}
                className="flex-1"
                disabled={!value.trim()}
              >
                Save Message
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};