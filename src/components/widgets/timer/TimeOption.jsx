"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

import { FaGear } from "react-icons/fa6";

export default function TimeOption({ value, onApply, disabled }) {
  const totalSec = Math.floor((Number(value) || 0) / 1000);
  const initH = Math.floor(totalSec / 3600);
  const initM = Math.floor((totalSec % 3600) / 60);
  const initS = totalSec % 60;

  const [hour, setHour] = useState(initH);
  const [minute, setMinute] = useState(initM);
  const [second, setSecond] = useState(initS);

  useEffect(() => {
    setHour(initH);
    setMinute(initM);
    setSecond(initS);
  }, [value]);

  const clamp = (n, min, max) => Math.min(max, Math.max(min, isNaN(n) ? 0 : n));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="cursor-pointer">
          <FaGear />
        </button>
      </PopoverTrigger>
      {disabled && (
        <PopoverContent className="w-80">
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
                  type="number"
                  value={hour}
                  onChange={(e) =>
                    setHour(clamp(Number(e.target.value), 0, 23))
                  }
                  min={0}
                  max={23}
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="minute">minute</Label>
                <Input
                  id="minute"
                  type="number"
                  value={minute}
                  onChange={(e) =>
                    setMinute(clamp(Number(e.target.value), 0, 59))
                  }
                  min={0}
                  max={59}
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="second">second</Label>
                <Input
                  id="second"
                  type="number"
                  value={second}
                  onChange={(e) =>
                    setSecond(clamp(Number(e.target.value), 0, 59))
                  }
                  min={0}
                  max={59}
                  className="col-span-2 h-8"
                />
              </div>

              <button
                className="mt-2 h-8 rounded bg-black text-white text-sm"
                onClick={() => onApply && onApply({ hour, minute, second })}
              >
                적용하기
              </button>
            </div>
          </div>
        </PopoverContent>
      )}
      <PopoverContent className="w-80">
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
                type="number"
                value={hour}
                onChange={(e) => setHour(clamp(Number(e.target.value), 0, 23))}
                min={0}
                max={23}
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="minute">minute</Label>
              <Input
                id="minute"
                type="number"
                value={minute}
                onChange={(e) =>
                  setMinute(clamp(Number(e.target.value), 0, 59))
                }
                min={0}
                max={59}
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="second">second</Label>
              <Input
                id="second"
                type="number"
                value={second}
                onChange={(e) =>
                  setSecond(clamp(Number(e.target.value), 0, 59))
                }
                min={0}
                max={59}
                className="col-span-2 h-8"
              />
            </div>

            <button
              className="mt-2 h-8 rounded bg-black text-white text-sm"
              onClick={() => onApply && onApply({ hour, minute, second })}
            >
              적용하기
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
