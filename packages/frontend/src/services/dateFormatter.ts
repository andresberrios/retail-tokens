import { DateTime } from "luxon";

export function formatDate(isoDate?: string | null) {
  return !isoDate ? "Invalid date" : DateTime.fromISO(isoDate).toFormat("FF");
}
