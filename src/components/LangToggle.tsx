"use client";

import { Toggle } from "@radix-ui/react-toggle";
import axios from "axios";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import React from "react";

const LangToggle = () => {
  const locale = useLocale();
  const router = useRouter();

  const isEnglish = locale === "en";

  const handlePressChange = async (pressed: boolean) => {
    const next = pressed ? "en" : "ko";

    await axios.post("/api/locale", { locale: next });

    router.refresh();
  };

  return (
    <Toggle
      pressed={isEnglish}
      onPressedChange={handlePressChange}
      aria-label="Toggle language"
    >
      {isEnglish ? "영" : "한"}
    </Toggle>
  );
};

export default LangToggle;
