import { isMockFamilyMembersApi } from "../../utils/api";
import { mockFamilyMembersSearch } from "../../utils/mockFamilyMembers";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  if (isMockFamilyMembersApi(event)) {
    const pageSize = Number(query.PageSize) || 50;
    const data = { ...mockFamilyMembersSearch.data, pageSize, totalRecords: mockFamilyMembersSearch.data.data.length };
    return { ...mockFamilyMembersSearch, data };
  }

  const baseUrl = getFamilyMembersApiBaseUrl(event);
  const apiUrl = `${baseUrl}/api/FamilyMembers`;
  const params = new URLSearchParams({
    PageNumber: String(query.PageNumber || 1),
    PageSize: String(query.PageSize || 50),
    ...(query.Search && { Search: String(query.Search) }),
  });

  try {
    const response = await $fetch<{
      success: boolean;
      status: number;
      message: string;
      data: {
        pageNumber: number;
        pageSize: number;
        totalRecords: number;
        data: Array<{
          id: number;
          title: string;
          fullName: string;
          mobile: string | null;
          bod: string | null;
          gender: string;
          jobTitle: string | null;
          branch: string | null;
          education: string | null;
          isStillLive: boolean;
          motherName: string | null;
          wifeName: string | null;
          photoUrl: string;
        }>;
      };
      errors: any;
    }>(`${apiUrl}?${params}`, {
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
