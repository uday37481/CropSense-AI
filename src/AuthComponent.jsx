import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Leaf, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AuthComponent = ({ onAuthChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: ""
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: formData.displayName || "New User"
          }
        }
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error(
            "This email is already registered. Please sign in instead."
          );
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success(
          "Registration successful! Please check your email to verify your account."
        );
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);

    try {
      await supabase.auth.signOut();

      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error(
            "Invalid email or password. Please check your credentials."
          );
        } else if (error.message.includes("Email not confirmed")) {
          toast.error(
            "Please confirm your email address before signing in."
          );
        } else {
          toast.error(error.message);
        }
      }
    } catch (error) {
      toast.error("Sign in failed. Please try again.");
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event, session) => {
        onAuthChange(session?.user ?? null, session);
      });

    const initializeSession = async () => {
      try {
        const { data: { session }, error } =
          await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          await supabase.auth.signOut();
          onAuthChange(null, null);
        } else {
          onAuthChange(session?.user ?? null, session);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        await supabase.auth.signOut();
        onAuthChange(null, null);
      }
    };

    initializeSession();

    return () => subscription.unsubscribe();
  }, [onAuthChange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-success/5 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-primary rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>

            <h1 className="text-2xl font-bold gradient-text">
              CropSense AI
            </h1>
          </div>

          <p className="text-muted-foreground">
            Advanced AI-powered crop disease detection
          </p>
        </div>

        <Tabs defaultValue="signin" className="space-y-6">

          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* SIGN IN */}

          <TabsContent value="signin" className="space-y-4">

            <div className="space-y-2">
              <Label>Email</Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />

                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) =>
                    handleInputChange("email", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleSignIn}
              className="w-full"
              disabled={isLoading || !formData.email || !formData.password}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

          </TabsContent>

          {/* SIGN UP */}

          <TabsContent value="signup" className="space-y-4">

            <Input
              placeholder="Display Name"
              value={formData.displayName}
              onChange={(e) =>
                handleInputChange("displayName", e.target.value)
              }
            />

            <Input
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                handleInputChange("email", e.target.value)
              }
            />

            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                handleInputChange("password", e.target.value)
              }
            />

            <Input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
            />

            <Button
              onClick={handleSignUp}
              className="w-full"
              disabled={
                isLoading ||
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword
              }
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

          </TabsContent>

        </Tabs>

        <Separator className="my-6" />

        <p className="text-xs text-muted-foreground text-center">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>

      </Card>
    </div>
  );
};
