# @mercedes-benz/copilot-api

A reverse-engineered proxy for the GitHub Copilot API that exposes it as an OpenAI and Anthropic compatible service. Use GitHub Copilot with any tool that supports the OpenAI Chat Completions API or the Anthropic Messages API, including [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview).

> Based on [copilot-api](https://github.com/ericc-ch/copilot-api) by [Erick Christian](https://github.com/ericc-ch)

## Setup

Add the following to your `~/.npmrc`:

```
@mercedes-benz:registry=https://npm.mercedes-benz.ghe.com/
//npm.mercedes-benz.ghe.com/:_authToken=<YOUR_GHE_PAT>
```

Your PAT needs `read:packages` scope. Generate one at https://mercedes-benz.ghe.com/settings/tokens.

## Usage

```sh
npx @mercedes-benz/copilot-api start
```

### With Claude Code

```sh
npx @mercedes-benz/copilot-api start --claude-code
```

Or configure manually in `.claude/settings.json`:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://localhost:4141",
    "ANTHROPIC_AUTH_TOKEN": "dummy",
    "ANTHROPIC_MODEL": "claude-opus-4.7",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-5",
    "ANTHROPIC_SMALL_FAST_MODEL": "gemini-3.6-flash",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "gemini-3.6-flash",
    "DISABLE_NON_ESSENTIAL_MODEL_CALLS": "1",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "permissions": {
    "deny": ["WebSearch"]
  }
}
```

### With any OpenAI-compatible tool

Point your tool to:

```
Base URL: http://localhost:4141
API Key: dummy
```

The proxy exposes these endpoints:

| Endpoint | Description |
| --- | --- |
| `POST /v1/chat/completions` | OpenAI Chat Completions |
| `GET /v1/models` | List available models |
| `POST /v1/embeddings` | Embeddings |
| `POST /v1/messages` | Anthropic Messages |

### Common Options

```sh
npx @mercedes-benz/copilot-api start --port 8080              # Custom port (default: 4141)
npx @mercedes-benz/copilot-api start --account-type business  # For business/enterprise plans
npx @mercedes-benz/copilot-api start --rate-limit 30 --wait   # Rate limiting
```

## Authentication

The proxy uses GitHub OAuth device flow. On first run, it will prompt you to authenticate via browser. Your token is persisted locally for future use.
