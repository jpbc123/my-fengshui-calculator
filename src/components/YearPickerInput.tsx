import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface YearPickerInputProps {
  year: Date | null;
  onYearChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
}

export const YearPickerInput = ({
  year,
  onYearChange,
  placeholder,
  className,
}: YearPickerInputProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-white text-black",
            !year && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {year ? format(year, "yyyy") : placeholder || "Pick a year"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={year ?? undefined}
          onSelect={(date) => {
            if (date) {
              onYearChange(date);
              setOpen(false);
            }
          }}
          fromYear={1900}
          toYear={2100}
          captionLayout="dropdown"
          className="rounded-md"
          initialFocus
          disabled={(date) => false} // allow all years
        />
      </PopoverContent>
    </Popover>
  );
};
