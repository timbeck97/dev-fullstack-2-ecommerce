import { createDefaultPreset } from "ts-jest";
import type { Config } from "jest";

const tsJestTransformCfg = createDefaultPreset().transform;

const config: Config = {
  testEnvironment: "jsdom",
  transform: {
    ...tsJestTransformCfg,
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx)"],
};

export default config;