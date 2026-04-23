"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useTranslations } from "next-intl";
import { loadState, saveState } from "@/utils/storage";
import { PersistState } from "@/components/widgets/timer/types";

const TimeFormatSelect = ({
  className,
  widgetType,
}: {
  className?: string;
  widgetType: string;
}) => {
  const t = useTranslations("TimeOption");
  const [value, setValue] = useState<"hourFormat" | "minuteFormat">(
    "hourFormat",
  );

  const storageKey = useMemo(() => widgetType, [widgetType]);

  const upsertTimeFormat = (next: "hourFormat" | "minuteFormat") => {
    const current = loadState<PersistState>(storageKey);
    if (!current) return;
    saveState(storageKey, { ...current, timeFormat: next });
  };

  useEffect(() => {
    const state = loadState<PersistState>(storageKey);
    setValue(state?.timeFormat ?? "hourFormat");
  }, [storageKey]);

  return (
    <Select
      value={value}
      onValueChange={(v) => {
        const next = v as "hourFormat" | "minuteFormat";
        setValue(next);
        upsertTimeFormat(next);
      }}
    >
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t("Info.TimeFormat.select")}</SelectLabel>
          <SelectItem value="hourFormat">
            {t("Info.TimeFormat.hourOption")}
          </SelectItem>
          <SelectItem value="minuteFormat">
            {t("Info.TimeFormat.minuteOption")}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TimeFormatSelect;
