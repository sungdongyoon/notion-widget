import React from "react";

const Timer02 = () => {
  return (
    <div className="widget_container" data-variant="timer02">
      <div className="timer_container relative">
        <div className="absolute top-8 right-8">set</div>
        <div className="timer_clock">clock</div>
        <div className="timer_timer">
          <div className="timer_time">00:30:12</div>
          <div className="timer_btn">
            <div className="timer_play">play</div>
            <div className="timer_pause">pause</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer02;
