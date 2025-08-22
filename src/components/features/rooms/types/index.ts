// Re-export centralized types for backward compatibility
export * from "@/types";

// Utils
export const fmt = (cents: number) => (cents / 100).toFixed(2) + " €";
