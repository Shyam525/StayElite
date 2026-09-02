import { NextResponse } from "next/server";
import { wishlistStore } from "../route";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ listingId: string }> }
) {
  const { listingId } = await params;

  let isWishlisted = false;
  if (wishlistStore.has(listingId)) {
    wishlistStore.delete(listingId);
    isWishlisted = false;
  } else {
    wishlistStore.add(listingId);
    isWishlisted = true;
  }

  return NextResponse.json({
    success: true,
    data: {
      listingId,
      isWishlisted,
      message: isWishlisted ? "Added to wishlist" : "Removed from wishlist",
    },
  });
}
