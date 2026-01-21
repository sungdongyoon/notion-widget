import React from "react";
import style from "@/app/(with-aside)/home.module.scss";
import Link from "next/link";

const CalenderPage = () => {
  return (
    <div className="page_container">
      <div className="widget_section">
        <h3 className="widget_title">Calendar</h3>
        <div className="widget_list">
          <div className="widget_item">
            <Link href="/calendar/1001">Calendar 01</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalenderPage;
