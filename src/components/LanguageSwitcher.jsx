import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

const languages = [
  { code: "en", name: "English", shortCode: "Eng", flag: "🇺🇸" },
  { code: "hi", name: "हिन्दी", shortCode: "Hin", flag: "🇮🇳" },
  { code: "mr", name: "मराठी", shortCode: "Mar", flag: "🇮🇳" },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">
            {currentLanguage.shortCode}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[150px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`flex items-center gap-2 cursor-pointer ${
              i18n.language === language.code ? "bg-accent" : ""
            }`}
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">
              {language.shortCode}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```
