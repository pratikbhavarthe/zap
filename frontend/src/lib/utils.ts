import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function disableConsoleLogs() {
  if (process.env.NODE_ENV === "production") {
    console.log = function () {};
    console.log = function () {};
    console.log = function () {};                               
  }
}

export function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}