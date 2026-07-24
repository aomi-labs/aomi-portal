/**
 * Typed re-export of `user-fixture.json` (repo root) — the realistic
 * per-app usage statement for the Usage settings mock. Read directly from
 * the JSON so the fixture stays the single source of truth (see
 * `USAGE-MOCK-SPEC.md`). Simulation-only, no real auth/secrets.
 */
import raw from "../../../user-fixture.json";
import type { UsageFixtureData } from "./contracts";

export const usageFixture = raw as unknown as UsageFixtureData;
