import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Lightbulb,
  Shield,
  Download,
  Share2,
  BookOpen
} from "lucide-react";
import { EnhancedShareDialog } from "./EnhancedShareDialog";
import { LearnMoreDialog } from "./LearnMoreDialog";
import { generatePDFReport } from "@/utils/reportGenerator";

export const AnalysisResults = ({ result, onNewAnalysis, imageFile }) => {
  const { toast } = useToast();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [learnMoreDialogOpen, setLearnMoreDialogOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "Low":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "Medium":
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case "High":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <CheckCircle className="w-5 h-5 text-success" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Low":
        return "bg-success/10 text-success border-success/20";
      case "Medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "High":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-success/10 text-success border-success/20";
    }
  };

  const handleDownloadReport = async () => {
    setIsGeneratingPDF(true);
    try {
      let imageDataUrl = "";

      if (imageFile) {
        const reader = new FileReader();
        imageDataUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(imageFile);
        });
      }

      await generatePDFReport(result, imageDataUrl);

      toast({
        title: "Success!",
        description: "Report downloaded successfully!",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);

      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShareResults = () => {
    setShareDialogOpen(true);
  };

  const handleLearnMore = () => {
    setLearnMoreDialogOpen(true);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              {result.isHealthy ? (
                <CheckCircle className="w-8 h-8 text-success animate-glow" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-warning animate-glow" />
              )}

              <h2 className="text-4xl font-bold">
                {result.isHealthy
                  ? "Healthy Crop Detected"
                  : "Disease Analysis Complete"}
              </h2>
            </div>

            <p className="text-xl text-muted-foreground">
              Analysis completed with{" "}
              {Math.round(result.overallConfidence * 100)}% confidence
            </p>
          </div>

          {/* Results Card */}
          <Card className="p-8 mb-8 shadow-card">
            <div className="grid md:grid-cols-2 gap-8">

              {/* Disease Info */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Detection Results
                </h3>

                {result.detectedDiseases.map((disease, index) => (
                  <div key={index} className="space-y-4">

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getSeverityIcon(disease.severity)}
                        <h4 className="text-xl font-semibold">
                          {disease.disease}
                        </h4>
                      </div>

                      <Badge className={getSeverityColor(disease.severity)}>
                        {disease.severity} Risk
                      </Badge>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          Confidence Level
                        </span>
                        <span className="text-sm font-bold">
                          {Math.round(disease.confidence * 100)}%
                        </span>
                      </div>

                      <div className="w-full bg-border rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-accent to-success"
                          style={{ width: `${disease.confidence * 100}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-muted-foreground">
                      {disease.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-semibold">
                    AI Recommendations
                  </h3>
                </div>

                <div className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex gap-3 p-3 bg-accent/5 rounded-lg border border-accent/20"
                    >
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </Card>

          <Separator className="my-8" />

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">

            <Button onClick={onNewAnalysis}>
              Analyze Another Image
            </Button>

            <Button
              variant="outline"
              onClick={handleDownloadReport}
              disabled={isGeneratingPDF}
            >
              <Download className="w-4 h-4 mr-2" />
              {isGeneratingPDF ? "Generating..." : "Download Report"}
            </Button>

            <Button variant="outline" onClick={handleShareResults}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Results
            </Button>

            <Button variant="outline" onClick={handleLearnMore}>
              <BookOpen className="w-4 h-4 mr-2" />
              Learn More
            </Button>

          </div>

        </div>
      </div>

      {/* Dialogs */}
      <EnhancedShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        result={result}
        imageFile={imageFile}
      />

      <LearnMoreDialog
        open={learnMoreDialogOpen}
        onOpenChange={setLearnMoreDialogOpen}
        result={result}
      />
    </section>
  );
};
