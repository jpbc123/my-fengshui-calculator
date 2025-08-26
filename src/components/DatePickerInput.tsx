import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DatePickerInputProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePickerInput({
  date,
  onDateChange,
  placeholder = "Enter your birthdate to start",
}: DatePickerInputProps) {
  const [calendarDate, setCalendarDate] = useState<Date>(date || new Date());
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleYearChange = (year: string) => {
    const newDate = new Date(calendarDate);
    newDate.setFullYear(parseInt(year));
    setCalendarDate(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(parseInt(month));
    setCalendarDate(newDate);
  };

  const handleDateSelect = (selected: Date | undefined) => {
    onDateChange(selected);
    if (selected) setPopoverOpen(false); // Close popover when day selected
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex-1 h-14 px-6 justify-start text-left font-normal bg-white border-black/20 text-black hover:bg-gray-100/80 transition-colors",
            !date && "text-black/60"
          )}
        >
          <span className="flex-1">
            {date ? format(date, "MMMM dd, yyyy") : placeholder}
          </span>
          <CalendarIcon className="ml-4 h-5 w-5 text-gold" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border-black/20 text-black" align="start">
        <div className="flex items-center justify-between p-3 border-b border-black/20">
          <div className="flex gap-2">
            <Select
              value={months[calendarDate.getMonth()]}
              onValueChange={(month) => handleMonthChange(months.indexOf(month).toString())}
            >
              <SelectTrigger className="w-[120px] h-8 bg-white text-black border-black/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={calendarDate.getFullYear().toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-[80px] h-8 bg-white text-black border-black/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] bg-white text-black">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          month={calendarDate}
          onMonthChange={setCalendarDate}
          initialFocus
          className="p-3 pointer-events-auto bg-white text-black"
          disabled={(date) =>
            date > new Date() || date < new Date("1920-01-01")
          }
        />
      </PopoverContent>
    </Popover>
  );
}