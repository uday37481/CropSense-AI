import { Loader2, Brain, Zap } from "lucide-react";

export const LoadingScreen = ({ message = "Initializing AI models..." }) => {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">

        {/* Animated Logo */}
        <div className="relative">
          <div className="p-6 bg-primary/10 rounded-full animate-pulse">
            <Brain className="w-12 h-12 text-primary animate-glow" />
          </div>

          <div className="absolute -top-1 -right-1">
            <div className="p-2 bg-accent rounded-full animate-bounce">
              <Zap className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold gradient-text">CropGuard AI</h2>
          <p className="text-muted-foreground">{message}</p>
        </div>

        {/* Spinner */}
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Loading advanced AI models...
          </span>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>

      </div>
    </div>
  );
};

