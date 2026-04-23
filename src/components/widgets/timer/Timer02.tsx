"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaPlayCircle, FaPause } from "react-icons/fa";
import TimeOption from "./TimeOption";
import { FaArrowRotateLeft, FaCirclePlay, FaGear } from "react-icons/fa6";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ApplyTimeProps, PersistState } from "./types";
import { loadState } from "@/utils/storage";
import { DEFAULT_INITIAL, INTERVAL } from "@/constants/timer";

const STORAGE_KEY = "timer02_state"; // 로컬 스토리지 키 값

const Timer02 = () => {
  // 초기값
  const [initialTime, setInitialTime] = useState<number>(DEFAULT_INITIAL);
  // 시간
  const [time, setTime] = useState<number>(DEFAULT_INITIAL);
  // 타이머 진행 여부
  const [running, setRunning] = useState<boolean>(false);
  // 메인 컬러 상태
  const [timerColor, setTimerColor] = useState<string>("default");
  // mobile 환경 구분
  const isMobile = useIsMobile();
  // timeoption 상태
  const [isTimeOption, setIsTimeOption] = useState<boolean>(false);

  // 마감시간 ref
  const deadlineRef = useRef<number | null>(null);
  // 채널 ref
  const channelRef = useRef<BroadcastChannel | null>(null);

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
      channelRef.current?.postMessage(state);
    } catch {}
  };

  // 타이머 시작 함수
  const startTime = (): void => {
    if (time <= 0) return;

    const deadline = Date.now() + time;
    deadlineRef.current = deadline;

    setRunning(true);

    const currentState = loadState<PersistState>(STORAGE_KEY);
    saveState({
      mode: "running",
      deadline,
      remainMs: initialTime,
      initialMs: initialTime,
      color: currentState?.color,
      timeFormat: currentState?.timeFormat ?? "hourFormat",
    });
  };

  // 타이머 일시정지 함수
  const pauseTime = (): void => {
    setRunning(false);

    const currentState = loadState<PersistState>(STORAGE_KEY);
    saveState({
      mode: "paused",
      remainMs: time,
      initialMs: initialTime,
      color: currentState?.color,
      timeFormat: currentState?.timeFormat ?? "hourFormat",
    });
  };

  // 타이머 리셋 함수
  const resetTime = (): void => {
    const state = loadState<PersistState>(STORAGE_KEY);
    setRunning(false);
    deadlineRef.current = null;

    const nextInitial = state?.initialMs ?? DEFAULT_INITIAL;
    setInitialTime(nextInitial);
    setTime(nextInitial);
    saveState({
      mode: "stopped",
      remainMs: nextInitial,
      initialMs: nextInitial,
      color: state?.color,
      timeFormat: state?.timeFormat ?? "hourFormat",
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
    const currentState = loadState<PersistState>(STORAGE_KEY);
    saveState({
      mode: "stopped",
      remainMs: ms,
      initialMs: ms,
      color: currentState?.color,
      timeFormat: currentState?.timeFormat ?? "hourFormat",
    });
  };

  // 메인 컬러 적용
  const applyColor = (color: string): void => {
    setTimerColor(color);
    // 기존 state를 불러와서 color만 업데이트
    const currentState = loadState<PersistState>(STORAGE_KEY);
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
        timeFormat: "hourFormat",
      });
    }
  };

  // INTERVAL 초 마다 시간 줄어들게 하는 이펙트
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

        const state = loadState<PersistState>(STORAGE_KEY);
        saveState({
          mode: "stopped",
          remainMs: initialTime,
          initialMs: initialTime,
          color: state?.color,
          timeFormat: state?.timeFormat ?? "hourFormat",
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

  // 마운트 시 복원
  useEffect(() => {
    const state = loadState<PersistState>(STORAGE_KEY);

    if (!state) {
      saveState({
        mode: "stopped",
        remainMs: DEFAULT_INITIAL,
        initialMs: DEFAULT_INITIAL,
        color: "default",
        timeFormat: "hourFormat",
      });
      return;
    }

    const remain =
      state.mode === "running" ? Math.max(0, state.deadline - Date.now()) : 0;

    // 초기 상태 복원
    setInitialTime(state.initialMs);

    // 컬러 복원
    if (state.color) {
      setTimerColor(state.color);
    }

    if (state.mode === "running") {
      // running 상태인데 시간이 다 지났다면 stopped로 변경
      if (remain === 0) {
        saveState({
          mode: "stopped",
          remainMs: state.initialMs,
          initialMs: state.initialMs,
          color: state.color,
          timeFormat: state?.timeFormat ?? "hourFormat",
        });
        setRunning(false);
        setTime(state.initialMs);
      } else {
        // running 상태일 때 남은 시간을 정확히 계산하여 업데이트
        deadlineRef.current = state.deadline;
        setTime(remain);
        setRunning(true);
      }
    } else {
      // paused 또는 stopped 상태
      deadlineRef.current = null;
      setTime(state.remainMs);
      setRunning(false);
    }
  }, []);

  // 탭 별 동기화
  useEffect(() => {
    const channel = new BroadcastChannel("timer02-channel");
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
      deadlineRef.current =
        state.mode === "running" ? (state.deadline ?? null) : null;
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

  return (
    <div className="widget_container" data-variant="timer02">
      <div
        className={`bg-notion-${timerColor}-text relative max-w-[500px] min-w-[150px] w-full aspect-[1/1] flex flex-col items-center justify-between rounded-[50%] ${isMobile && "relative"}`}
      >
        <div className="w-full flex-[2] flex justify-center items-center relative">
          <div
            className="timer_clock"
            style={{
              ["--remain" as string]: `${Math.max(
                0,
                Math.min(100, remainTimePercent),
              )}%`,
            }}
          >
            {showInProgressUI && (
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-notion-${timerColor}-text timer-02-bg border-[10px] border-solid border-timer-02-clock-bg w-[40%] min-w-[100px] aspect-square flex flex-col gap-2 justify-center items-center p-5`}
              >
                <div className="text-[clamp(0.9rem,4vmin,1.5rem)] text-timer-02-ring-text font-bold">
                  <span>{minute}</span>:<span>{second}</span>
                </div>
                <div className="w-full flex justify-center gap-[clamp(0.6rem,2.5vmin,1rem)]">
                  <button
                    onClick={!running ? startTime : pauseTime}
                    aria-label={!running ? "시작" : "일시정지"}
                    className="inline-flex items-center justify-center text-[clamp(0.5rem,2.5vmin,1rem)] text-timer-02-ring-text font-medium hover:opacity-80 transition-[1]"
                  >
                    {!running ? <FaCirclePlay /> : <FaPause />}
                  </button>
                  <button
                    className="inline-flex items-center justify-center text-[clamp(0.5rem,2.5vmin,1rem)] text-timer-02-ring-text font-medium hover:opacity-80 transition-[1]"
                    onClick={resetTime}
                  >
                    <FaArrowRotateLeft />
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
                    className={`inline-flex items-center justify-center text-[clamp(2.5rem,30cqi,10rem)] text-notion-${timerColor}-text timer-02-timer-text disabled:opacity-90 disabled:cursor-not-allowed hover:opacity-80 transition-[1]`}
                  >
                    <FaPlayCircle aria-hidden="true" />
                  </button>
                  <p
                    className={`text-notion-${timerColor}-text -timer-02-timer-text text-[clamp(0.8rem,6vmin,2rem)] font-bold`}
                  >
                    <span>{minute}</span>:<span>{second}</span>
                  </p>
                </div>
                <div className="absolute bottom-[0] left-1/2 -translate-x-1/2">
                  <button
                    className={`text-[clamp(0.6rem,5vmin,1.2rem)] text-notion-${timerColor}-text timer-02-setting-btn hover:opacity-80 transition-[1] ${
                      running
                        ? "cursor-not-allowed opacity-30"
                        : "cursor-pointer"
                    }`}
                    onClick={() => setIsTimeOption(true)}
                    disabled={running}
                  >
                    <FaGear />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <TimeOption
          value={{ time: time, color: timerColor }}
          onApply={applyTime}
          disabled={running}
          activeOption={["minute", "second", "theme", "color"]}
          applyColor={applyColor}
          isTimeOption={isTimeOption}
          setIsTimeOption={setIsTimeOption}
          triggerVisible={false}
          style={`text-[clamp(0.6rem,5vmin,1.2rem)] text-notion-${timerColor}-text timer-02-setting-btn hover:opacity-80 transition-[1]`}
          widgetType={STORAGE_KEY}
        />
      </div>
    </div>
  );
};

export default Timer02;
