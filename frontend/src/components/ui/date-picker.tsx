"use client";

import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

interface DatePickerProps {
  date?: Date | string;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "Select date",
  disabled = false,
  className,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Convert string date to Date object if needed
  const selectedDate = React.useMemo(() => {
    if (!date) return undefined;
    return typeof date === "string" ? new Date(date) : date;
  }, [date]);

  const handleSelect = (selectedDate: Date | undefined) => {
    onSelect(selectedDate);
    setOpen(false);
  };

  // Build hidden prop for date restrictions
  const hiddenDates = React.useMemo(() => {
    const hidden: any[] = [];
    if (minDate) {
      hidden.push({ before: minDate });
    }
    if (maxDate) {
      hidden.push({ after: maxDate });
    }
    return hidden.length > 0 ? hidden : undefined;
  }, [minDate, maxDate]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal text-left",
            !selectedDate && "text-muted-foreground",
            className
          )}
        >
          {selectedDate ? format(selectedDate, "PPP") : placeholder}
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          captionLayout="dropdown"
          disabled={disabled}
          hidden={hiddenDates}
          startMonth={new Date(1900, 0)}
          endMonth={new Date(2100, 11)}
        />
      </PopoverContent>
    </Popover>
  );
}
