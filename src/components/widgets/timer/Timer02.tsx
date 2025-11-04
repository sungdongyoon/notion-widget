"use client";

import React, { useEffect, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import TimeOption from "./TimeOption";
import BreakPointView from "@/components/BreakPointView";

// ===== 타입 =====
type ApplyTimeProps = {
  hour: number;
  minute: number;
  second: number;
};

type PersistState =
  | {
      mode: "running";
      deadline: number;
      remainMs?: number;
      initialMs: number;
    }
  | {
      mode: "paused";
      remainMs: number;
      initialMs: number;
    }
  | {
      mode: "stopped";
      remainMs: number;
      initialMs: number;
    };

const DEFAULT_INITIAL = 60 * 1000; // 초기 시간
const INTERVAL = 10; // INTERVAL 밀리초 마다 시간 줄어듦
const STORAGE_KEY = "timer02_state"; // 로컬 스토리지 키 값

const Timer02 = () => {
  // 초기값
  const [initialTime, setInitialTime] = useState<number>(DEFAULT_INITIAL);
  // 시간
  const [time, setTime] = useState<number>(DEFAULT_INITIAL);
  // 타이머 진행 여부
  const [running, setRunning] = useState<boolean>(false);

  const isFinished = time === 0; // 종료 여부
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

  // 로컬 스토리지 상태 저장
  const saveState = (state: PersistState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  };

  // 로컬 스토리지 상태 불러오기
  const loadState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  // 타이머 시작 함수
  const startTime = (): void => {
    if (time <= 0) return;
    setRunning(true);

    const deadline = Date.now() + time;
    saveState({
      mode: "running",
      deadline,
      remainMs: initialTime,
      initialMs: initialTime,
    });
  };

  // 타이머 일시정지 함수
  const pauseTime = (): void => {
    setRunning(false);
    saveState({ mode: "paused", remainMs: time, initialMs: initialTime });
  };

  // 타이머 리셋 함수
  const resetTime = (): void => {
    const state = loadState();
    setRunning(false);
    setInitialTime(state.initialMs);
    setTime(state.initialMs);
    saveState({
      mode: "stopped",
      remainMs: state.initialMs,
      initialMs: state.initialMs,
    });
  };

  // 시간 적용
  const applyTime = ({ hour, minute, second }: ApplyTimeProps): void => {
    const h = Number(hour) || 0;
    const m = Number(minute) || 0;
    const s = Number(second) || 0;
    const ms = (h * 3600 + m * 60 + s) * 1000;
    setRunning(false);
    setInitialTime(ms);
    setTime(ms);
    saveState({ mode: "stopped", remainMs: ms, initialMs: ms });
  };

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

  // 마운트 시 복원
  useEffect(() => {
    const state = loadState();

    if (!state) return;

    const remain = Math.max(0, state.deadline - Date.now());

    if (state.mode === "running") {
      setInitialTime(state.initialMs);
      setTime(state.initialMs);
      setRunning(remain > 0);

      if (remain === 0) {
        saveState({
          mode: "stopped",
          remainMs: state.initialMs,
          initialMs: state.initialMs,
        });
      }
    } else {
      setInitialTime(state.initialMs);
      setTime(state.remainMs);
      setRunning(false);
    }

    if (time <= 10) {
      saveState({
        mode: "stopped",
        remainMs: state.initialMs,
        initialMs: state.initialMs,
      });
    }
  }, []);

  return (
    <div className="widget_container" data-variant="timer02">
      <div className="bg-timer-02-bg relative max-w-[500px] min-w-[150px] w-full aspect-[1/1] flex flex-col items-center justify-between rounded-[50%]">
        <div className="w-full flex-[2] flex justify-center items-center relative">
          <div
            className="timer_clock"
            style={{
              ["--remain" as string]: `${Math.max(
                0,
                Math.min(100, remainTimePercent)
              )}%`,
            }}
          >
            {showInProgressUI && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-timer-02-bg border-[10px] border-solid border-timer-02-clock-bg w-[40%] min-w-[100px] aspect-square flex flex-col gap-2 justify-center items-center p-5">
                <div className="text-[clamp(0.9rem,4vmin,1.5rem)] text-timer-02-ring-text font-bold">
                  <span>{minute}</span>:<span>{second}</span>
                </div>
                <div className="w-full flex">
                  <button
                    onClick={!running ? startTime : pauseTime}
                    aria-label={!running ? "시작" : "일시정지"}
                    className="inline-flex items-center justify-center text-[clamp(0.47rem,2.5vmin,0.8rem)] text-timer-02-ring-text flex-1 font-medium"
                  >
                    {!running ? "play" : "pause"}
                  </button>
                  <button
                    className="inline-flex items-center justify-center text-[clamp(0.47rem,2.5vmin,0.8rem)] text-timer-02-ring-text flex-1 font-medium"
                    onClick={resetTime}
                  >
                    reset
                  </button>
                </div>
              </div>
            )}

            {showSetup && (
              <>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                  <button
                    onClick={startTime}
                    aria-label="시작"
                    disabled={running}
                    className="inline-flex items-center justify-center text-[clamp(2.5rem,30cqi,10rem)] text-timer-02-timer-text text-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    <FaPlayCircle aria-hidden="true" />
                  </button>
                  <p className="text-timer-02-timer-text text-[clamp(0.8rem,6vmin,2rem)] font-bold">
                    <span>{minute}</span>:<span>{second}</span>
                  </p>
                </div>
                <div className="absolute bottom-[0] left-1/2 -translate-x-1/2">
                  <TimeOption
                    value={time}
                    onApply={applyTime}
                    disabled={running}
                    style="text-[clamp(0.6rem,5vmin,1.2rem)] text-timer-02-setting-btn"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer02;
