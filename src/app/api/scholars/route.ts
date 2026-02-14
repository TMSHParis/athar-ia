import { NextResponse } from "next/server";
import { getScholarsForSearch } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const scholars = await getScholarsForSearch();
  return NextResponse.json(scholars);
}
