import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  UserCheck,
  Clock,
  AlertTriangle,
  Send,
  Upload,
  CheckCircle,
  MessageSquare
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { mockRegionalData } from "@/data/mockRegionalData";

export const ExpertConsultation = () => {

  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  const [formData, setFormData] = useState({
    query: "",
    cropType: "",
    location: "",
    urgency: "medium",
    images: []
  });

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) return;

      const { data, error } = await supabase
        .from("expert_consultations")
        .select("*")
        .eq("user_id", session.session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setConsultations(data || []);
    } catch (error) {
      console.error("Error loading consultations:", error);
      toast.error("Failed to load consultations");
    }
  };

  const handleSubmitConsultation = async () => {

    if (!formData.query.trim()) {
      toast.error("Please describe your crop issue");
      return;
    }

    setIsLoading(true);

    try {

      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        toast.error("Please sign in first");
        return;
      }

      const imageUrls = [];

      for (const file of formData.images) {

        const fileName = `consultation-${session.session.user.id}-${Date.now()}-${file.name}`;

        try {
          const { error: uploadError } = await supabase.storage
            .from("crop-images")
            .upload(fileName, file);

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from("crop-images")
              .getPublicUrl(fileName);

            imageUrls.push(urlData.publicUrl);
          }

        } catch (uploadErr) {
          console.log("Storage upload failed");
        }
      }

      const { data: consultation, error } = await supabase
        .from("expert_consultations")
        .insert({
          user_id: session.session.user.id,
          query: formData.query,
          crop_type: formData.cropType || "Unknown",
          location: formData.location,
          urgency: formData.urgency,
          images: imageUrls,
          status: "pending"
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Consultation submitted! AI Expert is analyzing your case...");

      try {

        const { error: aiError } = await supabase.functions.invoke(
          "process-consultation",
          {
            body: {
              consultationId: consultation.id,
              query: formData.query,
              cropType: formData.cropType || "Unknown",
              location: formData.location,
              urgency: formData.urgency,
              images: imageUrls
            }
          }
        );

        if (aiError) {
          toast.error("AI processing failed. Manual expert review will be conducted.");
        } else {
          toast.success("🤖 AI Expert analyzed your case!");
        }

      } catch (err) {
        toast.info("Consultation submitted for manual expert review.");
      }

      setShowNewForm(false);

      setFormData({
        query: "",
        cropType: "",
        location: "",
        urgency: "medium",
        images: []
      });

      setTimeout(() => {
        loadConsultations();
      }, 2000);

    } catch (error) {

      console.error("Error submitting consultation:", error);
      toast.error("Failed to submit consultation");

    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "in_progress":
        return "bg-accent/10 text-accent border-accent/20";
      case "completed":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "low":
        return "bg-success/10 text-success border-success/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const regionConsultations =
    mockRegionalData["Nashik"].expertConsultation.sessions;

  console.log("Consultation sessions in Nashik:", regionConsultations);

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Expert Consultation</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get professional advice from agricultural experts for complex crop issues
          </p>
        </div>

        {/* Remaining JSX UI stays exactly the same */}

      </div>
    </section>
  );
};
