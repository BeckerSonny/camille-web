import { db  } from "~/utils/db.server";

export async function getTimelineEvents() {
  return db .timelineEvent.findMany();
}