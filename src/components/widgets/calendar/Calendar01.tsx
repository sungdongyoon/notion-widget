"use client";

import { Calendar } from "@/components/ui/calendar";
import React, { useState } from "react";

const Calendar01 = () => {
  const [date, setDate] = useState<Date | any>(new Date());

  console.log("date", date);
  return (
    <div className="widget_container bg-red-100" data-variant="calendar01">
      <div className="max-w-[100dvh] w-full aspect-square">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default Calendar01;
