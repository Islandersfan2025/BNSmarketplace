export type BotInput = {
  key: string;
  label: string;
  type: "text" | "number" | "url" | "select";
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number;
  options?: string[];
};

export type MarketplaceBot = {
  slug: string;
  name: string;
  tagline: string;
  category: "risk" | "alerts" | "trading" | "ai" | "dao";
  price: "free" | "paid" | "premium";
  description: string;
  inputs: BotInput[];
  buildWorkflow: (values: Record<string, string>) => {
    name: string;
    description: string;
    nodes: any[];
    edges: any[];
    visibility: "private";
  };
};
