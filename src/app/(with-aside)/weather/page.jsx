import React from "react";
import Link from "next/link";

const WeatherPage = () => {
  return (
    <div className="page_container">
      <div className="widget_section">
        <h3 className="widget_title">Weather</h3>
        <div className="widget_list">
          <div className="widget_item">
            <Link href="/weather/typeA">Weather typeA</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
