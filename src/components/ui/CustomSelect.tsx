"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select option...",
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Select Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-9 neu-sunken rounded-2xl px-3.5 flex items-center justify-between gap-2 text-xs font-bold text-text-rich dark:text-white transition-all cursor-pointer focus:outline-none"
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          <span className={!selectedOption ? "text-on-surface-variant/60 dark:text-white/40 font-medium" : ""}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-on-surface-variant/70 dark:text-white/60 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Floating Options Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 neu-card rounded-2xl p-1.5 shadow-xl max-h-56 overflow-y-auto scrollbar-none animate-in fade-in zoom-in-95 duration-150 border border-outline-variant/20 dark:border-white/10">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-xs text-on-surface-variant/60 dark:text-white/40 italic text-center font-medium">
              No options available
            </div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "neu-sunken text-primary dark:text-[#ffb4b4]"
                      : "text-text-rich dark:text-white hover:neu-raised-sm"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    {opt.icon}
                    {opt.label}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
