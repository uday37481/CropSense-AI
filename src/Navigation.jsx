import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, Camera, BarChart3, Leaf, LogOut, User, MapPin, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const Navigation = ({ onNavigate, currentSection, user, session }) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const menuItems = [
    { id: "home", label: t("navigation.home"), icon: Leaf },
    { id: "analyze", label: t("navigation.detection"), icon: Camera },
    { id: "dashboard", label: t("navigation.dashboard"), icon: BarChart3 },
    { id: "farm-management", label: "Farm Management", icon: MapPin },
    { id: "community", label: "Community", icon: Users },
  ];

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success(t("auth.signOutSuccess"));
      onNavigate("home");
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-6">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">

            <div className="p-2 bg-primary rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold gradient-text">CropSense AI</h1>
              <p className="text-xs text-muted-foreground">
                Advanced Disease Detection
              </p>
            </div>

          </div>

          {/* Desktop Menu */}

          <div className="hidden md:flex items-center gap-2">

            <LanguageSwitcher />

            {menuItems.map((item) => {

              const Icon = item.icon;

              return (
                <Button
                  key={item.id}
                  variant={currentSection === item.id ? "default" : "ghost"}
                  className={currentSection === item.id ? "bg-primary" : ""}
                  onClick={() => onNavigate(item.id)}
                >

                  <Icon className="w-4 h-4 mr-2" />

                  {item.label}

                </Button>
              );
            })}

            {user && (
              <Button variant="ghost" onClick={handleSignOut}>

                <LogOut className="w-4 h-4 mr-2" />

                {t("navigation.signOut")}

              </Button>
            )}

            {!user && (
              <Button onClick={() => onNavigate("auth")} className="bg-primary">

                <User className="w-4 h-4 mr-2" />

                {t("navigation.signIn")}

              </Button>
            )}

          </div>

          {/* Mobile Menu Button */}

          <div className="md:hidden">

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >

              {isMenuOpen
                ? <X className="w-5 h-5" />
                : <Menu className="w-5 h-5" />}

            </Button>

          </div>

        </div>

        {/* Mobile Menu */}

        {isMenuOpen && (

          <div className="md:hidden border-t border-border bg-white/95 backdrop-blur-md">

            <div className="py-4 space-y-2">

              <div className="px-4 mb-2">
                <LanguageSwitcher />
              </div>

              {menuItems.map((item) => {

                const Icon = item.icon;

                return (
                  <Button
                    key={item.id}
                    variant={currentSection === item.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      currentSection === item.id ? "bg-primary" : ""
                    }`}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMenuOpen(false);
                    }}
                  >

                    <Icon className="w-4 h-4 mr-2" />

                    {item.label}

                  </Button>
                );
              })}

              {user && (

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >

                  <LogOut className="w-4 h-4 mr-2" />

                  {t("navigation.signOut")}

                </Button>

              )}

              {!user && (

                <Button
                  className="w-full justify-start bg-primary"
                  onClick={() => {
                    onNavigate("auth");
                    setIsMenuOpen(false);
                  }}
                >

                  <User className="w-4 h-4 mr-2" />

                  {t("navigation.signIn")}

                </Button>

              )}

            </div>

          </div>

        )}

      </div>
    </nav>
  );
};
