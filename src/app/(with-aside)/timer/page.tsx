import React from "react";
import style from "@/app/(with-aside)/home.module.scss";
import Link from "next/link";

const TimerPage = () => {
  return (
    <div className="page_container">
      <div className="widget_section">
        <h3 className="widget_title">Timer</h3>
        <div className="widget_list">
          <div className="widget_item">
            <Link href="/timer/1001">Timer</Link>
          </div>
          <div className="widget_item">
            <Link href="/timer/1002">Time Timer</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerPage;
