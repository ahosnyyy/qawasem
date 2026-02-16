import { isMockFamilyMembersApi } from "../../utils/api";
import { mockFamilyMembersSearch } from "../../utils/mockFamilyMembers";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  if (isMockFamilyMembersApi(event)) {
    const pageSize = Number(query.PageSize) || 10;
    const data = { ...mockFamilyMembersSearch.data, pageSize, totalRecords: mockFamilyMembersSearch.data.data.length };
    return { ...mockFamilyMembersSearch, data };
  }

  const baseUrl = getFamilyMembersApiBaseUrl(event);
  const apiUrl = `${baseUrl}/api/FamilyMembers`;
  const params = new URLSearchParams({
    PageNumber: String(query.PageNumber || 1),
    PageSize: String(query.PageSize || 10),
  });

  try {
    const response = await $fetch(`${apiUrl}?${params}`, {
      method: "GET",
      headers: { accept: "*/*" },
    });
    return response;
  }
  catch (error: any) {
    console.error("Error fetching family members:", error?.message || error);
    throw createError({
      statusCode: error?.statusCode || 502,
      statusMessage: error?.message || "Failed to fetch family members",
    });
  }
});
