"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import DateSelector from "@/components/date-selector";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface AdminSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: () => Promise<void>;
  isLoading: boolean;
  postedFrom?: Date;
  postedTo?: Date;
  deadlineFrom?: Date;
  deadlineTo?: Date;
  setPostedFrom: (date?: Date) => void;
  setPostedTo: (date?: Date) => void;
  setDeadlineFrom: (date?: Date) => void;
  setDeadlineTo: (date?: Date) => void;
}

export default function AdminSettings({
  open,
  onOpenChange,
  onSearch,
  isLoading,
  postedFrom,
  postedTo,
  deadlineFrom,
  deadlineTo,
  setPostedFrom,
  setPostedTo,
  setDeadlineFrom,
  setDeadlineTo,
}: AdminSettingsProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Admin Settings
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900">API Call Settings</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-700">Posted Date Range</h4>
                <div className="grid grid-cols-2 gap-3">
                  <DateSelector
                    label="From"
                    date={postedFrom}
                    onSelect={setPostedFrom}
                  />
                  <DateSelector
                    label="To"
                    date={postedTo}
                    onSelect={setPostedTo}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-700">Response Deadline Range</h4>
                <div className="grid grid-cols-2 gap-3">
                  <DateSelector
                    label="From"
                    date={deadlineFrom}
                    onSelect={setDeadlineFrom}
                  />
                  <DateSelector
                    label="To"
                    date={deadlineTo}
                    onSelect={setDeadlineTo}
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-yellow-400 hover:bg-yellow-500 focus:bg-yellow-500 text-slate-900 
                       focus:ring-2 focus:ring-yellow-200 transition-all disabled:opacity-50"
              onClick={onSearch}
              disabled={isLoading}
            >
              {isLoading ? "Making API Call..." : "Make API Call"}
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900">Scheduled API Calls</h3>
            <p className="text-sm text-slate-500">
              Configure automated API calls to run at specified intervals.
            </p>
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
              <p className="text-sm text-slate-700">
                Scheduled API calls feature coming soon. This will allow you to automate data fetching at regular intervals.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}