"use client";

import { Calendar } from "@/components/ui/calendar";
import React, { useState } from "react";

const Calendar01 = () => {
  const [date, setDate] = useState<Date | any>(new Date());

  console.log("date", date);
  return (
    <div className="widget_container bg-red-100" data-variant="calendar01">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="h-full aspect-square"
      />
    </div>
  );
};

export default Calendar01;
