"use client";

import React, { useEffect, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import TimeOption from "./TimeOption";
import { LuTimerReset } from "react-icons/lu";
import { FaRegPlayCircle, FaRegPauseCircle } from "react-icons/fa";

// ===== 타입 =====
type ApplyTimeProps = {
  hour: number;
  minute: number;
  second: number;
};

// type TimeOptionProps = {
//   value: number;
//   onApply: (time: number) => void;
//   disabled: boolean;
// };

const DEFAULT_INITIAL = 60 * 1000; // 초기 시간
const INTERVAL = 10; // INTERVAL 밀리초 마다 시간 줄어듦

const Timer02 = () => {
  // 초기값
  const [initialTime, setInitialTime] = useState<number>(DEFAULT_INITIAL);
  // 시간
  const [time, setTime] = useState<number>(DEFAULT_INITIAL);
  // 타이머 진행 여부
  const [running, setRunning] = useState<boolean>(false);

  const isFinished = time <= 0; // 종료 여부
  const isInitial = !running && time === initialTime; // 초기 상태 판별
  const showSetup = !running && isInitial; // 초기 ui(재생, 설정, 시간) 노출 여부
  const showInProgressUI =
    running || (!running && time < initialTime && time > 0); // 진행 ui 노출 여부

  // 시, 분, 초
  const hour = String(Math.floor(time / (1000 * 60 * 60))).padStart(2, "0");
  const minute = String(Math.floor((time / (1000 * 60)) % 60)).padStart(2, "0");
  const second = String(Math.floor((time / 1000) % 60)).padStart(2, "0");

  // 남은 시간 비율
  const remainTimePercent = initialTime ? (time / initialTime) * 100 : 0;

  // INTERVAL 초 마다 시간 줄어들게 하는 이펙트
  useEffect(() => {
    if (!running) return;

    const timer: number = window.setInterval(() => {
      setTime((prev) => {
        const next = prev - INTERVAL;

        if (next <= 0) {
          setRunning(false);
          return initialTime;
        }

        return next;
      });
    }, INTERVAL);

    return () => {
      clearInterval(timer);
    };
  }, [running, initialTime]);

  // 타이머 시작 함수
  const startTime = (): void => {
    if (time <= 0) return;
    setRunning(true);
  };

  // 타이머 일시정지 함수
  const pauseTime = (): void => {
    setRunning(false);
  };

  // 타이머 리셋 함수
  const resetTime = (): void => {
    setRunning(false);
    setInitialTime(DEFAULT_INITIAL);
    setTime(DEFAULT_INITIAL);
  };

  const applyTime = ({ hour, minute, second }: ApplyTimeProps): void => {
    const h = Number(hour) || 0;
    const m = Number(minute) || 0;
    const s = Number(second) || 0;
    const ms = (h * 3600 + m * 60 + s) * 1000;
    setRunning(false);
    setInitialTime(ms);
    setTime(ms);
  };

  return (
    <div className="widget_container" data-variant="timer02">
      <div className="bg-timer-02-bg relative max-w-[500px] min-w-[240px] w-full aspect-[1/1] flex flex-col items-center justify-between rounded-[50%]">
        <div className="w-full flex-[2] flex justify-center items-center relative">
          {showInProgressUI && (
            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 text-[clamp(0.6rem,5vmin,1rem)] text-white">
              <span>{hour}</span>:<span>{minute}</span>:<span>{second}</span>
            </div>
          )}

          {showInProgressUI && (
            <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 flex gap-3">
              <button
                onClick={!running ? startTime : pauseTime}
                aria-label={!running ? "시작" : "일시정지"}
                className="inline-flex items-center justify-center text-[clamp(0.6rem,5vmin,1.5rem)] text-white"
              >
                {!running ? (
                  <FaRegPlayCircle aria-hidden="true" />
                ) : (
                  <FaRegPauseCircle aria-hidden="true" />
                )}
              </button>
              <button
                className="inline-flex items-center justify-center text-[clamp(0.6rem,5vmin,1.5rem)] text-white"
                onClick={resetTime}
              >
                <LuTimerReset aria-hidden="true" />
              </button>
            </div>
          )}

          <div
            className="timer_clock"
            style={{
              ["--remain" as string]: `${Math.max(
                0,
                Math.min(100, remainTimePercent)
              )}%`,
            }}
          >
            {showSetup && (
              <div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <button
                    onClick={startTime}
                    aria-label="시작"
                    disabled={running}
                    className=" inline-flex items-center justify-center text-[clamp(3rem,30cqi,10rem)] text-timer-02-timer-text text-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    <FaPlayCircle aria-hidden="true" />
                  </button>
                  <p className="text-timer-02-timer-text 2xs:text-[1.5rem] 5xs:text-[1.2rem] 6xs:text-[1rem] 7xs:text-[0.8rem] text-[0.8rem]">
                    <span>{hour}</span>:<span>{minute}</span>:
                    <span>{second}</span>
                  </p>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <TimeOption
                    value={time}
                    onApply={applyTime}
                    disabled={running}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer02;
