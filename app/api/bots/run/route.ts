import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { executeKeeperHubWorkflow } from "@/lib/keeperhub";

const schema = z.object({ workflowId: z.string() });

export async function POST(req: NextRequest) {
  try {
    const { workflowId } = schema.parse(await req.json());
    const result = await executeKeeperHubWorkflow(workflowId);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Run failed" },
      { status: 500 }
    );
  }
}
