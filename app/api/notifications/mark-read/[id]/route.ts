import { NextResponse } from "next/server";
import { notificationsStore } from "../../route";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const target = notificationsStore.find((n) => n.id === id);
  if (target) {
    target.is_read = true;
  }

  const unreadCount = notificationsStore.filter((n) => !n.is_read).length;

  return NextResponse.json({
    success: true,
    data: {
      id,
      is_read: true,
      unreadCount,
    },
  });
}
