"use client";

import ModeToggle from "@/components/ModeToggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

import { FaGear } from "react-icons/fa6";

type ApplyTimePayload = {
  hour: number;
  minute: number;
  second: number;
};

type TimeOptionProps = {
  value: number;
  onApply?: (payload: ApplyTimePayload) => void;
  disabled?: boolean;
};

export default function TimeOption({
  value,
  onApply,
  disabled,
}: TimeOptionProps) {
  const totalSec = Math.floor((Number(value) || 0) / 1000);
  const initH = Math.floor(totalSec / 3600);
  const initM = Math.floor((totalSec % 3600) / 60);
  const initS = totalSec % 60;

  const [hour, setHour] = useState<string>(String(initH));
  const [minute, setMinute] = useState<string>(String(initM));
  const [second, setSecond] = useState<string>(String(initS));

  useEffect(() => {
    setHour(String(initH));
    setMinute(String(initM));
    setSecond(String(initS));
  }, [value]);

  const clamp = (n: number, min: number, max: number) =>
    Math.min(max, Math.max(min, n));
  const only2Digits = (v: string) => /^\d{0,2}$/.test(v); // 최대 2자리, 빈 문자열 허용
  const onBlurClamp = (v: string, max: number) =>
    String(clamp(Number(v || 0), 0, max));

  const onHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (only2Digits(v)) setHour(v);
  };
  const onMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (only2Digits(v)) setMinute(v);
  };
  const onSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (only2Digits(v)) setSecond(v);
  };

  const handleApply = () => {
    onApply?.({
      hour: Number(hour || 0),
      minute: Number(minute || 0),
      second: Number(second || 0),
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`2xs:text-[1.2rem] text-[0.8rem] text-timer-02-setting-btn ${
            disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer"
          }`}
          disabled={disabled}
        >
          <FaGear />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        sideOffset={10}
        align="end"
        className="max-w-[300px] 4xs:w-full 6xs:w-60 7xs:w-56 w-52 flex flex-col gap-4"
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Time Select</h4>
            <p className="text-muted-foreground text-sm">
              타이머 시간을 설정해주세요.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="hour">hour</Label>
              <Input
                id="hour"
                type="text"
                inputMode="numeric"
                value={hour}
                onChange={onHourChange}
                onBlur={() => setHour(onBlurClamp(hour, 23))}
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="minute">minute</Label>
              <Input
                id="minute"
                type="text"
                inputMode="numeric"
                value={minute}
                onChange={onMinuteChange}
                onBlur={() => setMinute(onBlurClamp(minute, 59))}
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="second">second</Label>
              <Input
                id="second"
                type="text"
                inputMode="numeric"
                value={second}
                onChange={onSecondChange}
                onBlur={() => setSecond(onBlurClamp(second, 59))}
                className="col-span-2 h-8"
              />
            </div>

            <button
              className="mt-2 h-8 rounded bg-black text-white text-sm"
              onClick={handleApply}
            >
              적용하기
            </button>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Time Theme</h4>
            <p className="text-muted-foreground text-sm">
              타이머 테마를 설정해주세요.
            </p>
          </div>
          <div>
            <ModeToggle />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
