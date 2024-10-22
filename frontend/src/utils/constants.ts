import { Record } from "@phosphor-icons/react";

let RUNENV: "dev" | "prod" = "dev";

const MAP_ENV_TO_ORIGIN: Record<"dev" | "prod", string> = {
  dev: "http://localhost:5000",
  prod: document.location.origin,
};

const COLOR_SCHEMA = {
  dark: "#1B1A1F",
  accent: "#f97300 ",
  whity: "#e2dfd0",
  secondDark: "#524c42",
};

const ORIGIN = MAP_ENV_TO_ORIGIN[RUNENV];

const BASE_URL = ORIGIN.concat("/api");

export { COLOR_SCHEMA, ORIGIN, BASE_URL };
