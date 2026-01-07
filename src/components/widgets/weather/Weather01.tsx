"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";

import { IoIosAlert } from "react-icons/io";
import { useLocationStore } from "@/store/useLocationStore";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaQuestionCircle } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  weather: {
    description: string | null;
    main: string | null;
  }[];
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

type ForecastItem = {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    main: string;
  }[];
};

type DailyAvg = {
  sumTemp: number;
  count: number;
  min: number;
  max: number;
  imageKey: string;
};

type DailySummary = {
  dateKey: string;
  avgTemp: number;
  min: number;
  max: number;
  imageKey: string;
};

type LocationResultName = "legalcode" | "admcode" | "addr" | "roadaddr";

type LocationReverseResult = {
  name: string;
  region?: any;
};

type LocationState = Record<LocationResultName, { region: any }>;

type LocationStateItem = {
  name: LocationResultName;
  region: Record<string, any>;
};

// 날씨 상태 객체 - 날씨 상태, 아이콘 화면에 출력
const WEATHER_STATE_MAP: Record<string, { mean: string; image: string }> = {
  Clear: {
    mean: "맑음",
    image: "/image/weather/icon/weather-clear.png",
  },
  Clouds: {
    mean: "구름 많음",
    image: "/image/weather/icon/weather-clouds.png",
  },
  Rain: {
    mean: "비",
    image: "/image/weather/icon/weather-rain.png",
  },
  Drizzle: {
    mean: "이슬비",
    image: "/image/weather/icon/weather-drizzle.png",
  },
  Snow: {
    mean: "눈",
    image: "/image/weather/icon/weather-snow.png",
  },
  Mist: {
    mean: "안개",
    image: "/image/weather/icon/weather-mist.png",
  },
  // Smoke: {
  //   mean: "연기",
  //   image: "",
  // },
  Dust: {
    mean: "먼지",
    image: "/image/weather/icon/weather-dust.png",
  },
  // Sand: {
  //   mean: "모래",
  //   image: "",
  // },
  // Ash: {
  //   mean: "화산재",
  //   image: "",
  // },
  Squall: {
    mean: "돌풍",
    image: "/image/weather/icon/weather-squall.png",
  },
  Tornado: {
    mean: "토네이도",
    image: "/image/weather/icon/weather-tornado.png",
  },
  Thunderstorm: {
    mean: "뇌우",
    image: "/image/weather/icon/weather-thunderstorm.png",
  },
};

const EMPTY_LOCATION_STATE: LocationState = {
  legalcode: { region: {} },
  admcode: { region: {} },
  addr: { region: {} },
  roadaddr: { region: {} },
};

