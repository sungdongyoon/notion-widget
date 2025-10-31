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

import React, { useEffect, useState } from "react";
import { FaPlay, FaRedo } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

// ===== 타입 =====
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
const STORAGE_KEY = "timer01_state"; // 로컬 스토리지 키 값

const Timer01 = () => {
  // 초기값
  const [initialTime, setInitialTime] = useState<number>(DEFAULT_INITIAL);
  // 시간
  const [time, setTime] = useState<number>(DEFAULT_INITIAL);
  // 타이머 진행 여부
  const [running, setRunning] = useState<boolean>(false);

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

  // INTERVAL 초 마다 시간 줄어들게 하기
  useEffect(() => {
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

  return (
    <div className="widget_container" data-variant="timer01">
      <BreakPointView />
      <div
        className="bg-black/30 flex flex-col items-center justify-between p-10"
        style={{
          width: "min(100vw,100vh)",
          height: "min(100vw,100vh)",
          borderRadius: "calc(min(100vw,100vh) * 0.03)",
        }}
      >
        <div className="w-[75%] h-full flex flex-col justify-between items-center">
          <div className="ff_blue w-full">
            <div
              className="timer_circle w-full aspect-square rounded-[50%] flex justify-center items-center"
              style={{
                ["--remain" as string]: `${Math.max(
                  0,
                  Math.min(100, remainTimePercent)
                )}%`,
              }}
            >
              <div className="bg-gray-400 w-[90%] aspect-square rounded-[50%] flex flex-col justify-center items-center relative">
                <span className="absolute top-[10%] left-1/2 -translate-x-1/2 text-[clamp(0.8rem,4vmin,1.2rem)] text-white">
                  focus
                </span>
                <p className="text-[clamp(0.9rem,10vmin,20rem)] font-semibold text-white">
                  <span>{hour}</span>:<span>{minute}</span>:
                  <span>{second}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between w-full ff_red flex-1">
            <button
              className="cursor-pointer text-[clamp(1rem,8vmin,3rem)]"
              onClick={resetTime}
            >
              <FaRedo />
            </button>
            <button
              className="cursor-pointer text-[clamp(1rem,8vmin,3rem)]"
              onClick={startTime}
            >
              <FaPlay />
            </button>
            <button className="cursor-pointer text-[clamp(1rem,8vmin,3rem)]">
              <FaGear />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer01;
