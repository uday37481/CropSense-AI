import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { reportTemplates } from "@/utils/templateManager";
import { FileText, FileBarChart, Award, GitCompare } from "lucide-react";

const templateIcons = {
  executive: FileText,
  detailed: FileBarChart,
  certificate: Award,
  comparative: GitCompare,
};

export const ReportTemplateSelector = ({ selectedTemplate, onTemplateChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose Report Template</h3>

      <RadioGroup value={selectedTemplate} onValueChange={onTemplateChange}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {reportTemplates.map((template) => {

            const Icon = templateIcons[template.layout];

            return (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? "ring-2 ring-primary"
                    : "hover:shadow-md"
                }`}
                onClick={() => onTemplateChange(template.id)}
              >

                <CardHeader>

                  <div className="flex items-center gap-3">

                    <RadioGroupItem value={template.id} id={template.id} />

                    <Icon
                      className="w-5 h-5"
                      style={{ color: template.colorScheme.primary }}
                    />

                    <Label htmlFor={template.id} className="cursor-pointer flex-1">
                      <CardTitle className="text-base">
                        {template.name}
                      </CardTitle>
                    </Label>

                  </div>

                </CardHeader>

                <CardContent>

                  <CardDescription>
                    {template.description}
                  </CardDescription>

                  <div className="flex gap-2 mt-3">

                    {Object.entries(template.colorScheme)
                      .slice(0, 3)
                      .map(([key, color]) => (

                        <div
                          key={key}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                          title={key}
                        />

                      ))}

                  </div>

                </CardContent>

              </Card>
            );

          })}

        </div>
      </RadioGroup>
    </div>
  );
};
