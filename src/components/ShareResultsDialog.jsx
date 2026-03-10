import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import {
  Copy,
  Facebook,
  Twitter,
  Mail,
  MessageSquare,
  Check
} from "lucide-react";

export const ShareResultsDialog = ({ open, onOpenChange, result }) => {

  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Generate shareable summary
  const generateSummary = () => {

    const confidence = Math.round(result.overallConfidence * 100);
    const status = result.isHealthy ? "Healthy" : "Disease Detected";
    const diseases = result.detectedDiseases.map(d => d.disease).join(", ");

    return `🌱 CropSense AI Analysis Results:
Status: ${status}
Confidence: ${confidence}%
${result.detectedDiseases.length > 0 ? `Detected: ${diseases}` : ""}
Analyzed with AI-powered crop disease detection.`;

  };

  const shareText = generateSummary();
  const shareUrl = window.location.origin + "/?shared=analysis";

  const copyToClipboard = async () => {

    try {

      await navigator.clipboard.writeText(
        `${shareText}\n\nTry it yourself: ${shareUrl}`
      );

      setCopied(true);

      toast({
        title: "Copied!",
        description: "Results copied to clipboard!",
      });

      setTimeout(() => setCopied(false), 2000);

    } catch (error) {

      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });

    }

  };

  const shareViaEmail = () => {

    const subject = "CropSense AI Analysis Results";

    const body = encodeURIComponent(
      `${shareText}\n\nTry CropSense AI yourself: ${shareUrl}`
    );

    window.open(`mailto:?subject=${subject}&body=${body}`);

  };

  const shareViaTwitter = () => {

    const text = encodeURIComponent(`${shareText} ${shareUrl}`);

    window.open(`https://twitter.com/intent/tweet?text=${text}`);

  };

  const shareViaFacebook = () => {

    const url = encodeURIComponent(shareUrl);
    const quote = encodeURIComponent(shareText);

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`
    );

  };

  const shareViaWhatsApp = () => {

    const text = encodeURIComponent(
      `${shareText}\n\nTry it yourself: ${shareUrl}`
    );

    window.open(`https://wa.me/?text=${text}`);

  };

  return (

    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <DialogTitle>Share Analysis Results</DialogTitle>

          <DialogDescription>
            Share your crop analysis results with others
          </DialogDescription>

        </DialogHeader>

        <div className="space-y-6">

          {/* Share preview */}

          <div className="space-y-2">

            <label className="text-sm font-medium">
              Share Content:
            </label>

            <div className="p-3 bg-muted rounded-lg text-sm">
              {shareText}
            </div>

          </div>

          {/* Copy Link */}

          <div className="space-y-2">

            <label className="text-sm font-medium">
              Copy Link:
            </label>

            <div className="flex gap-2">

              <Input value={shareUrl} readOnly />

              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex-shrink-0"
              >

                {copied
                  ? <Check className="w-4 h-4" />
                  : <Copy className="w-4 h-4" />
                }

              </Button>

            </div>

          </div>

          {/* Social buttons */}

          <div className="space-y-3">

            <label className="text-sm font-medium">
              Share via:
            </label>

            <div className="grid grid-cols-2 gap-3">

              <Button
                variant="outline"
                onClick={shareViaEmail}
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email
              </Button>

              <Button
                variant="outline"
                onClick={shareViaTwitter}
                className="flex items-center gap-2"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </Button>

              <Button
                variant="outline"
                onClick={shareViaFacebook}
                className="flex items-center gap-2"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </Button>

              <Button
                variant="outline"
                onClick={shareViaWhatsApp}
                className="flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </Button>

            </div>

          </div>

        </div>

      </DialogContent>

    </Dialog>

  );

};
