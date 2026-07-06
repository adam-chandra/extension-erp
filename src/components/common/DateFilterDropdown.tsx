import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import type { DateFilterOption } from "@/types/procurement";

const DATE_FILTER_LABELS: Record<DateFilterOption, string> = {
  all: "All Time",
  month: "This Month",
  year: "This Year",
  custom: "Custom Range",
};

export function DateFilterDropdown({
  value,
  onChange,
}: {
  value: DateFilterOption;
  onChange: (v: DateFilterOption, start?: string, end?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const options: DateFilterOption[] = ["all", "month", "year", "custom"];

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-md border border-primary bg-white px-3 py-1.5 text-sm font-medium text-primary shadow-sm hover:bg-primary/5 transition-colors"
      >
        <Calendar className="h-4 w-4" />
        <span>{DATE_FILTER_LABELS[value]}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-52 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                if (opt !== "custom") {
                  onChange(opt);
                  setOpen(false);
                } else {
                  onChange(opt);
                }
              }}
              className={`flex w-full items-center px-4 py-2 text-sm transition-colors hover:bg-primary/5 ${
                value === opt ? "font-semibold text-primary" : "text-slate-700"
              }`}
            >
              {DATE_FILTER_LABELS[opt]}
            </button>
          ))}

          {value === "custom" && (
            <div className="border-t border-slate-100 px-4 py-3 flex flex-col gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                onClick={() => {
                  onChange("custom", customStart, customEnd);
                  setOpen(false);
                }}
                className="mt-1 w-full rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
