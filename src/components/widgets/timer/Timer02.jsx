"use client";

import React, { useEffect, useState } from "react";
import { FaGear } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import { FaPauseCircle } from "react-icons/fa";

const INITIAL_TIME = 60 * 1000; // 초기 시간
const INTERVAL = 1000; // INTERVAL초 마다 시간 줄어듦

const Timer02 = () => {
  // 시간
  const [time, setTime] = useState(INITIAL_TIME);
  // 타이머 진행 여부
  const [running, setRunning] = useState(false);

  // 시, 분, 초
  const hour = String(Math.floor(time / (1000 * 60 * 60))).padStart(2, "0");
  const minutes = String(Math.floor((time / (1000 * 60)) % 60)).padStart(
    2,
    "0"
  );
  const second = String(Math.floor((time / 1000) % 60)).padStart(2, "0");

  // 남은 시간 비율
  const remainTimePercent = (time / INITIAL_TIME) * 100;

  // INTERVAL 초 마다 시간 줄어들게 하는 이펙트
  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        const next = prev - INTERVAL;

        if (next <= 0) {
          setRunning(false);
          return INITIAL_TIME;
        }

        return next;
      });
    }, INTERVAL);

    return () => {
      clearInterval(timer);
    };
  }, [running]);

  // 타이머 시작 함수
  const startTime = () => {
    if (time <= 0) return;
    setRunning(true);
  };

  // 타이머 일시정지 함수
  const pauseTime = () => {
    setRunning(false);
  };

  return (
    <div className="widget_container" data-variant="timer02">
      <div className="bg-white relative max-w-full h-full aspect-[1/1.1] flex flex-col items-center justify-between rounded-3xl shadow-2xl p-8">
        <div className="absolute top-8 right-8">
          <FaGear />
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
          <div className="bg-black max-w-[70%] w-full flex items-center justify-between py-4 px-8 rounded-xl shadow-xl">
            <div className="timer_time">
              <p className="text-white text-[1.5rem]">
                <span>{hour}</span>:<span>{minutes}</span>:<span>{second}</span>
              </p>
            </div>
            <div className="timer_btn flex gap-4 items-center">
              <FaPlayCircle
                className="text-[2rem] text-white"
                onClick={startTime}
              />
              <FaPauseCircle
                className="text-[2rem] text-white"
                onClick={pauseTime}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer02;
