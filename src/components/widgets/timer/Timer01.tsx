"use client";

import BreakPointView from "@/components/BreakPointView";
// import React, { useEffect, useRef, useState } from "react";
// import style from "./timer.module.scss";
// import { FaMinus, FaPlus, FaQuestionCircle, FaTimes } from "react-icons/fa";
// import { HiOutlineDotsVertical } from "react-icons/hi";
// import { Swiper, SwiperSlide } from "swiper/react";
// import SwiperCore from "swiper";
// import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
// import { IoRefresh } from "react-icons/io5";

// const Timer01 = () => {
//   const [time, setTime] = useState(0);
//   const [initialTime, setInitialTime] = useState(0);
//   const [running, setRunning] = useState(false);
//   const timerRef = useRef(null);
//   const isFirstStart = useRef(true);

//   const [stopwatchTime, setStopwatchTime] = useState(0);
//   const [stopwatchMilliseconds, setStopwatchMilliseconds] = useState(0);
//   const [stopwatchRunning, setStopwatchRunning] = useState(false);
//   const stopwatchRef = useRef(null);

//   const [helpOpen, setHelpOpen] = useState(false);

//   const [isEditing, setIsEditing] = useState(false);
//   const [editMinutes, setEditMinutes] = useState("");
//   const [editSeconds, setEditSeconds] = useState("");

//   const applyTimeValue = () => {
//     const minutes = Number(editMinutes);
//     const seconds = Number(editSeconds);
//     if (!isNaN(minutes) && !isNaN(seconds) && minutes < 60 && seconds < 60) {
//       const newTime = minutes * 60 + seconds;
//       if (newTime >= 0) {
//         setTime(newTime);
//         if (!running && isFirstStart.current) {
//           setInitialTime(newTime);
//         }
//       }
//     }
//     setIsEditing(false);
//   };

//   // 타이머 useEffect
//   useEffect(() => {
//     if (running) {
//       const startTime = Date.now();
//       const endTime = startTime + time * 1000;

//       timerRef.current = setInterval(() => {
//         const currentTime = Date.now();
//         const remaining = Math.max(
//           0,
//           Math.ceil((endTime - currentTime) / 1000)
//         );

//         if (remaining === 0) {
//           clearInterval(timerRef.current);
//           setRunning(false);
//           setTime(0);
//           setInitialTime(0);
//           isFirstStart.current = true;
//           return;
//         }

//         setTime(remaining);
//       }, 1000);
//     } else {
//       clearInterval(timerRef.current);
//     }

//     return () => clearInterval(timerRef.current);
//   }, [running]);

//   // 스톱워치 useEffect
//   useEffect(() => {
//     if (stopwatchRunning) {
//       const startTime =
//         Date.now() - (stopwatchTime * 1000 + stopwatchMilliseconds * 10);

//       stopwatchRef.current = setInterval(() => {
//         const elapsedTime = Date.now() - startTime;
//         const newSeconds = Math.floor(elapsedTime / 1000);
//         const newMilliseconds = Math.floor((elapsedTime % 1000) / 10);

//         setStopwatchTime(newSeconds);
//         setStopwatchMilliseconds(newMilliseconds);
//       }, 10);
//     } else {
//       clearInterval(stopwatchRef.current);
//     }

//     return () => clearInterval(stopwatchRef.current);
//   }, [stopwatchRunning]);

//   const formatTimerSpan = (seconds) => {
//     const min = String(Math.floor(seconds / 60)).padStart(2, "0");
//     const sec = String(seconds % 60).padStart(2, "0");

//     if (isEditing) {
//       return (
//         <div className={style.timeInputContainer}>
//           <input
//             type="text"
//             value={editMinutes}
//             onChange={(e) => {
//               const value = e.target.value;
//               if (value === "" || /^\d{0,2}$/.test(value)) {
//                 setEditMinutes(value);
//               }
//             }}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 applyTimeValue();
//               } else if (e.key === "Escape") {
//                 setIsEditing(false);
//               }
//             }}
//             className={style.timeInput}
//             autoFocus
//             placeholder="00"
//             maxLength={2}
//           />
//           <span className={style.timeSeparator}>:</span>
//           <input
//             type="text"
//             value={editSeconds}
//             onChange={(e) => {
//               const value = e.target.value;
//               if (value === "" || /^\d{0,2}$/.test(value)) {
//                 setEditSeconds(value);
//               }
//             }}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 applyTimeValue();
//               } else if (e.key === "Escape") {
//                 setIsEditing(false);
//               }
//             }}
//             onBlur={() => applyTimeValue()}
//             className={style.timeInput}
//             placeholder="00"
//             maxLength={2}
//           />
//         </div>
//       );
//     }

//     return (
//       <div
//         onClick={() => {
//           if (!running) {
//             setIsEditing(true);
//             setEditMinutes(min);
//             setEditSeconds(sec);
//           }
//         }}
//         style={{ cursor: running ? "default" : "text" }}
//       >
//         <span className={style.timeUnit}>{min}</span>
//         <span className={style.timeSeparator}>:</span>
//         <span className={style.timeUnit}>{sec}</span>
//       </div>
//     );
//   };

