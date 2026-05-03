const KEEPERHUB_BASE_URL =
  process.env.KEEPERHUB_BASE_URL || "https://app.keeperhub.com";

const KEEPERHUB_API_KEY = process.env.KEEPERHUB_API_KEY;

async function keeperhubFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!KEEPERHUB_API_KEY) {
    throw new Error("Missing KEEPERHUB_API_KEY in .env.local");
  }

  const res = await fetch(`${KEEPERHUB_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEEPERHUB_API_KEY}`,
      ...(options.headers || {})
    },
    cache: "no-store"
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`KeeperHub error ${res.status}: ${text}`);
  }

  return text ? JSON.parse(text) : ({} as T);
}

export async function createKeeperHubWorkflow(input: {
  name: string;
  description: string;
}) {
  return keeperhubFetch<any>("/api/workflows/create", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updateKeeperHubWorkflow(
  workflowId: string,
  input: {
    name: string;
    description: string;
    nodes: any[];
    edges: any[];
    visibility: "private";
  }
) {
  return keeperhubFetch<any>(`/api/workflows/${workflowId}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export async function executeKeeperHubWorkflow(workflowId: string) {
  return keeperhubFetch<any>(`/api/workflow/${workflowId}/execute`, {
    method: "POST"
  });
}

export async function testKeeperHubIntegration(
  integrationId: string,
  configOverrides?: Record<string, unknown>
) {
  return keeperhubFetch<any>(`/api/integrations/${integrationId}/test`, {
    method: "POST",
    body: JSON.stringify({ configOverrides })
  });
}
