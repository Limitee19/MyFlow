import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount)
}

export function formatDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return format(dateObj, "dd MMM yyyy")
}

export function formatDateTime(date: Date | string): string {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return format(dateObj, "dd MMM yyyy HH:mm")
}