const Weather01 = () => {
  // zustand 위도, 경도
  const { lat, lon } = useLocationStore();

  // 날씨 상태
  const [weatherState, setWeatherState] = useState<WeatherData>({
    name: null, // 지역 이름
    weather: [
      {
        description: null, // 날씨 정보
        main: null, // 날씨 상태
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
  const [forecastState, setForecastState] = useState<any | null>(null);
  // reverse geocoding 상태
  const [revGeocoding, setRevGeocoding] =
    useState<LocationState>(EMPTY_LOCATION_STATE);
  // geocoding 상태
  const [geocoding, setGeocoding] = useState<any>({
    lat: null,
    lon: null,
    roadAddress: "",
    jibunAddress: "",
    englishAddress: "",
    addressElements: [],
  });
  // 주소 입력 상태
  const [isAddress, setIsAddress] = useState<boolean>(false);
  const [addressQuery, setAddressQuery] = useState<string>("");
  // state 로딩 상태
  const [loading, setLoading] = useState<{
    today: boolean;
    forecast: boolean;
    revGeocoding: boolean;
    geocoding: boolean;
  }>({
    today: true,
    forecast: true,
    revGeocoding: true,
    geocoding: false,
  });

  // 주소 체크
  const handleCheckAddress = async () => {
    if (!addressQuery.trim()) {
      alert("주소를 입력해주세요!");
      return;
    }

    setLoading((prev) => ({ ...prev, geocoding: true }));

    try {
      const result = await axios.get(
        `/api/geocoding?address=${encodeURIComponent(addressQuery)}`
      );
      const data = result.data;
      setGeocoding({
        lat: data.addresses[0].y,
        lon: data.addresses[0].x,
        roadAddress: data.addresses[0].roadAddress,
        englishAddress: data.addresses[0].englishAddress,
        addressElements: data.addresses[0].addressElements,
      });
      setIsAddress(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, geocoding: false }));
    }
  };

  // Today 변환
  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  // forecast 평균 온도 및 최저/최고 온도 구하기
  const timezone = forecastState?.city?.timezone ?? 0;
  const forecastList: ForecastItem[] = forecastState?.list ?? [];

  // dt => 날짜 변환
  const toLocalKey = (dt: number) => {
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const date = new Date((dt + timezone) * 1000);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const weekday = date.getUTCDay();
    return `${month}.${day} (${weekdays[weekday]})`;
  };

  // forecast 온도 담을 배열 생성
  const forecastArray = new Map<string, DailyAvg>();

  for (const forcastItem of forecastList) {
    const fcDate = toLocalKey(forcastItem.dt);
    const fcValue = forecastArray.get(fcDate) ?? {
      sumTemp: 0,
      count: 0,
      min: Infinity,
      max: -Infinity,
      imageKey: "",
    };

    // forcast배열 값 설정
    fcValue.sumTemp += forcastItem.main.temp; // 온도
    fcValue.count += 1; // 평균값 구하기 위한 카운트

    fcValue.min = Math.min(fcValue.min, forcastItem.main.temp_min); // 최저온도
    fcValue.max = Math.max(fcValue.max, forcastItem.main.temp_max); // 최고온도

    fcValue.imageKey = forcastItem.weather[0].main;

    forecastArray.set(fcDate, fcValue);
  }

  // forecast 평균 및 최저/최고 온도 구하기
  const dailyAverages: DailySummary[] = Array.from(forecastArray.entries())
    .slice(0, 5)
    .map(([dateKey, v]) => ({
      dateKey,
      imageKey: v.imageKey,
      avgTemp: Math.round(v.sumTemp / v.count),
      min: Math.round(v.min),
      max: Math.round(v.max),
    }));

  // reverse geocoding 결과 매핑
  const NAMES: LocationResultName[] = [
    "legalcode",
    "admcode",
    "addr",
    "roadaddr",
  ];

  const normalizeReverseGeocodingResults = (
    results: LocationReverseResult[]
  ): LocationState => {
    const next: LocationState = {
      legalcode: { region: {} },
      admcode: { region: {} },
      addr: { region: {} },
      roadaddr: { region: {} },
    };

    for (const result of results ?? []) {
      const name = result.name as LocationResultName;
      if (name in next) {
        next[name] = { region: result.region ?? {} };
      }
    }

    return next;
  };

  // 주소 초기화
  const handleResetAddress = () => {
    setIsAddress(false);
  };

  // 날씨 정보 호출
  useEffect(() => {
    if (geocoding.lat === null || geocoding.lon === null) return;

    const getWeatherData = async () => {
      try {
        const result = await axios.get<WeatherData>(
          `/api/weather?lat=${geocoding.lat}&lon=${geocoding.lon}`
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
        // console.log("weather 클라이언트 통신 ok ", data);
      } catch (error) {
        setLoading((prev) => ({ ...prev, today: true }));
        // console.log("weather 클라이언트 통신 failed");
        console.error("error", error);
      }
    };

    getWeatherData();
  }, [geocoding.lat, geocoding.lon]);

  // forecast 5days 호출
  useEffect(() => {
    if (geocoding.lat === null || geocoding.lon === null) return;

    const getWeatherForecast5Data = async () => {
      try {
        const result = await axios.get(
          `/api/weatherForecast5?lat=${geocoding.lat}&lon=${geocoding.lon}`
        );
        const data = result.data;
        setForecastState(data);
        setLoading((prev) => ({ ...prev, forecast: false }));
        // console.log("forecast5 클라이언트 통신 ok ", data);
      } catch (error) {
        setLoading((prev) => ({ ...prev, forecast: true }));
        // console.log("forecast5 클라이언트 통신 failed ");
        console.error(error);
      }
    };
    getWeatherForecast5Data();
  }, [geocoding.lat, geocoding.lon]);

  // reverse geocoding 호출
  useEffect(() => {
    if (geocoding.lat === null || geocoding.lon === null) return;

    const getReverseGeocodingData = async () => {
      try {
        const result = await axios.get(
          `/api/reverseGeocoding?lat=${geocoding.lat}&lon=${geocoding.lon}`
        );
        const data = result.data;
        setRevGeocoding(normalizeReverseGeocodingResults(data.results ?? []));
        setLoading((prev) => ({ ...prev, revGeocoding: false }));
        // console.log("reverse geocoding 클라이언트 통신 ok ", data);
      } catch (error) {
        setLoading((prev) => ({ ...prev, revGeocoding: true }));
        // console.log("reverse geocoding 클라이언트 통신 failed");
        console.error(error);
      }
    };

    getReverseGeocodingData();
  }, [geocoding.lat, geocoding.lon]);

  // 주소 출력
  const area1 = revGeocoding.admcode.region?.area1?.name ?? "";
  const area2 = revGeocoding.admcode.region?.area2?.name ?? "";
  const area3 = revGeocoding.admcode.region?.area3?.name ?? "";

  const regionLabel = `${area1} ${area2} ${area3}`;

  if (weatherState) {
    // console.log("weatherState", weatherState);
    // console.log("forecastState", forecastState);
    // console.log("revGeocoding", revGeocoding);
  }

  return (
    <div className="widget_container" data-variant="weather01">
      <div
        className="bg-notion-gray-bg p-[clamp(1rem,5vmin,2.5rem)] flex flex-col gap-3 2xs:gap-0"
        style={{
          width: "min(100vw,100vh)",
          // height: "min(100vw,100vh)",
          borderRadius: "calc(min(100vw,100vh) * 0.03)",
          aspectRatio: "12/7",
        }}
      >
        {isAddress ? (
          loading.today ? (
            <div className="w-full h-full flex flex-col justify-center items-center gap-3">
              <Spinner className="size-20" />
              <p className="">날씨 데이터 로딩중...</p>
            </div>
          ) : (
            <>
              <div className="w-full flex justify-center flex-[2] flex-col gap-4 2xs:flex-row 2xs:justify-between 2xs:gap-0">
                <div className="flex flex-col items-center 2xs:items-start">
                  <div className="flex items-center gap-1">
                    <h2 className="text-[clamp(1rem,4vmin,2rem)] font-semibold">
                      {regionLabel}
                    </h2>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="2xs">
                          <FaRotate />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            주소를 초기화 하시겠습니까?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction onClick={handleResetAddress}>
                            초기화
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <time
                    dateTime={date.toISOString()}
                    className="text-[clamp(0.7rem,2vmin,1rem)] font-semibold"
                  >
                    {formattedDate}
                  </time>
                  <div className="flex flex-col items-center">
                    <div
                      aria-label="날씨 아이콘"
                      className="flex flex-col items-center w-[clamp(3rem,12vmin,6rem)] h-[clamp(3rem,12vmin,6rem)] relative"
                    >
                      {weatherState.weather[0].main && (
                        <Image
                          src={
                            WEATHER_STATE_MAP[weatherState.weather[0].main]
                              ?.image
                          }
                          fill
                          alt="날씨 아이콘"
                        />
                      )}
                    </div>
                    <span className="text-[clamp(0.5rem,2vmin,0.87rem)] font-semibold">
                      {weatherState.weather[0].main &&
                        WEATHER_STATE_MAP[weatherState.weather[0].main]?.mean}
                    </span>
                  </div>
                </div>

                <div className="w-[full] 2xs:w-[30%] min-w-[100px] flex flex-col items-center">
                  <span
                    aria-label="현재 온도"
                    className="text-[clamp(2rem,12vmin,6rem)] leading-none"
                  >
                    {weatherState.main.temp}º
                  </span>
                  <div className="text-[clamp(0.6rem,3vmin,1rem)] font-semibold">
                    <span aria-label="최저 온도">
                      {weatherState.main.temp_min}º
                    </span>
                    <span> / </span>
                    <span aria-label="최고 온도">
                      {weatherState.main.temp_max}º
                    </span>
                  </div>
                  {/* <div
                    aria-label="기상특보"
                    className="w-full flex justify-center items-center gap-1 bg-white/50 text-center py-[clamp(0.3rem,1vmin,0.5rem)] mt-3"
                  >
                    <IoIosAlert />
                    <span className="text-[clamp(0.6rem,2vmin,0.8rem)]">
                      기상특보 Box
                    </span>
                  </div> */}
                </div>
              </div>

              <div className="w-full flex flex-col flex-[1]">
                <Tabs defaultValue="weekly" className="w-full">
                  <TabsList className="w-full h-auto justify-start bg-transparent relative pb-0 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-notion-gray-text">
                    <TabsTrigger
                      value="weekly"
                      className="data-[state=active]:font-bold data-[state=active]:shadow-none data-[state=active]:bg-transparent relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:left-0 data-[state=active]:after:h-[3px] data-[state=active]:after:w-full data-[state=active]:after:bg-black text-[clamp(0.6rem,2vmin,1rem)]"
                    >
                      주간 날씨
                    </TabsTrigger>
                    <TabsTrigger
                      value="detail"
                      className="data-[state=active]:font-bold data-[state=active]:shadow-none data-[state=active]:bg-transparent relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:left-0 data-[state=active]:after:h-[3px] data-[state=active]:after:w-full data-[state=active]:after:bg-black text-[clamp(0.6rem,2vmin,1rem)]"
                    >
                      상세 정보
                    </TabsTrigger>
                    <TabsTrigger
                      value="tab3"
                      className="data-[state=active]:font-bold data-[state=active]:shadow-none data-[state=active]:bg-transparent relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:left-0 data-[state=active]:after:h-[3px] data-[state=active]:after:w-full data-[state=active]:after:bg-black text-[clamp(0.6rem,2vmin,1rem)]"
                    >
                      Tab 3
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="weekly">
                    <div className="grid grid-cols-5">
                      {dailyAverages?.map((e: any) => (
                        <div
                          key={e.dateKey}
                          className="flex flex-col items-center gap-1 text-center"
                        >
                          <span className="text-[clamp(0.6rem,2vmin,0.8rem)]">
                            {e.dateKey}
                          </span>
                          <div
                            aria-label="날씨 아이콘"
                            className="flex flex-col items-center w-[clamp(1rem,6vmin,3rem)] h-[clamp(1rem,6vmin,3rem)] relative"
                          >
                            {dailyAverages ? (
                              <Image
                                src={WEATHER_STATE_MAP[e.imageKey]?.image}
                                fill
                                alt="날씨 아이콘"
                              />
                            ) : (
                              <Spinner />
                            )}
                          </div>
                          <div className="text-[clamp(0.6rem,2vmin,0.8rem)]">
                            <span aria-label="최저 온도">{e.min}º</span>
                            <span> / </span>
                            <span aria-label="최고 온도">{e.max}º</span>
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
          )
        ) : loading.geocoding ? (
          <div className="w-full h-full flex flex-col justify-center items-center gap-3">
            <Spinner className="size-20" />
            <p className="">지역 정보 불러오는중 ...</p>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <div className="max-w-[450px] min-w-[100px] w-full flex flex-col items-center gap-[clamp(0.4rem,5vmin,2rem)]">
              <div className="flex flex-col items-center">
                <p className="text-[clamp(0.6rem,3vmin,1.4rem)]">
                  날씨 정보를 확인하고 싶은 지역을 입력해주세요!
                </p>
                <p className="text-[clamp(0.4rem,2vmin,1rem)]">
                  Please enter your address
                </p>
              </div>
              <div className="flex gap-1 justify-center w-full">
                <Input
                  className="w-full"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAddressQuery(e.target.value)
                  }
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      handleCheckAddress();
                    }
                  }}
                />
                <Button onClick={handleCheckAddress}>확인</Button>
              </div>
              <div className="flex items-center gap-1">
                <p className="text-[clamp(0.5rem,3vmin,0.8rem)]">
                  주소 입력 팁
                </p>
                <Tooltip>
                  <TooltipTrigger>
                    <FaQuestionCircle />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      정확한 주소를 입력하거나 행정구, 행정동만 입력해도 됩니다.
                    </p>
                    <p>
                      단, 행정구 또는 행정동을 입력하면 해당하는 구청이나
                      주민센터를 기준으로 위치가 잡히게 됩니다.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather01;
