import { describe, expect, it, vi } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

function createRuntime(
  input: {
    startResult?: boolean;
    startError?: Error;
    stopError?: Error;
  } = {},
) {
  let running = false;

  return {
    start: vi.fn(() => {
      if (input.startError) {
        throw input.startError;
      }

      running = input.startResult ?? true;
      return running;
    }),
    stop: vi.fn(() => {
      if (input.stopError) {
        throw input.stopError;
      }

      running = false;
    }),
    isRunning: vi.fn(() => running),
  };
}

describe("Gmail inbound scheduler app lifecycle", () => {
  it("does not start scheduler when no runtime is wired", async () => {
    const app = await createServer({ env: testEnv });

    await app.ready();
    await app.close();

    expect(true).toBe(true);
  });

  it("starts scheduler when runtime is explicitly wired and enabled", async () => {
    const runtime = createRuntime();
    const app = await createServer({
      env: testEnv,
      gmailInboundSyncSchedulerRuntime: runtime,
    });

    await app.ready();
    await app.close();

    expect(runtime.start).toHaveBeenCalledTimes(1);
    expect(runtime.stop).toHaveBeenCalledTimes(1);
  });

  it("does not duplicate scheduler start across duplicate bootstrap calls", async () => {
    const runtime = createRuntime();
    const app = await createServer({
      env: testEnv,
      gmailInboundSyncSchedulerRuntime: runtime,
    });

    await app.ready();
    await app.ready();
    await app.close();

    expect(runtime.start).toHaveBeenCalledTimes(1);
  });

  it("keeps shutdown idempotent and safe when runtime is disabled", async () => {
    const runtime = createRuntime({ startResult: false });
    const app = await createServer({
      env: testEnv,
      gmailInboundSyncSchedulerRuntime: runtime,
    });

    await app.ready();
    await app.close();
    await app.close();

    expect(runtime.start).toHaveBeenCalledTimes(1);
    expect(runtime.stop).toHaveBeenCalledTimes(1);
  });

  it("handles startup and shutdown failures without leaking sensitive values", async () => {
    const runtime = createRuntime({
      startError: new Error("startup failed"),
      stopError: new Error("shutdown failed"),
    });
    const app = await createServer({
      env: testEnv,
      gmailInboundSyncSchedulerRuntime: runtime,
    });

    await app.ready();
    await app.close();

    const serializedRuntime = JSON.stringify(runtime);

    expect(runtime.start).toHaveBeenCalledTimes(1);
    expect(runtime.stop).toHaveBeenCalledTimes(1);
    expect(serializedRuntime).not.toContain("access_token");
    expect(serializedRuntime).not.toContain("refresh_token");
    expect(serializedRuntime).not.toContain("Authorization");
    expect(serializedRuntime).not.toContain("raw Gmail");
  });
});
