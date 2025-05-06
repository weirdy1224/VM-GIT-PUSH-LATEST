import React, { useState } from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import "./Scorecard.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DatePickerWithRange({ className, onDateChange }) {
  const [date, setDate] = useState({
    from: new Date(2025, 0, 1), // January 1, 2025
    to: new Date(2025, 11, 31), // December 31, 2025
  });

  const handleSelectFromDate = (newDate) => {
    if (newDate) {
      setDate((prev) => ({
        ...prev,
        from: newDate,
        to: newDate > prev.to ? addDays(newDate, 1) : prev.to,
      }));
      if (onDateChange) onDateChange({ from: newDate, to: date.to });
    }
  };

  const handleSelectToDate = (newDate) => {
    if (newDate) {
      setDate((prev) => ({
        ...prev,
        to: newDate,
      }));
      if (onDateChange) onDateChange({ from: date.from, to: newDate });
    }
  };

  return (
    <div className={cn("grid gap-9 r", className)}>
      <div className="flex space-x-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="from-date"
              variant="outline"
              className={cn(
                "w-[150px] align-top border-black text-left font-normal date rounded-3xl ",
                !date.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date.from ? format(date.from, "LLL dd, y") : <span>From</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="grid gap-4" style={{ marginLeft: "" }}>
              <Calendar
                initialFocus
                mode="single"
                defaultMonth={date.from}
                selected={date.from}
                onSelect={handleSelectFromDate}
                numberOfMonths={1}
              />
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="to-date"
              variant="outline"
              className={cn(
                "w-[150px] align-top border-black text-left font-normal date rounded-3xl",
                !date.to && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date.to ? format(date.to, "LLL dd, y") : <span>To</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="grid gap-4" style={{ marginLeft: "-10px" }}>
              <Calendar
                initialFocus
                mode="single"
                defaultMonth={date.to}
                selected={date.to}
                onSelect={handleSelectToDate}
                numberOfMonths={1}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
