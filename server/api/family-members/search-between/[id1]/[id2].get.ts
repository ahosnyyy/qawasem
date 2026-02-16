import { isMockFamilyMembersApi } from "../../../../utils/api";
import { getMockSearchBetween } from "../../../../utils/mockFamilyMembers";

export default defineEventHandler(async (event) => {
  const id1 = getRouterParam(event, "id1");
  const id2 = getRouterParam(event, "id2");

  if (!id1 || !id2) {
    throw createError({
      statusCode: 400,
      statusMessage: "Both member IDs are required",
    });
  }

  if (isMockFamilyMembersApi(event)) {
    return getMockSearchBetween(id1, id2);
  }

  const baseUrl = getFamilyMembersApiBaseUrl(event);
  const apiUrl = `${baseUrl}/api/FamilyMembers/search-between/${id1}/${id2}`;

  try {
    const response = await $fetch<{
      success: boolean;
      status: number;
      message: string;
      data: {
        member1: Array<{
          id: number;
          title: string;
          fullName: string;
          photo: string;
          isStillLive: boolean;
          parent: any;
        }>;
        member2: Array<{
          id: number;
          title: string;
          fullName: string;
          photo: string;
          isStillLive: boolean;
          parent: any;
        }>;
        commonAncestor: {
          id: number;
          title: string;
          fullName: string;
          photo: string;
          isStillLive: boolean;
          parent: any;
        };
      };
      errors: any;
    }>(apiUrl, {
      method: "GET",
      headers: { accept: "*/*" },
    });

    return response;
  }
  catch (error: any) {
    console.error("Error fetching common ancestor:", error?.message || error);
    throw createError({
      statusCode: error?.statusCode || 502,
      statusMessage: error?.message || "Failed to fetch common ancestor",
    });
  }
});
