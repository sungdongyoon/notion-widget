"use client";

import React, { useEffect, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { FaPauseCircle } from "react-icons/fa";
import TimeOption from "./TimeOption";

const DEFAULT_INITIAL = 60 * 1000; // 초기 시간
const INTERVAL = 100; // INTERVAL초 마다 시간 줄어듦

const Timer02 = () => {
  const [initialTime, setInitialTime] = useState(DEFAULT_INITIAL);
  // 시간
  const [time, setTime] = useState(DEFAULT_INITIAL);
  // 타이머 진행 여부
  const [running, setRunning] = useState(false);

  // 시, 분, 초
  const hour = String(Math.floor(time / (1000 * 60 * 60))).padStart(2, "0");
  const minute = String(Math.floor((time / (1000 * 60)) % 60)).padStart(2, "0");
  const second = String(Math.floor((time / 1000) % 60)).padStart(2, "0");

  // 남은 시간 비율
  const remainTimePercent = initialTime ? (time / initialTime) * 100 : 0;

  // INTERVAL 초 마다 시간 줄어들게 하는 이펙트
  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
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
  const startTime = () => {
    if (time <= 0) return;
    setRunning(true);
  };

  // 타이머 일시정지 함수
  const pauseTime = () => {
    setRunning(false);
  };

  const applyTime = ({ hour, minute, second }) => {
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
      <div className="bg-timer-02-bg relative max-w-[500px] min-w-[240px] w-full aspect-[1/1.1] flex flex-col items-center justify-between rounded-3xl 2xs:p-6 p-8">
        <div className="absolute top-4 2xs:top-6 right-4 2xs:right-6">
          <TimeOption value={time} onApply={applyTime} disabled={running} />
        </div>
        <div className="w-full flex-[2] flex justify-center items-center">
          <div
            className="timer_clock"
            style={{
              ["--remain"]: `${Math.max(0, Math.min(100, remainTimePercent))}%`,
            }}
          ></div>
        </div>
        <div className="w-full flex-1 flex justify-center items-center">
          <div className="bg-timer-02-timer-bg 2xs:max-w-[70%] max-w-[85%] w-full flex items-center justify-between 2xs:py-4 3xs:py-3 7xs:py-2 2xs:px-8 3xs:px-7 7xs:px-4 py-2 px-4 rounded-xl shadow-xl">
            <div className="timer_time">
              <p className="text-timer-02-timer-text 2xs:text-[1.5rem] 5xs:text-[1.2rem] 6xs:text-[1rem] 7xs:text-[0.8rem] text-[0.8rem]">
                <span>{hour}</span>:<span>{minute}</span>:<span>{second}</span>
              </p>
            </div>
            <div className="timer_btn flex 5xs:gap-4 gap-2 items-center">
              <button
                onClick={startTime}
                aria-label="시작"
                disabled={running}
                className="inline-flex items-center justify-center 2xs:text-[2rem] 6xs:text-[1.2rem] 7xs:text-[1rem] text-[0.8rem] text-timer-02-timer-text disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                <FaPlayCircle aria-hidden="true" />
              </button>
              <button
                onClick={pauseTime}
                aria-label="시작"
                disabled={!running}
                className="inline-flex items-center justify-center 2xs:text-[2rem] 6xs:text-[1.2rem] 7xs:text-[1rem] text-[0.8rem] text-timer-02-timer-text disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                <FaPauseCircle aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer02;
