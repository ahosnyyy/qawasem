import type { H3Event } from "h3";

/**
 * Whether to use mock family members API (env MOCK_FAMILY_MEMBERS_API=1 or when API base is unset and mocks are used as fallback).
 */
export function isMockFamilyMembersApi(event: H3Event): boolean {
  const config = useRuntimeConfig(event);
  return !!config.mockFamilyMembersApi;
}

/**
 * Get the base URL for the Family Members API
 * @param event - The H3 event object
 * @returns The base URL without trailing slash
 * @throws Error if the API base URL is not configured and mock is not enabled
 */
export function getFamilyMembersApiBaseUrl(event: H3Event): string {
  const config = useRuntimeConfig(event);
  const baseUrl = config.familyMembersApiBase?.replace(/\/$/, "");

  if (!baseUrl && !config.mockFamilyMembersApi) {
    throw createError({
      statusCode: 500,
      statusMessage: "Family members API base URL is not configured. Set FAMILY_MEMBERS_API_BASE or MOCK_FAMILY_MEMBERS_API=1 to use mocks.",
    });
  }

  return baseUrl || "http://mock";
}
