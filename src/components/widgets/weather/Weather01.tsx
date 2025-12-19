"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect } from "react";

import { IoIosSunny } from "react-icons/io";
import { IoIosAlert } from "react-icons/io";
import { useLocationStore } from "@/store/useLocationStore";
import axios from "axios";

const Weather01 = (props: any) => {
  const { lat, lon } = useLocationStore();

  useEffect(() => {
    if (lat === 0 || lon === 0) return;

    const getWeatherData = async () => {
      try {
        const result = await axios.get(`/api/weather?lat=${lat}&lon=${lon}`);
        const data = result.data;
        console.log("클라이언트 통신 ok", data);
      } catch (error) {
        console.log("클라이언트 통신 failed");
        console.error("error", error);
      }
    };

    getWeatherData();
  }, [lat, lon]);

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
        <div className="w-full flex justify-between flex-wrap flex-[2]">
          <div className="flex flex-col items-start">
            <h2 className="text-[clamp(1.6rem,5vmin,2rem)] font-semibold">
              Seoul Guui
            </h2>
            <time
              dateTime="2025-12-14"
              className="text-[clamp(0.7rem,2vmin,1rem)]"
            >
              December 14, 2025
            </time>
            <div
              aria-label="날씨 아이콘"
              className="flex flex-col items-center"
            >
              <IoIosSunny className="text-[clamp(3rem,12vmin,6rem)]" />
              <span className="text-[clamp(0.5rem,2vmin,0.87rem)]">맑음</span>
            </div>
          </div>

          <div className="w-full max-w-[200px] flex flex-col items-center">
            <span
              aria-label="현재 온도"
              className="text-[clamp(4rem,12vmin,6rem)] leading-none"
            >
              18º
            </span>
            <div className="text-[clamp(0.8rem,4vmin,1rem)] font-semibold">
              <span aria-label="최저 온도">0º</span>
              <span> / </span>
              <span aria-label="최고 온도">9º</span>
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
      </div>
    </div>
  );
};

export default Weather01;
