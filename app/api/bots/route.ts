import { NextResponse } from "next/server";
import { bots } from "@/lib/bots";

export async function GET() {
  return NextResponse.json({
    data: bots.map(({ buildWorkflow, ...bot }) => bot)
  });
}
