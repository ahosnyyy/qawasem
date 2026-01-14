import type { H3Event } from "h3";

/**
 * Get the base URL for the Family Members API
 * @param event - The H3 event object
 * @returns The base URL without trailing slash
 * @throws Error if the API base URL is not configured
 */
export function getFamilyMembersApiBaseUrl(event: H3Event): string {
  const config = useRuntimeConfig(event);
  const baseUrl = config.familyMembersApiBase?.replace(/\/$/, "");

  if (!baseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: "Family members API base URL is not configured",
    });
  }

  return baseUrl;
}
