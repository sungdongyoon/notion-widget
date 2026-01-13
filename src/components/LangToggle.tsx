"use client";

import { Toggle } from "@radix-ui/react-toggle";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const LangToggle = ({ className }: { className: string }) => {
  const t = useTranslations("TimeOption");

  const locale = useLocale();
  const router = useRouter();

  const isEnglish = locale === "en";

  const handleChange = async (value: string) => {
    if (value !== "ko" && value !== "en") return;

    if (value === locale) return;

    // const next = value ? "en" : "ko";

    await axios.post("/api/locale", { locale: value });

    router.refresh();
  };

  return (
    // <Toggle
    //   pressed={isEnglish}
    //   onPressedChange={handlePressChange}
    //   aria-label="Toggle language"
    //   className={className}
    // >
    //   {isEnglish ? "🇺🇸" : "🇰🇷"}
    // </Toggle>
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t("Lang.title")}</SelectLabel>
          <SelectItem value="ko">🇰🇷</SelectItem>
          <SelectItem value="en">🇺🇸</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LangToggle;
