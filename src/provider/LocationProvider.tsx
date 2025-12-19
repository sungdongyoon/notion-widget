"use client";

import { useLocationStore } from "@/store/useLocationStore";
import React, { useEffect } from "react";

const LocationProvider = () => {
  const setLocation = useLocationStore((store) => store.setLocation);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setLocation(latitude, longitude);
    });
  }, []);
  return null;
};

export default LocationProvider;

// 위도, 경도 관리 provider
