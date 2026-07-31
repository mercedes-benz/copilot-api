import { test, expect, mock } from "bun:test"

import type { ChatCompletionsPayload } from "../src/services/copilot/create-chat-completions"

import { copilotBaseUrl } from "../src/lib/api-config"
import { state } from "../src/lib/state"
import { getAccountTypeFromCopilotToken } from "../src/lib/token"
import { createChatCompletions } from "../src/services/copilot/create-chat-completions"

// Mock state
state.copilotToken = "test-token"
state.vsCodeVersion = "1.0.0"
state.accountType = "individual"

// Helper to mock fetch
const fetchMock = mock(
  (_url: string, opts: { headers: Record<string, string> }) => {
    return {
      ok: true,
      json: () => ({ id: "123", object: "chat.completion", choices: [] }),
      headers: opts.headers,
    }
  },
)
// @ts-expect-error - Mock fetch doesn't implement all fetch properties
;(globalThis as unknown as { fetch: typeof fetch }).fetch = fetchMock

test("sets X-Initiator to agent if tool/assistant present", async () => {
  const payload: ChatCompletionsPayload = {
    messages: [
      { role: "user", content: "hi" },
      { role: "tool", content: "tool call" },
    ],
    model: "gpt-test",
  }
  await createChatCompletions(payload)
  expect(fetchMock).toHaveBeenCalled()
  const headers = (
    fetchMock.mock.calls[0][1] as { headers: Record<string, string> }
  ).headers
  expect(headers["X-Initiator"]).toBe("agent")
})

test("sets X-Initiator to user if only user present", async () => {
  const payload: ChatCompletionsPayload = {
    messages: [
      { role: "user", content: "hi" },
      { role: "user", content: "hello again" },
    ],
    model: "gpt-test",
  }
  await createChatCompletions(payload)
  expect(fetchMock).toHaveBeenCalled()
  const headers = (
    fetchMock.mock.calls[1][1] as { headers: Record<string, string> }
  ).headers
  expect(headers["X-Initiator"]).toBe("user")
})

test("uses the standard Copilot host for individual accounts", () => {
  expect(
    copilotBaseUrl({
      ...state,
      accountType: "individual",
      copilotApiBaseUrl: undefined,
    }),
  ).toBe("https://api.githubcopilot.com")
})

test("uses plan-routed Copilot hosts for managed accounts", () => {
  expect(
    copilotBaseUrl({
      ...state,
      accountType: "business",
      copilotApiBaseUrl: undefined,
    }),
  ).toBe("https://api.business.githubcopilot.com")
  expect(
    copilotBaseUrl({
      ...state,
      accountType: "enterprise",
      copilotApiBaseUrl: undefined,
    }),
  ).toBe("https://api.enterprise.githubcopilot.com")
})

test("prefers the routed API host from the Copilot token response", () => {
  expect(
    copilotBaseUrl({
      ...state,
      accountType: "business",
      copilotApiBaseUrl: "https://copilot-api.example.ghe.com",
    }),
  ).toBe("https://copilot-api.example.ghe.com")
})

test("detects managed account types from the Copilot token sku", () => {
  expect(
    getAccountTypeFromCopilotToken(
      "tid=abc;sku=copilot_for_business_seat_quota;chat=1:signature",
    ),
  ).toBe("business")
  expect(
    getAccountTypeFromCopilotToken(
      "tid=abc;sku=copilot_enterprise_seat;chat=1:signature",
    ),
  ).toBe("enterprise")
  expect(
    getAccountTypeFromCopilotToken(
      "tid=abc;sku=copilot_individual;chat=1:signature",
    ),
  ).toBe("individual")
})
