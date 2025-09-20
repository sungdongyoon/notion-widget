"use client";

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

import React from "react";

const Timer01 = () => {
  return <div>timer 01</div>;
};

export default Timer01;
