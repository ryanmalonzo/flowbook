import pino from "pino";

const isDevelopment = process.env.NODE_ENV !== "production";

// Output JSON logs - they'll be prettified by pino-pretty when piped in dev script
// See: https://github.com/vercel/next.js/discussions/46987
const logger = pino({
  level: isDevelopment ? "debug" : "info",
});

export default logger;
