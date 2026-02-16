import { isMockFamilyMembersApi } from "../../../utils/api";
import { getMockMemberDetails } from "../../../utils/mockFamilyMembers";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Member ID is required",
    });
  }

  if (isMockFamilyMembersApi(event)) {
    return getMockMemberDetails(id);
  }

  const baseUrl = getFamilyMembersApiBaseUrl(event);
  const apiUrl = `${baseUrl}/api/FamilyMembers/${id}/details`;

  try {
    const response = await $fetch<{
      success: boolean;
      status: number;
      message: string;
      data: {
        id: number;
        title: string;
        fullName: string;
        mobile: string | null;
        bod: string | null;
        isStillLive: boolean;
        gender: string;
        bio: string | null;
        jobTitle: string | null;
        branch: string | null;
        education: string | null;
        photoUrl: string;
        relations: Array<{ relatedFullName: string; relationType: string }>;
        parent: {
          id: number;
          title: string;
          fullName: string;
          photo: string;
          isStillLive: boolean;
          parent: any;
        } | null;
        childs: Array<{ relatedFullName: string; relationType: string }>;
      };
      errors: any;
    }>(apiUrl, {
      method: "GET",
      headers: { accept: "*/*" },
    });

    return response;
  }
  catch (error: any) {
    console.error("Error fetching family member details:", error?.message || error);
    throw createError({
      statusCode: error?.statusCode || 502,
      statusMessage: error?.message || "Failed to fetch family member details",
    });
  }
});
