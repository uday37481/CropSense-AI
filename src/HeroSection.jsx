import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Zap,
  BarChart3,
  Brain,
  Shield,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Leaf,
  Users,
  Globe,
  Share2,
  Award,
  MessageSquare,
  Tractor
} from "lucide-react";

import heroImage from "@/assets/hero-agriculture.jpg";
import { useTranslation } from "react-i18next";

export const HeroSection = ({ onGetStarted, onLearnMore }) => {

  const { t } = useTranslation();

  return (
    <>
      {/* Hero Section */}

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Advanced crop disease detection with AI technology"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-success/80" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left Content */}

            <div className="text-white space-y-8">

              <Badge className="bg-success/20 text-success border-success/30 backdrop-blur-md px-4 py-2 text-sm font-semibold">
                <Brain className="w-4 h-4 mr-2" />
                AI-Powered Precision Agriculture
              </Badge>

              <div className="space-y-4">

                <h1 className="text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                  {t("hero.title")}
                </h1>

                <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-xl">
                  {t("hero.description")}
                </p>

              </div>

              {/* Buttons */}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">

                <Button
                  size="lg"
                  onClick={onGetStarted}
                  className="bg-success hover:bg-success/90 text-white px-8 py-6 text-lg font-semibold"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  {t("hero.getStarted")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={onLearnMore}
                  className="border-2 border-white/80 bg-white/10 text-white hover:bg-white hover:text-primary px-8 py-6 text-lg font-semibold"
                >
                  {t("hero.learnMore")}
                </Button>

              </div>

              {/* Stats */}

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">

                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">99.2%</div>
                  <div className="text-sm text-white/80 font-medium">
                    {t("hero.stats.accuracy")}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">50+</div>
                  <div className="text-sm text-white/80 font-medium">
                    {t("hero.stats.diseases")}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">24/7</div>
                  <div className="text-sm text-white/80 font-medium">
                    {t("hero.stats.analysis")}
                  </div>
                </div>

              </div>

            </div>

            {/* Right Cards */}

            <div className="space-y-6">

              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <div className="flex items-start gap-4">
                  <Zap className="w-7 h-7 text-accent" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {t("hero.features.detection.title")}
                    </h3>
                    <p className="text-white/80">
                      {t("hero.features.detection.description")}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <div className="flex items-start gap-4">
                  <BarChart3 className="w-7 h-7 text-success" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {t("hero.features.analytics.title")}
                    </h3>
                    <p className="text-white/80">
                      {t("hero.features.analytics.description")}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <div className="flex items-start gap-4">
                  <Brain className="w-7 h-7 text-warning" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {t("hero.features.recommendations.title")}
                    </h3>
                    <p className="text-white/80">
                      {t("hero.features.recommendations.description")}
                    </p>
                  </div>
                </div>
              </Card>

            </div>

          </div>

        </div>

      </section>
    </>
  );
};
