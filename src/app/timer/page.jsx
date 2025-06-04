"use client";

import React, { useEffect, useRef, useState } from "react";
import style from "./timer.module.scss";
import { FaMinus, FaPlus } from "react-icons/fa";

const Timer = () => {
  const [time, setTime] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);
  const isFirstStart = useRef(true);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setRunning(false);
            setInitialTime(0);
            isFirstStart.current = true;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [running]);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleTimeIncrease = () => {
    const newTime = time + 60;
    setTime(newTime);
    if (!running && isFirstStart.current) {
      setInitialTime(newTime);
    }
  };

  const handleTimeDecrease = () => {
    if (time <= 60) return;
    const newTime = time - 60;
    setTime(newTime);
    if (!running && isFirstStart.current) {
      setInitialTime(newTime);
    }
  };

  const handleStartPause = () => {
    if (time > 0) {
      if (!running && isFirstStart.current) {
        setInitialTime(time);
        isFirstStart.current = false;
      }
      setRunning(!running);
    }
  };

  const handleCancel = () => {
    clearInterval(timerRef.current);
    setRunning(false);
    setTime(0);
    setInitialTime(0);
    isFirstStart.current = true;
  };

  const progressPercent = initialTime === 0 ? 0 : (time / initialTime) * 100;

  return (
    <div className={style.timer}>
      <div>dot</div>
      <div className={style.time}>{formatTime(time)}</div>
      <div className={style.progressBar}>
        <div
          className={style.progress}
          style={{
            width: `${Math.min(100, Math.max(0, progressPercent))}%`,
          }}
        ></div>
      </div>
      <div className={style.buttonControl}>
        <button className={style.button} onClick={handleTimeDecrease}>
          <FaMinus color="#999" />
        </button>
        <button
          className={style.button}
          onClick={handleStartPause}
          disabled={time === 0}
        >
          {running ? "Pause!" : "Start!"}
        </button>
        <button className={style.button} onClick={handleTimeIncrease}>
          <FaPlus color="#999" />
        </button>
      </div>
      <p className={style.cancel} onClick={handleCancel}>
        Cancel
      </p>
    </div>
  );
};

export default Timer;
