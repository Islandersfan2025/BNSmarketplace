# BNS Marketplace

A runnable Next.js MVP for a marketplace where users can install different versions of KeeperHub automation bots.

## What is included

- Marketplace homepage
- Bot detail/configuration pages
- 3 starter bots:
  - Onchain Risk Radar
  - Whale Wallet Tracker
  - AI Alpha Signal Bot
- API routes to:
  - list bots
  - install a bot as a KeeperHub workflow
  - run a workflow manually
  - test a KeeperHub integration
- KeeperHub API wrapper in `lib/keeperhub.ts`

## Required installs

Install these first:

1. Node.js 18.18+ or Node.js 20+
2. npm, pnpm, or yarn
3. A KeeperHub account/API key
4. Git, optional but recommended

## Setup

```bash
unzip keeperhub-bot-marketplace.zip
cd keeperhub-bot-marketplace
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```bash
KEEPERHUB_BASE_URL=https://app.keeperhub.com
KEEPERHUB_API_KEY=kh_your_org_api_key_here
```

Run locally:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Main dependencies

Installed through `npm install` from `package.json`:

```bash
next
react
react-dom
zod
typescript
@types/node
@types/react
@types/react-dom
eslint
eslint-config-next
```

## KeeperHub API flow

When a user clicks **Install Bot**:

1. Frontend sends bot slug and form values to `/api/bots/install`
2. Backend loads the template from `lib/bots.ts`
3. Backend creates a workflow via KeeperHub
4. Backend patches the workflow with nodes and edges
5. App returns the KeeperHub workflow id

When a user clicks **Run Workflow Now**:

1. Frontend sends the workflow id to `/api/bots/run`
2. Backend calls KeeperHub workflow execution endpoint
3. Result is displayed in the UI

## Important note

The marketplace templates use a clean generic node schema. KeeperHub workflow APIs support nodes and edges, but exact node payloads may vary by workspace/export format. For production, create one workflow manually in KeeperHub, export or inspect its JSON, then map the templates in `lib/bots.ts` to that exact format.
