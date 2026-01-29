"use client";

import LangToggle from "@/components/LangToggle";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

import { FaGear } from "react-icons/fa6";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FieldLabel } from "@/components/ui/field";
import { IoMoon, IoSunny } from "react-icons/io5";

type ApplyTimePayload = {
  hour: number;
  minute: number;
  second: number;
};

type TimeOptionProps = {
  value: {
    time: number;
    label?: string;
    color: string;
  };
  onApply?: (payload: ApplyTimePayload) => void;
  applyColor?: (payload: string) => void;
  applyLabel?: (payload: string) => void;
  disabled?: boolean;
  style?: string;
  activeOption?: ("hour" | "minute" | "second" | "color" | "theme" | "label")[];
};

// 색상 배열
const COLOR_OPTIONS = [
  { id: "default", label: "Default" },
  { id: "brown", label: "Brown" },
  { id: "orange", label: "Orange" },
  { id: "yellow", label: "Yellow" },
  { id: "green", label: "Green" },
  { id: "blue", label: "Blue" },
  { id: "purple", label: "Purple" },
  { id: "pink", label: "Pink" },
  { id: "red", label: "Red" },
] as const;

// label 최대 길이
const LABEL_MAX_LENGTH = 10;

export default function TimeOption({
  value,
  onApply,
  applyColor,
  applyLabel,
  disabled,
  style,
  activeOption,
}: TimeOptionProps) {
  const totalSec = Math.floor((Number(value.time) || 0) / 1000);
  const initH = Math.floor(totalSec / 3600);
  const initM = Math.floor((totalSec % 3600) / 60);
  const initS = totalSec % 60;

  // 테마 변경 함수
  const { theme, setTheme } = useTheme();

  const [time, setTime] = useState<{
    hour: string;
    minute: string;
    second: string;
  }>({
    hour: String(initH),
    minute: String(initM),
    second: String(initS),
  });

  const [open, setOpen] = useState<boolean>(false);
  const [timerLabel, setTimerLabel] = useState<{
    label: string;
    length: number;
  }>({
    label: value.label ?? "",
    length: 0,
  });
  const [overLimit, setOverLimit] = useState<boolean>(false);
  const [optionSection, setOptionSection] = useState<string>("time");

  const t = useTranslations("TimeOption");

  const labelPercent = (timerLabel.length / LABEL_MAX_LENGTH) * 100;

  const clamp = (n: number, min: number, max: number) =>
    Math.min(max, Math.max(min, n));
  const only2Digits = (v: string) => /^\d{0,2}$/.test(v); // 최대 2자리, 빈 문자열 허용
  const onBlurClamp = (v: string, max: number) =>
    String(clamp(Number(v || 0), 0, max));

  const onHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (only2Digits(v)) setTime({ ...time, hour: v });
  };
  const onMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (only2Digits(v)) setTime({ ...time, minute: v });
  };
  const onSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (only2Digits(v)) setTime({ ...time, second: v });
  };

  // 시간, 라벨 저장
  const handleApply = () => {
    onApply?.({
      hour: Number(time.hour || 0),
      minute: Number(time.minute || 0),
      second: Number(time.second || 0),
    });

    applyLabel?.(timerLabel.label);

    setOpen(false);
  };

  // 닫기 함수
  const closeOption = () => {
    const nextLabel = value.label ?? "";

    setTime({
      hour: String(initH),
      minute: String(initM),
      second: String(initS),
    });
    setTimerLabel({ label: nextLabel, length: nextLabel.length });
    setOpen(false);
  };

  // 라벨 입력 함수
  const onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length <= LABEL_MAX_LENGTH) {
      setTimerLabel({
        label: value,
        length: value.length,
      });

      return;
    }

    setOverLimit(true);
    setTimeout(() => {
      setOverLimit(false);
    }, 300);
  };

  // 시간 세팅
  useEffect(() => {
    setTime({
      hour: String(initH),
      minute: String(initM),
      second: String(initS),
    });
  }, [value.time]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={`${style} ${
            disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer"
          }`}
          disabled={disabled}
        >
          <FaGear />
        </button>
      </DialogTrigger>
      <DialogContent
        className="w-[clamp(6rem,90vw,22rem)]
    aspect-square
    overflow-auto
    flex flex-col items-end gap-3
    p-[clamp(0.6rem,3vmin,1rem)]
    scroll-pt-16
    "
        onOpenAutoFocus={(e) => e.preventDefault()}
        showOverlay={false}
        showClose={false}
      >
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Edit Option</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <div className="w-full flex justify-center items-center flex-wrap z-10 relative">
          <Tabs
            onValueChange={(value) => {
              setOptionSection(value);
            }}
            value={optionSection}
          >
            <TabsList className="h-[clamp(1.8rem,9vmin,2.25rem)]">
              {activeOption?.some((opt) =>
                ["hour", "minute", "second"].includes(opt),
              ) && (
                <TabsTrigger
                  value="time"
                  className="text-[clamp(0.6rem,3vmin,0.8rem)]"
                >
                  {t("Tab.time")}
                </TabsTrigger>
              )}
              {activeOption?.includes("theme") && (
                <TabsTrigger
                  value="theme"
                  className="text-[clamp(0.6rem,3vmin,0.8rem)]"
                >
                  {t("Tab.theme")}
                </TabsTrigger>
              )}
              {activeOption?.includes("color") && (
                <TabsTrigger
                  value="color"
                  className="text-[clamp(0.6rem,3vmin,0.8rem)]"
                >
                  {t("Tab.color")}
                </TabsTrigger>
              )}
              <TabsTrigger
                value="info"
                className="text-[clamp(0.6rem,3vmin,0.8rem)]"
              >
                {t("Tab.info")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {optionSection === "time" && (
          <>
            <div className="w-full grid gap-4 scroll-mt-3" id="time">
              <div className="space-y-2">
                <h4 className="leading-none font-medium text-[clamp(0.8rem,3vmin,1rem)]">
                  {t("Time.title")}
                </h4>
                <p className="text-muted-foreground text-[clamp(0.6rem,3vmin,0.8rem)]">
                  {t("Time.desc")}
                </p>
              </div>
              <div className="grid gap-2">
                {activeOption?.includes("hour") && (
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label
                      htmlFor="hour"
                      className="text-[clamp(0.6rem,3vmin,0.8rem)]"
                    >
                      {t("Time.hour")}
                    </Label>
                    <Input
                      id="hour"
                      type="text"
                      inputMode="numeric"
                      value={time.hour}
                      onChange={onHourChange}
                      onBlur={() =>
                        setTime({ ...time, hour: onBlurClamp(time.hour, 23) })
                      }
                      className="col-span-2 h-[clamp(1.5rem,5vmin,2rem)] text-[clamp(0.6rem,3vmin,0.8rem)]"
                    />
                  </div>
                )}
                {activeOption?.includes("minute") && (
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label
                      htmlFor="minute"
                      className="text-[clamp(0.6rem,3vmin,0.8rem)]"
                    >
                      {t("Time.minute")}
                    </Label>
                    <Input
                      id="minute"
                      type="text"
                      inputMode="numeric"
                      value={time.minute}
                      onChange={onMinuteChange}
                      onBlur={() =>
                        setTime({
                          ...time,
                          minute: onBlurClamp(time.minute, 59),
                        })
                      }
                      className="col-span-2 h-[clamp(1.5rem,5vmin,2rem)] text-[clamp(0.6rem,3vmin,0.8rem)]"
                    />
                  </div>
                )}
                {activeOption?.includes("second") && (
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label
                      htmlFor="second"
                      className="text-[clamp(0.6rem,3vmin,0.8rem)]"
                    >
                      {t("Time.second")}
                    </Label>
                    <Input
                      id="second"
                      type="text"
                      inputMode="numeric"
                      value={time.second}
                      onChange={onSecondChange}
                      onBlur={() =>
                        setTime({
                          ...time,
                          second: onBlurClamp(time.second, 59),
                        })
                      }
                      className="col-span-2 h-[clamp(1.5rem,5vmin,2rem)] text-[clamp(0.6rem,3vmin,0.8rem)]"
                    />
                  </div>
                )}
              </div>
            </div>
            {activeOption?.includes("label") && (
              <div className="w-full grid gap-4 mt-7" id="label">
                <div className="space-y-2">
                  <h4 className="leading-none font-medium text-[clamp(0.8rem,3vmin,1rem)]">
                    {t("Label.title")}
                  </h4>
                  <p className="text-muted-foreground text-[clamp(0.6rem,3vmin,0.8rem)]">
                    {t("Label.desc")}
                  </p>
                </div>
                <div>
                  <Input
                    id="timer-label"
                    type="text"
                    placeholder="예) study 📝"
                    value={timerLabel.label}
                    onChange={onLabelChange}
                    className={`col-span-2 h-[clamp(1.5rem,5vmin,2rem)] text-[clamp(0.6rem,3vmin,0.8rem)] ${
                      overLimit ? "timer_label_input border-red-500" : ""
                    }`}
                  />
                  <div className="relative w-full h-1 bg-gray-200 rounded mt-2">
                    <div
                      className="absolute top-0 left-0 h-full rounded bg-blue-500 transition-all"
                      style={{ width: `${labelPercent}%` }}
                    />
                  </div>
                  <p className="text-[clamp(0.6rem,3vmin,0.8rem)] text-gray-500 mt-1 text-left">
                    {timerLabel.length} / {LABEL_MAX_LENGTH}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {activeOption?.includes("theme") && optionSection === "theme" && (
          <div className="w-full grid gap-4" id="theme">
            <div className="space-y-2">
              <h4 className="leading-none font-medium text-[clamp(0.8rem,3vmin,1rem)]">
                {t("Theme.title")}
              </h4>
              <p className="text-muted-foreground text-[clamp(0.6rem,3vmin,0.8rem)]">
                {t("Theme.desc")}
              </p>
            </div>
            <RadioGroup
              className="grid grid-cols-3"
              value={theme}
              onValueChange={(e) => setTheme(e)}
            >
              <div>
                <RadioGroupItem
                  id="light"
                  value="light"
                  className="peer sr-only"
                />
                <FieldLabel
                  htmlFor="light"
                  className="w-full flex flex-col items-center rounded-md py-2 cursor-pointer border border-solid border-primary opacity-20 peer-data-[state=checked]:opacity-100 hover:scale-105 transition-all"
                >
                  <IoSunny className="text-[clamp(1rem,5vmin,2rem)]" />
                  <span className="text-[clamp(0.5rem,5vmin,0.8rem)]">
                    {t("Theme.light")}
                  </span>
                </FieldLabel>
              </div>
              <div>
                <RadioGroupItem
                  id="dark"
                  value="dark"
                  className="peer sr-only"
                />
                <FieldLabel
                  htmlFor="dark"
                  className="w-full flex flex-col items-center rounded-md py-2 cursor-pointer border border-solid border-primary opacity-20 peer-data-[state=checked]:opacity-100 hover:scale-105 transition-all"
                >
                  <IoMoon className="text-[clamp(1rem,5vmin,2rem)]" />
                  <span className="text-[clamp(0.5rem,5vmin,0.8rem)]">
                    {t("Theme.dark")}
                  </span>
                </FieldLabel>
              </div>
            </RadioGroup>
          </div>
        )}

        {activeOption?.includes("color") && optionSection === "color" && (
          <div className="w-full grid gap-4" id="color">
            <div className="space-y-2">
              <h4 className="leading-none font-medium text-[clamp(0.8rem,3vmin,1rem)]">
                {t("Color.title")}
              </h4>
              <p className="text-muted-foreground text-[clamp(0.6rem,3vmin,0.8rem)]">
                {t("Color.desc")}
              </p>
            </div>
            {/* <div className="grid gap-2 grid-cols-3">
              {COLOR_OPTIONS.map(({ id, label }) => {
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => applyColor?.(id)}
                    className="relative aspect-square border rounded-lg hover:scale-105 transition-all"
                  >
                    <Image
                      src={`/image/timer/color/${theme}-${id}.png`}
                      fill
                      alt={`${label} 아이콘`}
                      className="rounded-lg"
                    />
                  </button>
                );
              })}
            </div> */}

            <RadioGroup className="grid grid-cols-3" value={value.color}>
              {COLOR_OPTIONS.map(({ id, label }) => {
                return (
                  <div key={id}>
                    <RadioGroupItem
                      id={id}
                      value={id}
                      className="peer sr-only"
                      onClick={() => applyColor?.(id)}
                    />
                    <FieldLabel
                      htmlFor={id}
                      className="relative w-full flex items-center rounded-md py-2 cursor-pointer aspect-square border border-solid border-notion-gray-text opacity-30 peer-data-[state=checked]:opacity-100 hover:scale-105 transition-all"
                    >
                      <Image
                        src={`/image/timer/color/${theme}-${id}.png`}
                        fill
                        alt={`${label} 아이콘`}
                        className="rounded-lg"
                      />
                    </FieldLabel>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        )}

        {optionSection === "info" && (
          <>
            <div className="w-full grid gap-4" id="lang">
              <div className="space-y-2">
                <h4 className="leading-none font-medium text-[clamp(0.8rem,3vmin,1rem)]">
                  {t("Info.Lang.title")}
                </h4>
                <LangToggle className="text-[clamp(0.6rem,3vmin,1rem)] w-[40px] h-7 bg-notion-default-bg rounded-none rounded-tl-md rounded-br-md py-1 px-2 2xs:w-[60px] 2xs:h-9 2xs:py-2 2xs:px-3" />
              </div>
            </div>

            <div className="w-full grid gap-4 mt-7" id="copyright">
              <div className="space-y-2">
                <h4 className="leading-none font-medium text-[clamp(0.8rem,3vmin,1rem)]">
                  {t("Info.Copyright.title")}
                </h4>
                <p className="text-muted-foreground text-[clamp(0.6rem,3vmin,0.8rem)]">
                  © 2026 Created by Mober & Dong
                </p>
              </div>
            </div>
          </>
        )}

        <div
          className={`w-full flex justify-end gap-1 ${optionSection === "time" || optionSection === "color" ? "sticky bottom-0" : "fixed bottom-[clamp(0.6rem,3vmin,1rem)]"} z-50`}
        >
          {optionSection === "time" && (
            <Button
              size="sm"
              variant="default"
              className="min-w-[50px] w-full max-w-[15%] bg-notion-blue-text text-[clamp(0.6rem,3vmin,0.8rem)] h-[clamp(1.5rem,6vmin,2rem)] hover:bg-notion-blue-text/80"
              onClick={handleApply}
            >
              {t("Save")}
            </Button>
          )}
          <Button
            size="sm"
            variant="default"
            className="min-w-[50px] w-full max-w-[15%] bg-notion-red-text text-[clamp(0.6rem,3vmin,0.8rem)] h-[clamp(1.5rem,6vmin,2rem)] hover:bg-notion-red-text/80"
            onClick={closeOption}
          >
            {t("Close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
