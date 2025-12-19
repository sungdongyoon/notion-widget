"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";

import { IoIosSunny } from "react-icons/io";
import { IoIosAlert } from "react-icons/io";
import { useLocationStore } from "@/store/useLocationStore";
import axios from "axios";

/* 
    날씨상태 : data.name
    날씨 : data.weather[0].description
    온도 : data.main.temp
    체감온도 : data.main.feels_like
    최저기온 : data.main.temp_min
    최고기온 : data.main.temp_max
    습도 : data.main.humidity
    기압 : data.main.pressure
    풍향 : data.wind.deg
    풍속 : data.wind.speed
  */

type WeatherData = {
  name: string | null;
  weather: { description: string | null }[];
  main: {
    temp: number | null;
    feels_like: number | null;
    temp_min: number | null;
    temp_max: number | null;
    humidity: number | null;
    pressure: number | null;
  };
  wind: {
    deg: number | null;
    speed: number | null;
  };
};

const Weather01 = () => {
  // zustand 위도, 경도
  const { lat, lon } = useLocationStore();

  // 날씨 상태
  const [weatherState, setWeatherState] = useState<WeatherData>({
    name: null, // 날씨 상태
    weather: [
      {
        description: null, // 날씨 정보
      },
    ],
    main: {
      temp: null, // 온도
      feels_like: null, // 체감온도
      temp_min: null, // 최저온도
      temp_max: null, // 최고온도
      humidity: null, // 습도
      pressure: null, // 기압
    },
    wind: {
      deg: null, // 풍향
      speed: null, // 풍속
    },
  });
  // forecast 상태
  const [forecastState, setForecastState] = useState<object | null>(null);
  // 오늘 / 주간 로딩 상태
  const [loading, setLoading] = useState<{ today: boolean; forecast: boolean }>(
    {
      today: true,
      forecast: true,
    }
  );

  // Today 변환
  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  // 날씨 정보 통신
  useEffect(() => {
    if (lat === 0 || lon === 0) return;

    const getWeatherData = async () => {
      try {
        const result = await axios.get<WeatherData>(
          `/api/weather?lat=${lat}&lon=${lon}`
        );
        const data = result.data;
        setWeatherState({
          name: data.name,
          weather: data.weather,
          main: {
            ...data.main,
            temp: data.main.temp !== null ? Math.round(data.main.temp) : null, // temp는 반올림
            temp_min:
              data.main.temp_min !== null
                ? Math.round(data.main.temp_min)
                : null, // temp는 반올림
            temp_max:
              data.main.temp_max !== null
                ? Math.round(data.main.temp_max)
                : null, // temp는 반올림
          },
          wind: data.wind,
        });
        setLoading((prev) => ({ ...prev, today: false }));
        console.log("weather 클라이언트 통신 ok", data);
      } catch (error) {
        setLoading((prev) => ({ ...prev, today: true }));
        console.log("weather 클라이언트 통신 failed");
        console.error("error", error);
      }
    };

    getWeatherData();
  }, [lat, lon]);

  // 기상정보 예측 5일
  useEffect(() => {
    const getWeatherForecast5Data = async () => {
      try {
        const result = await axios.get(
          `/api/weatherForecast5?lat=${lat}&lon=${lon}`
        );
        const data = result.data;
        setForecastState(data);
        setLoading((prev) => ({ ...prev, forecast: false }));
        console.log("forecast5 클라이언트 통신 ok ", data);
      } catch (error) {
        setLoading((prev) => ({ ...prev, forecast: true }));
        console.log("forecast5 클라이언트 통신 failed ");
        console.error(error);
      }
    };
    getWeatherForecast5Data();
  }, [lat, lon]);

  if (weatherState) {
    console.log("state", weatherState);
    console.log("forecast", forecastState);
  }

  return (
    <div className="widget_container" data-variant="weather01">
      <div
        className="bg-notion-gray-bg p-[clamp(1rem,5vmin,2.5rem)] flex flex-col"
        style={{
          width: "min(100vw,100vh)",
          // height: "min(100vw,100vh)",
          borderRadius: "calc(min(100vw,100vh) * 0.03)",
          aspectRatio: "12/7",
        }}
      >
        {loading.today ? (
          <p>날씨 데이터 로딩중...</p>
        ) : (
          <>
            <div className="w-full flex justify-between flex-wrap flex-[2]">
              <div className="flex flex-col items-start">
                <h2 className="text-[clamp(1.6rem,5vmin,2rem)] font-semibold">
                  {weatherState.name}
                </h2>
                <time
                  dateTime={date.toISOString()}
                  className="text-[clamp(0.7rem,2vmin,1rem)]"
                >
                  {formattedDate}
                </time>
                <div
                  aria-label="날씨 아이콘"
                  className="flex flex-col items-center"
                >
                  <IoIosSunny className="text-[clamp(3rem,12vmin,6rem)]" />
                  <span className="text-[clamp(0.5rem,2vmin,0.87rem)]">
                    {weatherState.weather[0].description}
                  </span>
                </div>
              </div>

              <div className="w-full max-w-[200px] flex flex-col items-center">
                <span
                  aria-label="현재 온도"
                  className="text-[clamp(4rem,12vmin,6rem)] leading-none"
                >
                  {weatherState.main.temp}º
                </span>
                <div className="text-[clamp(0.8rem,4vmin,1rem)] font-semibold">
                  <span aria-label="최저 온도">
                    {weatherState.main.temp_min}º
                  </span>
                  <span> / </span>
                  <span aria-label="최고 온도">
                    {weatherState.main.temp_max}º
                  </span>
                </div>
                <div
                  aria-label="기상특보"
                  className="flex justify-center items-center gap-1 bg-white/50 w-full text-center py-2 mt-3"
                >
                  <IoIosAlert />
                  <span className="text-[0.8rem]">기상특보 Box</span>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col flex-[1]">
              <Tabs defaultValue="weekly" className="w-full">
                <TabsList className="w-full justify-start bg-transparent relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-notion-gray-text pb-0">
                  <TabsTrigger
                    value="weekly"
                    className="data-[state=active]:font-bold data-[state=active]:shadow-none data-[state=active]:bg-transparent relative data-[state=active]:after:absolute data-[state=active]:after:top-[95%] data-[state=active]:left-0 data-[state=active]:after:h-[2px] data-[state=active]:after:w-full data-[state=active]:after:bg-black"
                  >
                    주간 날씨
                  </TabsTrigger>
                  <TabsTrigger
                    value="detail"
                    className="data-[state=active]:font-bold data-[state=active]:shadow-none data-[state=active]:bg-transparent relative data-[state=active]:after:absolute data-[state=active]:after:top-[95%] data-[state=active]:left-0 data-[state=active]:after:h-[2px] data-[state=active]:after:w-full data-[state=active]:after:bg-black"
                  >
                    상세 정보
                  </TabsTrigger>
                  <TabsTrigger
                    value="tab3"
                    className="data-[state=active]:font-bold data-[state=active]:shadow-none data-[state=active]:bg-transparent relative data-[state=active]:after:absolute data-[state=active]:after:top-[95%] data-[state=active]:left-0 data-[state=active]:after:h-[2px] data-[state=active]:after:w-full data-[state=active]:after:bg-black"
                  >
                    Tab 3
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="weekly">
                  <div className="grid grid-cols-8">
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-1 text-center"
                      >
                        <span className="text-[clamp(0.6rem,2vmin,0.8rem)]">
                          오늘&#40;일&#41;
                        </span>
                        <IoIosSunny className="text-[clamp(1rem,6vmin,2.5rem)]" />
                        <div className="text-[clamp(0.6rem,2vmin,0.8rem)]">
                          <span aria-label="최저 온도">0º</span>
                          <span> / </span>
                          <span aria-label="최고 온도">9º</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="detail">상세 정보</TabsContent>
                <TabsContent value="tab3">tab 3</TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Weather01;
