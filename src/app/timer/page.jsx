import React from "react";
import style from "./timer.module.scss";

const Timer = () => {
  return (
    <div className="pageContainer">
      <h3 className="widgetTitle">Timer</h3>
      <div className="widgetView">
        <div className={style.timer}>
          <div>dot</div>
          <div>00:00</div>
          <div>progress bar</div>
          <div>
            <button>-</button>
            <button>Start or Pause</button>
            <button>+</button>
          </div>
          <p>Cancel</p>
        </div>
      </div>
    </div>
  );
};

export default Timer;
