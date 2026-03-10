import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { generateSocialCard } from "@/utils/socialCardGenerator";

export const SocialCardPreview = ({ config }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generatePreview = async () => {
      setIsLoading(true);

      try {
        const url = await generateSocialCard(config);
        setImageUrl(url);
      } catch (error) {
        console.error("Error generating preview:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generatePreview();
  }, [config]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm capitalize">
          {config.platform} Preview
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full aspect-video" />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={`${config.platform} preview`}
            className="w-full rounded-lg border shadow-sm"
          />
        ) : (
          <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Failed to generate preview</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
