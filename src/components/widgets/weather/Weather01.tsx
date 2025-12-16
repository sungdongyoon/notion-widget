import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

import { IoIosSunny } from "react-icons/io";
import { IoIosAlert } from "react-icons/io";

const Weather01 = (props: any) => {
  console.log("props", props);
  return (
    <div className="widget_container" data-variant="weather01">
      <div
        className="bg-blue-200 p-[clamp(1rem,5vmin,2.5rem)] flex flex-col"
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
            <TabsContent value="weekly">주간 날씨</TabsContent>
            <TabsContent value="detail">상세 정보</TabsContent>
            <TabsContent value="tab3">tab 3</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Weather01;
