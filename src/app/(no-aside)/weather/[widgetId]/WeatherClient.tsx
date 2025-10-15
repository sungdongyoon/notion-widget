"use client";

import Image from "next/image";
import React, { useEffect } from "react";

type WeatherApiData = {
  main: { temp: number };
  name: string;
  weather: { main: string }[];
};

type Props = {
  data: WeatherApiData;
  widgetId: string;
};

const WeatherClient = ({ data, widgetId }: Props) => {
  // 날씨에 따른 이미지 맵
  const WHEATHER_IMAGE_MAP = {
    Clear: "sun",
    Rain: "rainy",
    Clouds: "cloud",
  } as const;

  type WeatherKey = keyof typeof WHEATHER_IMAGE_MAP;
  const isWeatherKey = (key: string): key is WeatherKey =>
    key in WHEATHER_IMAGE_MAP;

  const weatherData = {
    temp: Math.round(data.main.temp),
    location: data.name,
    image: isWeatherKey(data.weather[0].main)
      ? WHEATHER_IMAGE_MAP[data.weather[0].main]
      : "sun",
  };

  return (
    <div className="widget_container">
      <div className="weather_container" data-variant={widgetId}>
        <div className="weather_image">
          <div className="weather_image_box">
            <Image
              src={`/test/${weatherData.image}.png`}
              alt="sun image"
              fill
            />
          </div>
        </div>
        <div className="weather_info">
          <span className="weather_temp">{weatherData.temp}º</span>
          <span className="weather_location">{weatherData.location}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherClient;
