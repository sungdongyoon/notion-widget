"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay, FaRedo } from "react-icons/fa";
import TimeOption from "./TimeOption";

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
      color?: string;
      label?: string;
    }
  | {
      mode: "paused";
      remainMs: number;
      initialMs: number;
      color?: string;
      label?: string;
    }
  | {
      mode: "stopped";
      remainMs: number;
      initialMs: number;
      color?: string;
      label?: string;
    };

const DEFAULT_INITIAL = 60 * 1000; // 초기 시간
const INTERVAL = 10; // INTERVAL 밀리초 마다 시간 줄어듦
const STORAGE_KEY = "timer01_state"; // 로컬 스토리지 키 값

// 초기 상태를 로컬 스토리지에서 불러오는 함수 (클라이언트에서만 실행)
const getInitialState = () => {
  // 서버 사이드에서는 기본값 반환
  if (typeof window === "undefined") {
    return {
      initialTime: DEFAULT_INITIAL,
      time: DEFAULT_INITIAL,
      running: false,
      color: "default",
      label: "Timer Label",
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const state = JSON.parse(raw);
      const remain = state?.deadline
        ? Math.max(0, state.deadline - Date.now())
        : 0;

      // running 상태인데 시간이 다 지났다면 stopped로 처리
      if (state.mode === "running" && remain === 0) {
        return {
          initialTime: state.initialMs,
          time: state.initialMs,
          running: false,
          color: state.color || "default",
          label: state.label || "Timer Label",
        };
      }

      if (state.mode === "running" && remain > 0) {
        return {
          initialTime: state.initialMs,
          time: remain,
          running: true,
          color: state.color || "default",
          label: state.label || "Timer Label",
        };
      }

      return {
        initialTime: state.initialMs,
        time: state.remainMs,
        running: false,
        color: state.color || "default",
        label: state.label || "Timer Label",
      };
    }
  } catch {
    // 에러 발생 시 기본값 반환
  }

  return {
    initialTime: DEFAULT_INITIAL,
    time: DEFAULT_INITIAL,
    running: false,
    color: "default",
    label: "Timer Label",
  };
};

