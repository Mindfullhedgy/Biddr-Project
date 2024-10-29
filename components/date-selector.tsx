"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface DateSelectorProps {
  label: string;
  date?: Date;
  onSelect: (date?: Date) => void;
}

export default function DateSelector({ label, date, onSelect }: DateSelectorProps) {
  return (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal border-slate-200",
              "hover:bg-slate-50 focus:ring-2 focus:ring-slate-200",
              !date && "text-slate-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "MM/dd/yyyy") : "Select"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              onSelect(date);
              // Close the popover after selection
              const closeEvent = new CustomEvent('close-popover');
              window.dispatchEvent(closeEvent);
            }}
            initialFocus
            className="rounded-lg border border-slate-200"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}