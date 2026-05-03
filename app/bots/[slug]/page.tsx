"use client";

import { useState } from "react";
import { bots } from "@/lib/bots";

export default function BotDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const foundBot = bots.find((item) => item.slug === params.slug);

  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [workflowId, setWorkflowId] = useState("");
  const [loading, setLoading] = useState(false);

  if (!foundBot) {
    return (
      <main className="page">
        <h1>Bot not found</h1>
      </main>
    );
  }

  const bot = foundBot;

  async function installBot() {
    setLoading(true);
    setResult(null);

    const mergedValues: Record<string, string> = { ...values };

    for (const input of bot.inputs) {
      if (!mergedValues[input.key] && input.defaultValue !== undefined) {
        mergedValues[input.key] = String(input.defaultValue);
      }
    }

    try {
      const res = await fetch("/api/bots/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: bot.slug, values: mergedValues })
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error);

      setWorkflowId(json.workflowId);
      setResult(json);
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function runWorkflow() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/bots/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowId })
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error);

      setResult(json);
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="badge">{bot.category}</div>
      <h1>{bot.name}</h1>
      <p>{bot.description}</p>

      <div className="form">
        {bot.inputs.map((input) => (
          <label key={input.key}>
            {input.label}
            {input.type === "select" ? (
              <select
                value={values[input.key] || String(input.defaultValue || "")}
                onChange={(e) =>
                  setValues({ ...values, [input.key]: e.target.value })
                }
              >
                <option value="">Select...</option>
                {input.options?.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={input.type}
                placeholder={input.placeholder}
                defaultValue={input.defaultValue}
                onChange={(e) =>
                  setValues({ ...values, [input.key]: e.target.value })
                }
              />
            )}
          </label>
        ))}

        <button className="button" onClick={installBot} disabled={loading}>
          {loading ? "Working..." : "Install Bot"}
        </button>

        {workflowId && (
          <button
            className="button secondary"
            onClick={runWorkflow}
            disabled={loading}
          >
            Run Workflow Now
          </button>
        )}
      </div>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </main>
  );
}
