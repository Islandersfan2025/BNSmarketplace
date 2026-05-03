import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getBot } from "@/lib/bots";
import { createKeeperHubWorkflow, updateKeeperHubWorkflow } from "@/lib/keeperhub";

const schema = z.object({
  slug: z.string(),
  values: z.record(z.string(), z.string())
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const bot = getBot(body.slug);

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    for (const input of bot.inputs) {
      if (input.required && !body.values[input.key]) {
        return NextResponse.json(
          { error: `Missing required input: ${input.key}` },
          { status: 400 }
        );
      }
    }

    const workflowDefinition = bot.buildWorkflow(body.values);

    const created = await createKeeperHubWorkflow({
      name: workflowDefinition.name,
      description: workflowDefinition.description
    });

    const workflowId = created.id || created.workflowId || created.data?.id;

    if (!workflowId) {
      return NextResponse.json(
        { error: "KeeperHub response did not include a workflow id", created },
        { status: 502 }
      );
    }

    const updated = await updateKeeperHubWorkflow(workflowId, workflowDefinition);

    return NextResponse.json({
      success: true,
      bot: bot.slug,
      workflowId,
      workflow: updated
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Install failed" },
      { status: 500 }
    );
  }
}
