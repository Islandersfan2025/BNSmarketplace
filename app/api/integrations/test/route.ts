import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { testKeeperHubIntegration } from "@/lib/keeperhub";

const schema = z.object({
  integrationId: z.string(),
  configOverrides: z.record(z.string(), z.unknown()).optional()
});

export async function POST(req: NextRequest) {
  try {
    const { integrationId, configOverrides } = schema.parse(await req.json());
    const result = await testKeeperHubIntegration(integrationId, configOverrides);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Integration test failed" },
      { status: 500 }
    );
  }
}
