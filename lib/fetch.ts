import logger from "@/lib/logger";

export async function appFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const url = typeof input === "string" ? input : input.toString();
  const method = init?.method || "GET";
  const startTime = Date.now();

  logger.info({ url, method }, "Fetch request started");

  try {
    const response = await fetch(input, init);
    const duration = Date.now() - startTime;

    if (!response.ok) {
      logger.warn(
        { url, method, status: response.status, duration },
        "Fetch request completed with error status",
      );
    } else {
      logger.info(
        { url, method, status: response.status, duration },
        "Fetch request completed successfully",
      );
    }

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(
      { url, method, duration, error },
      "Fetch request failed with exception",
    );
    throw error;
  }
}
