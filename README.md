# ⚡ @mercedes-benz/copilot-api

> ⚠️ **This package is exclusively for Mercedes-Benz GHE (mercedes-benz.ghe.com) Copilot users.** You must have an active GitHub Copilot license provisioned through the Mercedes-Benz enterprise organization to use this tool.

Use GitHub Copilot with any tool that supports the OpenAI or Anthropic API — including [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview). 🚀

This proxy sits between your tool and GitHub Copilot, translating requests so that Copilot appears as a standard OpenAI/Anthropic API.

> Based on [copilot-api](https://github.com/ericc-ch/copilot-api) by [Erick Christian](https://github.com/ericc-ch)
>
> Modified by [Atharva](https://mercedes-benz.ghe.com/athapat) for GHE, with love ❤️

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A GitHub account with an active [Copilot subscription](https://github.com/features/copilot)

## 🔧 Setup

### 1. Clone the repo

```sh
git clone https://github.com/mercedes-benz/copilot-api.git
cd copilot-api
```

### 2. Install dependencies

```sh
npm install
```

### 3. Start the server

**Option A — Production (recommended for most users):**

```sh
npm run build
node dist/main.js start
```

**Option B — Development mode (auto-reloads on changes):**

Requires [Bun](https://bun.sh/). Install it first:

```powershell
# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# macOS/Linux
curl -fsSL https://bun.sh/install | bash
```

Then run:

```sh
npm run dev start
```

That's it! 🎉 On first run, it will open your browser and ask you to log in to GitHub. After that, the proxy starts on `http://localhost:4141`.

## 🤖 Using with Claude Code

The easiest way — just add `--claude-code` and it configures everything for you:

```sh
npm run dev start -- --claude-code
```

**Or configure manually:**

Add this to your `.claude/settings.json` (create the file if it doesn't exist):

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://localhost:4141",
    "ANTHROPIC_AUTH_TOKEN": "dummy",
    "ANTHROPIC_MODEL": "claude-opus-4.7",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-4.6",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-4.7",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-4.5",
    "DISABLE_NON_ESSENTIAL_MODEL_CALLS": "1",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "permissions": {
    "deny": ["WebSearch"]
  }
}
```

Then start the proxy in one terminal, and run Claude Code in another.

## 🛠️ Using with Other Tools (Cursor, Continue, etc.)

Point any OpenAI-compatible tool to:

```
Base URL: http://localhost:4141
API Key: dummy (any value works)
```

## 📡 Available Endpoints

| Endpoint | Description |
| --- | --- |
| `POST /v1/chat/completions` | 💬 OpenAI Chat Completions |
| `GET /v1/models` | 📦 List available models |
| `POST /v1/embeddings` | 🔢 Embeddings |
| `POST /v1/messages` | 💬 Anthropic Messages |
| `GET /usage` | 📊 Copilot quota/usage data (JSON) |
| `GET /dashboard` | 🖥️ Usage dashboard (web UI) |

### 📊 Usage Dashboard

Open http://localhost:4141/dashboard in your browser to see your Copilot quota usage in real time. The dashboard auto-refreshes every 60 seconds.

## ⚙️ Options

```sh
npm run dev start -- --port 8080              # 🔌 Custom port (default: 4141)
npm run dev start -- --account-type business  # 🏢 For business/enterprise Copilot plans
npm run dev start -- --rate-limit 30 --wait   # 🚦 Limit to 30 requests/min, queue excess
```

## 🔐 Authentication

The proxy uses GitHub's device login flow. On first run:

1. 🔑 A code appears in your terminal
2. 🌐 Your browser opens to GitHub
3. 📋 Paste the code and authorize

Your token is saved locally so you won't need to do this again. ✅

## 🏗️ Production Build

```sh
npm run build
node dist/main.js start
```

## 📜 Available Scripts

| Script | What it does |
| --- | --- |
| `npm run dev start` | 🔄 Start with auto-reload (requires [Bun](https://bun.sh/)) |
| `npm run build` | 📦 Compile TypeScript to `dist/` |
| `npm run typecheck` | ✅ Run type checking without emitting |
| `npm run lint` | 🧹 Lint staged files |
| `npm run lint:all` | 🧹 Lint the entire project |
