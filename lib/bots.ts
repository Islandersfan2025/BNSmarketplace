import { MarketplaceBot } from "./types";

export const bots: MarketplaceBot[] = [
  {
    slug: "onchain-risk-radar",
    name: "Onchain Risk Radar",
    tagline: "Monitor wallet or protocol risk and alert your team.",
    category: "risk",
    price: "free",
    description:
      "Checks a wallet or contract on a schedule. If a threshold is crossed, it sends a webhook alert.",
    inputs: [
      { key: "walletAddress", label: "Wallet / Contract Address", type: "text", required: true, placeholder: "0x..." },
      { key: "thresholdEth", label: "ETH Balance Threshold", type: "number", required: true, defaultValue: 0.1 },
      { key: "webhookUrl", label: "Alert Webhook URL", type: "url", required: true, placeholder: "https://..." },
      { key: "interval", label: "Check Interval", type: "select", required: true, defaultValue: "15m", options: ["5m", "15m", "1h"] }
    ],
    buildWorkflow(values) {
      return {
        name: `Onchain Risk Radar - ${values.walletAddress}`,
        description: `Alerts when ETH balance is below ${values.thresholdEth}`,
        visibility: "private",
        nodes: [
          { id: "trigger_1", type: "schedule", position: { x: 0, y: 0 }, data: { label: "Scheduled Check", interval: values.interval } },
          { id: "web3_1", type: "web3", position: { x: 300, y: 0 }, data: { label: "Check ETH Balance", action: "getNativeBalance", address: values.walletAddress, chain: "ethereum" } },
          { id: "condition_1", type: "condition", position: { x: 600, y: 0 }, data: { label: "Balance Below Threshold", expression: `balance < ${values.thresholdEth}` } },
          { id: "webhook_1", type: "webhook", position: { x: 900, y: 0 }, data: { label: "Send Alert", url: values.webhookUrl, method: "POST", body: { title: "Onchain Risk Alert", wallet: values.walletAddress, thresholdEth: values.thresholdEth } } }
        ],
        edges: [
          { id: "e1", source: "trigger_1", target: "web3_1" },
          { id: "e2", source: "web3_1", target: "condition_1" },
          { id: "e3", source: "condition_1", target: "webhook_1" }
        ]
      };
    }
  },
  {
    slug: "whale-wallet-tracker",
    name: "Whale Wallet Tracker",
    tagline: "Track large wallet movements and publish alerts.",
    category: "alerts",
    price: "free",
    description: "Watches a wallet for large movements and sends alerts to a webhook or Discord bridge.",
    inputs: [
      { key: "walletAddress", label: "Wallet Address", type: "text", required: true, placeholder: "0x..." },
      { key: "minTransferUsd", label: "Minimum Transfer USD", type: "number", required: true, defaultValue: 10000 },
      { key: "webhookUrl", label: "Alert Webhook URL", type: "url", required: true }
    ],
    buildWorkflow(values) {
      return {
        name: `Whale Tracker - ${values.walletAddress}`,
        description: `Alerts for transfers above $${values.minTransferUsd}`,
        visibility: "private",
        nodes: [
          { id: "trigger_1", type: "schedule", position: { x: 0, y: 0 }, data: { label: "Every 5 minutes", interval: "5m" } },
          { id: "web3_1", type: "web3", position: { x: 300, y: 0 }, data: { label: "Fetch Recent Transfers", action: "getTransfers", address: values.walletAddress, chain: "ethereum" } },
          { id: "condition_1", type: "condition", position: { x: 600, y: 0 }, data: { label: "Large Transfer?", expression: `transferUsd >= ${values.minTransferUsd}` } },
          { id: "webhook_1", type: "webhook", position: { x: 900, y: 0 }, data: { label: "Publish Alert", url: values.webhookUrl, method: "POST" } }
        ],
        edges: [
          { id: "e1", source: "trigger_1", target: "web3_1" },
          { id: "e2", source: "web3_1", target: "condition_1" },
          { id: "e3", source: "condition_1", target: "webhook_1" }
        ]
      };
    }
  },
  {
    slug: "ai-alpha-signal-bot",
    name: "AI Alpha Signal Bot",
    tagline: "Score onchain events with AI before alerting.",
    category: "ai",
    price: "premium",
    description: "Combines onchain monitoring with an AI gateway step that ranks whether an event is worth attention.",
    inputs: [
      { key: "asset", label: "Asset / Token", type: "text", required: true, placeholder: "ETH, WBTC, USDC..." },
      { key: "confidenceThreshold", label: "AI Confidence Threshold", type: "number", required: true, defaultValue: 80 },
      { key: "webhookUrl", label: "Alert Webhook URL", type: "url", required: true }
    ],
    buildWorkflow(values) {
      return {
        name: `AI Alpha Signal - ${values.asset}`,
        description: `AI-scored onchain signal bot for ${values.asset}`,
        visibility: "private",
        nodes: [
          { id: "trigger_1", type: "schedule", position: { x: 0, y: 0 }, data: { label: "Every 15 minutes", interval: "15m" } },
          { id: "market_1", type: "web3", position: { x: 300, y: 0 }, data: { label: "Fetch Market + Onchain Data", action: "getAssetSnapshot", asset: values.asset } },
          { id: "ai_1", type: "ai-gateway", position: { x: 600, y: 0 }, data: { label: "Score Signal", prompt: "Score this onchain event from 0-100 for urgency and summarize the reason." } },
          { id: "condition_1", type: "condition", position: { x: 900, y: 0 }, data: { label: "High Confidence?", expression: `aiScore >= ${values.confidenceThreshold}` } },
          { id: "webhook_1", type: "webhook", position: { x: 1200, y: 0 }, data: { label: "Send Ranked Alert", url: values.webhookUrl, method: "POST" } }
        ],
        edges: [
          { id: "e1", source: "trigger_1", target: "market_1" },
          { id: "e2", source: "market_1", target: "ai_1" },
          { id: "e3", source: "ai_1", target: "condition_1" },
          { id: "e4", source: "condition_1", target: "webhook_1" }
        ]
      };
    }
  }
];

export function getBot(slug: string) {
  return bots.find((bot) => bot.slug === slug);
}