const Timer01 = () => {
  // 서버와 클라이언트의 초기 렌더링을 동일하게 하기 위해 기본값 사용
  // 초기값
  const [initialTime, setInitialTime] = useState<number>(DEFAULT_INITIAL);
  // 시간
  const [time, setTime] = useState<number>(DEFAULT_INITIAL);
  // 타이머 진행 여부
  const [running, setRunning] = useState<boolean>(false);
  // 메인 컬러 상태
  const [timerColor, setTimerColor] = useState<string>("default");
  // 라벨
  const [timerLabel, setTimerLabel] = useState<string>("Timer Label");

  // 마감시간 ref
  const deadlineRef = useRef<number | null>(null);
  // 채널 ref
  const channelRef = useRef<BroadcastChannel | null>(null);

  // 시, 분, 초
  const hour = String(Math.floor(time / (1000 * 60 * 60))).padStart(2, "0");
  const minute = String(Math.floor(time / (1000 * 60)) % 60).padStart(2, "0");
  const second = String(Math.floor((time / 1000) % 60)).padStart(2, "0");

  // 남은 시간 비율
  const remainTimePercent = initialTime ? (time / initialTime) * 100 : 0;

  // 로컬 스토리지 상태 저장
  const saveState = (state: PersistState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      channelRef.current?.postMessage(state);
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

    const deadline = Date.now() + time;
    deadlineRef.current = deadline;

    setRunning(true);

    const currentState = loadState();
    saveState({
      mode: "running",
      deadline,
      remainMs: initialTime,
      initialMs: initialTime,
      color: currentState?.color,
      label: currentState?.label,
    });
  };

  // 타이머 일시정지 함수
  const pauseTime = (): void => {
    setRunning(false);
    const currentState = loadState();
    saveState({
      mode: "paused",
      remainMs: time,
      initialMs: initialTime,
      color: currentState?.color,
      label: currentState?.label,
    });
  };

  // 타이머 리셋 함수
  const resetTime = (): void => {
    const state = loadState();
    setRunning(false);
    deadlineRef.current = null;

    setInitialTime(state.initialMs);
    setTime(state.initialMs);
    saveState({
      mode: "stopped",
      remainMs: state.initialMs,
      initialMs: state.initialMs,
      color: state?.color,
      label: state?.label,
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
    const currentState = loadState();
    saveState({
      mode: "stopped",
      remainMs: ms,
      initialMs: ms,
      color: currentState?.color,
      label: currentState?.label,
    });
  };

  // 메인 컬러 적용
  const applyColor = (color: string): void => {
    setTimerColor(color);
    // 기존 state를 불러와서 color만 업데이트
    const currentState = loadState();
    if (currentState) {
      saveState({
        ...currentState,
        color,
      });
    } else {
      // state가 없는 경우 기본 state 생성
      saveState({
        mode: "stopped",
        remainMs: time,
        initialMs: initialTime,
        color,
      });
    }
  };

  // 라벨 적용
  const applyLabel = (label: string): void => {
    setTimerLabel(label);
    // 기존 state를 불러와서 label만 업데이트
    const currentState = loadState();
    if (currentState) {
      saveState({
        ...currentState,
        label,
      });
    } else {
      // state가 없는 경우 기본 state 생성
      saveState({
        mode: "stopped",
        remainMs: time,
        initialMs: initialTime,
        label,
      });
    }
  };

  // INTERVAL 초 마다 시간 줄어들게 하기
  useEffect(() => {
    if (!running) return;

    const timer = () => {
      const deadline = deadlineRef.current ?? Date.now() + time;
      const remain = deadline - Date.now();
      setTime(remain);

      if (remain <= 0) {
        setRunning(false);
        deadlineRef.current = null;
        setTime(initialTime);

        const state = loadState();
        saveState({
          mode: "stopped",
          remainMs: initialTime,
          initialMs: initialTime,
          color: state?.color,
          label: state?.label,
        });
        return;
      }

      setTime(remain);
    };

    timer();
    const id = window.setInterval(timer, INTERVAL);
    const onVis = () => timer();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [running]);

  // 클라이언트 마운트 후 로컬 스토리지에서 상태 복원
  useEffect(() => {
    const state = loadState();

    if (!state) return;

    const remain = state?.deadline
      ? Math.max(0, state.deadline - Date.now())
      : 0;

    // 초기 상태 복원
    setInitialTime(state.initialMs);

    // color와 label 복원
    if (state.color) {
      setTimerColor(state.color);
    }
    if (state.label) {
      setTimerLabel(state.label);
    }

    // running 상태인데 시간이 다 지났다면 stopped로 변경
    if (state.mode === "running" && remain === 0) {
      saveState({
        mode: "stopped",
        remainMs: state.initialMs,
        initialMs: state.initialMs,
        color: state.color,
        label: state.label,
      });
      setRunning(false);
      setTime(state.initialMs);
    } else if (state.mode === "running" && remain > 0) {
      // running 상태일 때 남은 시간을 정확히 계산하여 업데이트
      deadlineRef.current = state.deadline;
      setTime(remain);
      setRunning(true);
    } else {
      // paused 또는 stopped 상태
      deadlineRef.current = null;
      setTime(state.remainMs);
      setRunning(false);
    }
  }, []);

  // 탭 별 동기화
  useEffect(() => {
    const channel = new BroadcastChannel("timer01-channel");
    channelRef.current = channel;

    channel.onmessage = (e) => {
      const state = e.data as PersistState;

      // 로컬 상태를 받은 state로 맞춰주기
      const nextInitial = state.initialMs ?? DEFAULT_INITIAL;
      const nextRemain = state.remainMs ?? nextInitial;

      setInitialTime(nextInitial);
      setTime(nextRemain);
      setRunning(state.mode === "running");
      setTimerColor(state.color ?? "default");
      setTimerLabel(state.label ?? "Timer Label");
      deadlineRef.current =
        state.mode === "running" ? state.deadline ?? null : null;
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

  return (
    <div className="widget_container" data-variant="timer01">
      {/* <BreakPointView /> */}
      <div
        className={`bg-notion-${
          timerColor === "default" ? "gray" : timerColor
        }-bg flex flex-col items-center justify-between p-[clamp(1.3rem,10vmin,3rem)] aspect-square`}
        style={{
          width: "min(100vw,100vh)",
          height: "min(100vw,100vh)",
          borderRadius: "calc(min(100vw,100vh) * 0.03)",
        }}
      >
        <div className="w-[85%] h-full flex flex-col justify-between gap-2 items-center">
          <div className="w-full">
            <div
              className="timer_circle w-full aspect-square rounded-[50%] flex justify-center items-center"
              style={{
                ["--remain" as string]: `${Math.max(
                  0,
                  Math.min(100, remainTimePercent)
                )}%`,
                ["--timer-color" as string]: `hsl(var(--notion-${timerColor}-text))`,
              }}
            >
              <div
                className={`bg-notion-${timerColor}-bg w-[90%] aspect-square rounded-[50%] flex flex-col justify-center items-center relative`}
              >
                <span
                  className={`absolute top-[15%] left-1/2 -translate-x-1/2 text-[clamp(0.4rem,4vmin,1.2rem)] text-notion-${timerColor}-text font-semibold`}
                >
                  {timerLabel}
                </span>
                <p
                  className={`text-[clamp(0.9rem,10vmin,20rem)] font-semibold text-notion-${timerColor}-text`}
                >
                  <span>{hour}</span>:<span>{minute}</span>:
                  <span>{second}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between w-full">
            <button
              className={`cursor-pointer text-[clamp(1rem,6vmin,3rem)] text-notion-${timerColor}-text`}
              onClick={resetTime}
            >
              <FaRedo />
            </button>
            <button
              className={`cursor-pointer text-[clamp(1rem,6vmin,3rem)] text-notion-${timerColor}-text`}
              onClick={!running ? startTime : pauseTime}
            >
              {!running ? <FaPlay /> : <FaPause />}
            </button>
            <TimeOption
              value={{ time: initialTime, label: timerLabel }}
              onApply={applyTime}
              applyColor={applyColor}
              applyLabel={applyLabel}
              disabled={running}
              activeOption={[
                "hour",
                "minute",
                "second",
                "theme",
                "color",
                "label",
              ]}
              style={`text-[clamp(1rem,6vmin,3rem)] text-notion-${timerColor}-text`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer01;