//   const formatStopwatchSpan = (seconds, ms) => {
//     const min = String(Math.floor(seconds / 60)).padStart(2, "0");
//     const sec = String(seconds % 60).padStart(2, "0");
//     const millis = String(ms).padStart(2, "0");
//     return (
//       <>
//         <span className={style.timeUnit}>{min}</span>
//         <span className={style.timeSeparator}>:</span>
//         <span className={style.timeUnit}>{sec}</span>
//         <span className={style.timeSeparator}>:</span>
//         <span className={style.timeUnit}>{millis}</span>
//       </>
//     );
//   };

//   const handleTimeIncrease = () => {
//     const newTime = time + 60;
//     setTime(newTime);
//     if (!running && isFirstStart.current) {
//       setInitialTime(newTime);
//     }
//   };

//   const handleTimeDecrease = () => {
//     if (time <= 60) return;
//     const newTime = time - 60;
//     setTime(newTime);
//     if (!running && isFirstStart.current) {
//       setInitialTime(newTime);
//     }
//   };

//   const handleStartPause = () => {
//     if (time > 0) {
//       if (!running && isFirstStart.current) {
//         setInitialTime(time);
//         isFirstStart.current = false;
//       }
//       setRunning(!running);
//     }
//   };

//   const handleCancel = () => {
//     clearInterval(timerRef.current);
//     setRunning(false);
//     setTime(0);
//     setInitialTime(0);
//     isFirstStart.current = true;
//   };

//   const handleStopwatchStartStop = () => {
//     setStopwatchRunning(!stopwatchRunning);
//   };

//   const handleStopwatchReset = () => {
//     clearInterval(stopwatchRef.current);
//     setStopwatchRunning(false);
//     setStopwatchTime(0);
//     setStopwatchMilliseconds(0);
//   };

//   const progressPercent = initialTime === 0 ? 0 : (time / initialTime) * 100;

//   return (
//     <div className="widget_container">
//       <div className={style.timerContainer}>
//         <div
//           className={style.help}
//           onClick={() => setHelpOpen(!helpOpen)}
//           style={{ cursor: helpOpen ? "default" : "pointer" }}
//         >
//           {helpOpen ? (
//             <FaTimes color="#999" />
//           ) : (
//             <FaQuestionCircle color="#999" />
//           )}
//         </div>
//         <div
//           className={style.helpContainer}
//           style={{ display: helpOpen ? "block" : "none" }}
//         >
//           <div className={style.helpContent}>
//             <div className={style.helpItem}>
//               <h3>Timer</h3>
//               <div>
//                 <p>Timer 설명 1</p>
//                 <p>timer 설명 2</p>
//                 <p>timer 설명 3</p>
//               </div>
//             </div>
//             <div className={style.helpItem}>
//               <h3>Stopwatch</h3>
//               <div>
//                 <p>Stopwatch 설명 1</p>
//                 <p>Stopwatch 설명 2</p>
//                 <p>Stopwatch 설명 3</p>
//               </div>
//             </div>
//           </div>
//           <div className={style.helpFooter}>
//             <p>ⓒ 2025 dong. All rights reserved.</p>
//           </div>
//         </div>
//         <Swiper
//           modules={[Navigation, Pagination, Scrollbar, A11y]}
//           pagination={true}
//           scrollbar={true}
//         >
//           <SwiperSlide>
//             <div className={style.timer}>
//               <div className={style.time}>{formatTimerSpan(time)}</div>
//               <div className={style.progressBar}>
//                 <div
//                   className={style.progress}
//                   style={{
//                     width: `${Math.min(100, Math.max(0, progressPercent))}%`,
//                   }}
//                 ></div>
//               </div>
//               <div className={style.buttonControl}>
//                 <button className={style.button} onClick={handleTimeDecrease}>
//                   <FaMinus color="#999" />
//                 </button>
//                 <button
//                   className={style.button}
//                   onClick={handleStartPause}
//                   disabled={time === 0}
//                 >
//                   {running ? "Pause!" : "Start!"}
//                 </button>
//                 <button className={style.button} onClick={handleTimeIncrease}>
//                   <FaPlus color="#999" />
//                 </button>
//               </div>
//               <p className={style.cancel} onClick={handleCancel}>
//                 Cancel
//               </p>
//             </div>
//           </SwiperSlide>
//           <SwiperSlide>
//             <div className={style.timer}>
//               <div className={style.time}>
//                 {formatStopwatchSpan(stopwatchTime, stopwatchMilliseconds)}
//               </div>
//               <div className={style.buttonControl}>
//                 <button className={style.button} onClick={handleStopwatchReset}>
//                   <IoRefresh color="#999" size="24" />
//                 </button>
//                 <button
//                   className={style.button}
//                   onClick={handleStopwatchStartStop}
//                 >
//                   {stopwatchRunning ? "Stop!" : "Start!"}
//                 </button>
//               </div>
//             </div>
//           </SwiperSlide>
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default Timer01;

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
      label: "FOCUS",
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
          label: state.label || "FOCUS",
        };
      }

      if (state.mode === "running" && remain > 0) {
        return {
          initialTime: state.initialMs,
          time: remain,
          running: true,
          color: state.color || "default",
          label: state.label || "FOCUS",
        };
      }

      return {
        initialTime: state.initialMs,
        time: state.remainMs,
        running: false,
        color: state.color || "default",
        label: state.label || "FOCUS",
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
    label: "FOCUS",
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
  const [timerLabel, setTimerLabel] = useState<string>("FOCUS");

  // 마감시간 ref
  const deadlineRef = useRef<number | null>(null);

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
              value={time}
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
