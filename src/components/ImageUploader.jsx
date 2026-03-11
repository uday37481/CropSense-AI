import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, Camera, X, ImageIcon, RotateCcw, Check, SwitchCamera, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import plantDetectionBg from "@/assets/plant-detection-bg.jpg";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ImageUploader = ({ onImageUpload, isAnalyzing, progress = 0 }) => {

  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [showGrid, setShowGrid] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {

          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );

            const data = await response.json();

            const locationName =
              data.display_name?.split(",").slice(0, 3).join(",") || "Unknown";

            window.userLocation = {
              latitude,
              longitude,
              name: locationName
            };

          } catch {
            window.userLocation = {
              latitude,
              longitude,
              name: "Unknown"
            };
          }
        },
        () => console.log("Location access denied")
      );
    }
  }, []);

  const handleFile = (file) => {

    if (file && file.type.startsWith("image/")) {

      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be smaller than 10MB.");
        return;
      }

      const url = URL.createObjectURL(file);

      setPreviewUrl(url);

      onImageUpload(file);

    } else {
      toast.error("Please upload a valid image.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);

    if (files.length > 0) handleFile(files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleInputChange = (e) => {

    const files = e.target.files;

    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const resetUploader = () => {

    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const startCamera = async (deviceId) => {

    try {

      const constraints = deviceId
        ? { video: { deviceId: { exact: deviceId } }, audio: false }
        : { video: { facingMode: { ideal: facingMode } }, audio: false };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      const videoTracks = stream.getVideoTracks();

      setCameraStream(stream);
      setShowCamera(true);
      setCapturedImage(null);

      const video = videoRef.current;

      if (video) {
        video.srcObject = new MediaStream([videoTracks[0]]);
        video.muted = true;
        video.playsInline = true;
        await video.play();
      }

      toast.success("Camera activated");

    } catch (error) {

      console.error("Camera error:", error);

      setCameraError("Camera access failed");

      toast.error("Camera permission denied.");
    }
  };

  const stopCamera = () => {

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    setCameraStream(null);
    setShowCamera(false);
    setCapturedImage(null);
  };

  const capturePhoto = () => {

    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.95);

    setCapturedImage(imageDataUrl);

    video.pause();
  };

  const confirmCapture = () => {

    if (!capturedImage) return;

    fetch(capturedImage)
      .then((res) => res.blob())
      .then((blob) => {

        const file = new File(
          [blob],
          `crop-photo-${Date.now()}.jpg`,
          { type: "image/jpeg" }
        );

        handleFile(file);

        stopCamera();

      });
  };

  return (
    <section className="py-16">

      <div className="container mx-auto px-4">

        <Card className="max-w-2xl mx-auto">

          {!previewUrl ? (

            <div
              className={cn(
                "p-12 border-2 border-dashed rounded-lg",
                dragActive && "border-primary bg-primary/5"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />

              <div className="text-center space-y-6">

                <ImageIcon className="w-12 h-12 mx-auto text-primary" />

                <p>{t("imageUploader.dragDrop")}</p>

                <div className="flex justify-center gap-4">

                  <Button onClick={triggerFileSelect}>
                    <Upload className="w-4 h-4 mr-2" />
                    Browse
                  </Button>

                  <Button variant="outline" onClick={() => startCamera()}>
                    <Camera className="w-4 h-4 mr-2" />
                    Camera
                  </Button>

                </div>

              </div>

            </div>

          ) : (

            <div className="space-y-6">

              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />

              <div className="flex justify-center">

                <Button onClick={resetUploader} variant="outline">
                  Upload Another
                </Button>

              </div>

            </div>

          )}

        </Card>

      </div>

    </section>
  );
};
