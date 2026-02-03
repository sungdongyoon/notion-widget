"use client";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import React, { useState } from "react";
import { CalendarDay } from "react-day-picker";

const Calendar01 = () => {
  const [date, setDate] = useState<Date | any>(new Date());

  console.log("date", date);
  return (
    <div className="widget_container" data-variant="calendar01">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="w-full h-full border border-solid max-w-[100dvh] aspect-square"
        classNames={{
          months: "calendar_months w-full h-full",
          month: "calendar_month",
          month_caption: "calendar_month_caption",
          nav: "calendar_nav",
          button_previous: "calendar_button_previous",
          button_next: "calendar_button_next",
          caption_label:
            "calendar_caption_label text-[clamp(0.6rem,3vmin,1rem)]",
          weekdays: "calendar_weekdays",
          weekday: "calendar_weekday text-[clamp(0.6rem,3vmin,1rem)]",
          week: "calendar_week",
          day: "calendar_day text-[clamp(0.4rem,3vmin,1rem)]",
          today: "calendar_today",
        }}
      />
    </div>
  );
};

export default Calendar01;
