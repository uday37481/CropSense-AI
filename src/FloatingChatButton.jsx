import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Brain, MessageCircle } from "lucide-react";
import { AIAssistant } from "./AIAssistant";
import { cn } from "@/lib/utils";

export const FloatingChatButton = ({ cropData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);

  // Show notification badge after 5 seconds if chat hasn't been opened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasNotification(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Hide notification when chat is opened
  useEffect(() => {
    if (isOpen) {
      setHasNotification(false);
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40">
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
              "w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105",
              "flex items-center justify-center relative overflow-hidden"
            )}
            size="lg"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-100 transition-opacity duration-300" />

            {/* Icon */}
            <div className="relative z-10 transition-transform duration-300">
              {isHovered ? (
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
              ) : (
                <Brain className="w-5 h-5 md:w-6 md:h-6" />
              )}
            </div>

            {/* Pulse animation */}
            {!isHovered && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent animate-ping opacity-20" />
            )}
          </Button>

          {/* Notification Badge */}
          {hasNotification && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          )}

          {/* Tooltip */}
          {isHovered && (
            <div className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-100 transition-opacity duration-200 shadow-lg">
              Chat with AgriBot
              <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        cropData={cropData}
      />
    </>
  );
};
