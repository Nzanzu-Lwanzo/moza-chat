
let RUNENV: "dev" | "prod" = "dev";

const COLOR_SCHEMA = {
  dark: "#1B1A1F",
  accent: "#f97300",
  whity: "#e2dfd0",
  secondDark: "#524c42",
};

const ORIGIN =
  RUNENV === "dev" ? "http://localhost:5000" : document.location.origin;

const BASE_URL = ORIGIN.concat("/api");


export { COLOR_SCHEMA, ORIGIN, BASE_URL };
