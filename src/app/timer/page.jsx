"use client";

import React, { useEffect, useRef, useState } from "react";
import style from "./timer.module.scss";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { IoRefresh } from "react-icons/io5";

const Timer = () => {
  const [time, setTime] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);
  const isFirstStart = useRef(true);

  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchMilliseconds, setStopwatchMilliseconds] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const stopwatchRef = useRef(null);

  // 타이머 useEffect
  useEffect(() => {
    if (running) {
      const startTime = Date.now();
      const endTime = startTime + time * 1000;

      timerRef.current = setInterval(() => {
        const currentTime = Date.now();
        const remaining = Math.max(
          0,
          Math.ceil((endTime - currentTime) / 1000)
        );

        if (remaining === 0) {
          clearInterval(timerRef.current);
          setRunning(false);
          setTime(0);
          setInitialTime(0);
          isFirstStart.current = true;
          return;
        }

        setTime(remaining);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [running]);

  // 스톱워치 useEffect
  useEffect(() => {
    if (stopwatchRunning) {
      const startTime =
        Date.now() - (stopwatchTime * 1000 + stopwatchMilliseconds * 10);

      stopwatchRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newSeconds = Math.floor(elapsedTime / 1000);
        const newMilliseconds = Math.floor((elapsedTime % 1000) / 10);

        setStopwatchTime(newSeconds);
        setStopwatchMilliseconds(newMilliseconds);
      }, 10);
    } else {
      clearInterval(stopwatchRef.current);
    }

    return () => clearInterval(stopwatchRef.current);
  }, [stopwatchRunning]);

  const formatTimerSpan = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return (
      <>
        <span className={style.timeUnit}>{min}</span>
        <span className={style.timeSeparator}>:</span>
        <span className={style.timeUnit}>{sec}</span>
      </>
    );
  };

  const formatStopwatchSpan = (seconds, ms) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    const millis = String(ms).padStart(2, "0");
    return (
      <>
        <span className={style.timeUnit}>{min}</span>
        <span className={style.timeSeparator}>:</span>
        <span className={style.timeUnit}>{sec}</span>
        <span className={style.timeSeparator}>:</span>
        <span className={style.timeUnit}>{millis}</span>
      </>
    );
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

  const handleStopwatchStartStop = () => {
    setStopwatchRunning(!stopwatchRunning);
  };

  const handleStopwatchReset = () => {
    clearInterval(stopwatchRef.current);
    setStopwatchRunning(false);
    setStopwatchTime(0);
    setStopwatchMilliseconds(0);
  };

  const progressPercent = initialTime === 0 ? 0 : (time / initialTime) * 100;

  return (
    <div className="container">
      <div className={style.timerContainer}>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          pagination={true}
          scrollbar={true}
        >
          <SwiperSlide>
            <div className={style.timer}>
              <div className={style.time}>{formatTimerSpan(time)}</div>
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
          </SwiperSlide>
          <SwiperSlide>
            <div className={style.timer}>
              <div className={style.time}>
                {formatStopwatchSpan(stopwatchTime, stopwatchMilliseconds)}
              </div>
              <div className={style.buttonControl}>
                <button className={style.button} onClick={handleStopwatchReset}>
                  <IoRefresh color="#999" size="24" />
                </button>
                <button
                  className={style.button}
                  onClick={handleStopwatchStartStop}
                >
                  {stopwatchRunning ? "Stop!" : "Start!"}
                </button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Timer;
