import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import {
  Microscope,
  Leaf,
  Droplets,
  Sun,
  Bug,
  AlertTriangle,
  Shield,
  Clock,
  MapPin
} from "lucide-react";


// Extended disease information database
const diseaseDatabase = {
  "Leaf Blight": {
    scientificName: "Alternaria spp.",
    category: "Fungal Disease",
    description: "A common fungal disease affecting leaves, causing brown spots and eventual leaf death.",
    causes: [
      "High humidity (above 70%)",
      "Poor air circulation",
      "Overhead watering",
      "Stressed plants",
      "Dense plant spacing"
    ],
    symptoms: [
      "Brown or black spots on leaves",
      "Yellow halos around spots",
      "Leaf yellowing and dropping",
      "Reduced plant vigor",
      "Concentric rings in spots (target spot pattern)"
    ],
    lifecycle: "Fungal spores spread through air and water splash. Disease develops rapidly in warm, humid conditions (75-85°F).",
    impact: "Can cause 20-50% yield loss if left untreated.",
    organicTreatments: [
      "Neem oil spray",
      "Baking soda solution",
      "Copper-based fungicides",
      "Compost tea applications"
    ],
    preventionTips: [
      "Ensure proper plant spacing",
      "Water at soil level",
      "Remove affected plant debris",
      "Apply mulch",
      "Choose disease-resistant varieties"
    ]
  },

  "Powdery Mildew": {
    scientificName: "Erysiphe spp.",
    category: "Fungal Disease",
    description: "A widespread fungal disease creating white powdery coating on plant surfaces.",
    causes: [
      "Moderate temperatures",
      "High humidity",
      "Poor air circulation",
      "Overcrowded plantings",
      "Shaded conditions"
    ],
    symptoms: [
      "White powdery coating on leaves",
      "Distorted growth",
      "Yellow spots",
      "Leaf drop",
      "Reduced flowering"
    ],
    lifecycle: "Spreads through airborne spores.",
    impact: "Reduces photosynthesis and weakens plants.",
    organicTreatments: [
      "Milk spray",
      "Potassium bicarbonate",
      "Sulfur fungicides",
      "Horticultural oils"
    ],
    preventionTips: [
      "Plant in sunny locations",
      "Avoid overhead watering",
      "Remove infected leaves",
      "Apply preventive sprays",
      "Choose resistant varieties"
    ]
  }
};


export const LearnMoreDialog = ({ open, onOpenChange, result }) => {

  const getDetailedInfo = (diseaseName) => {

    const normalizedName = diseaseName.toLowerCase();

    for (const [key, value] of Object.entries(diseaseDatabase)) {

      if (
        normalizedName.includes(key.toLowerCase()) ||
        key.toLowerCase().includes(normalizedName)
      ) {
        return { name: key, ...value };
      }

    }

    return {
      name: diseaseName,
      scientificName: "Various species",
      category: "Plant Disease",
      description: "Detailed information not available.",
      causes: ["Various environmental factors"],
      symptoms: ["Visible plant symptoms"],
      lifecycle: "Varies",
      impact: "Can affect plant growth",
      organicTreatments: ["Consult agricultural expert"],
      preventionTips: ["Follow good farming practices"]
    };

  };


  return (

    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="max-w-4xl max-h-[80vh]">

        <DialogHeader>

          <DialogTitle className="flex items-center gap-2">

            <Microscope className="w-5 h-5" />

            Disease Information & Management

          </DialogTitle>

          <DialogDescription>

            Detailed information about detected diseases and treatment recommendations

          </DialogDescription>

        </DialogHeader>


        <ScrollArea className="max-h-[60vh]">

          <div className="space-y-6">

            {result.detectedDiseases.map((disease, index) => {

              const detailedInfo = getDetailedInfo(disease.disease);

              return (

                <Card key={index} className="p-6">

                  <div className="space-y-4">


                    {/* Header */}

                    <div className="flex justify-between">

                      <div>

                        <h3 className="text-xl font-semibold flex items-center gap-2">

                          <Bug className="w-5 h-5 text-destructive" />

                          {detailedInfo.name}

                        </h3>

                        <p className="text-sm italic text-muted-foreground">

                          {detailedInfo.scientificName}

                        </p>

                        <Badge variant="outline">

                          {detailedInfo.category}

                        </Badge>

                      </div>


                      <div className="text-right">

                        <div className="text-sm text-muted-foreground">Confidence</div>

                        <div className="text-lg font-semibold">

                          {Math.round(disease.confidence * 100)}%

                        </div>

                      </div>

                    </div>


                    <p className="text-muted-foreground">

                      {detailedInfo.description}

                    </p>


                    <Tabs defaultValue="overview">

                      <TabsList className="grid grid-cols-4 w-full">

                        <TabsTrigger value="overview">Overview</TabsTrigger>

                        <TabsTrigger value="symptoms">Symptoms</TabsTrigger>

                        <TabsTrigger value="treatment">Treatment</TabsTrigger>

                        <TabsTrigger value="prevention">Prevention</TabsTrigger>

                      </TabsList>


                      <TabsContent value="overview">

                        <Card className="p-4">

                          <h4 className="font-semibold flex items-center gap-2 mb-2">

                            <AlertTriangle className="w-4 h-4 text-warning" />

                            Causes

                          </h4>

                          <ul className="text-sm space-y-1">

                            {detailedInfo.causes.map((cause, idx) => (

                              <li key={idx}>{cause}</li>

                            ))}

                          </ul>

                        </Card>

                      </TabsContent>


                      <TabsContent value="symptoms">

                        <Card className="p-4">

                          <h4 className="font-semibold flex items-center gap-2 mb-2">

                            <Leaf className="w-4 h-4 text-green-500" />

                            Symptoms

                          </h4>

                          <ul className="text-sm space-y-1">

                            {detailedInfo.symptoms.map((symptom, idx) => (

                              <li key={idx}>{symptom}</li>

                            ))}

                          </ul>

                        </Card>

                      </TabsContent>


                      <TabsContent value="treatment">

                        <Card className="p-4">

                          <h4 className="font-semibold flex items-center gap-2 mb-2">

                            <Droplets className="w-4 h-4 text-blue-500" />

                            Treatment

                          </h4>

                          <ul className="text-sm space-y-1">

                            {disease.treatment.map((treatment, idx) => (

                              <li key={idx}>{treatment}</li>

                            ))}

                          </ul>

                        </Card>

                      </TabsContent>


                      <TabsContent value="prevention">

                        <Card className="p-4">

                          <h4 className="font-semibold flex items-center gap-2 mb-2">

                            <Shield className="w-4 h-4 text-green-600" />

                            Prevention

                          </h4>

                          <ul className="text-sm space-y-1">

                            {detailedInfo.preventionTips.map((tip, idx) => (

                              <li key={idx}>{tip}</li>

                            ))}

                          </ul>

                        </Card>

                      </TabsContent>

                    </Tabs>

                  </div>

                </Card>

              );

            })}

          </div>

        </ScrollArea>

      </DialogContent>

    </Dialog>

  );

};
