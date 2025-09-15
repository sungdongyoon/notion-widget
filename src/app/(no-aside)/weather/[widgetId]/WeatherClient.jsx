"use client";

import React, { useEffect } from "react";

const WeatherClient = ({ data, widgetId }) => {
  return (
    <div className="widget_container">
      <div className="weather_container" data-variant={widgetId}>
        weather
      </div>
    </div>
  );
};

export default WeatherClient;
