import { useState } from "react";
import { speak } from "../utils/speech";

export default function SpeechDropdown({
  label,
  value,
  options,
  onChange,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>

      <button
        type="button"
        onMouseEnter={() => speak(label)}
        onClick={() => setOpen(!open)}
        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white text-left flex justify-between items-center"
      >
        <span>{value}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute mt-2 w-full rounded-md bg-slate-900 border border-slate-700 shadow-lg z-50">
          {options.map((option) => (
            <div
              key={option}
              onMouseEnter={() => speak(option)}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="px-4 py-2 text-white hover:bg-cyan-500 hover:text-black cursor-pointer transition"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}