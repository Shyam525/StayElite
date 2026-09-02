import { NextResponse } from "next/server";
import { notificationsStore } from "../route";

export async function POST() {
  notificationsStore.forEach((n) => {
    n.is_read = true;
  });

  return NextResponse.json({
    success: true,
    data: {
      message: "All notifications marked as read",
      unreadCount: 0,
    },
  });
}
