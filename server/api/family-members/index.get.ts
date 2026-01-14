export default defineEventHandler(async (event) => {
  // Get query parameters from the request
  const query = getQuery(event);

  const baseUrl = getFamilyMembersApiBaseUrl(event);

  // Build the external API URL with query parameters
  const apiUrl = `${baseUrl}/api/FamilyMembers`;
  const params = new URLSearchParams({
    PageNumber: String(query.PageNumber || 1),
    PageSize: String(query.PageSize || 10),
  });

  try {
    // Make the request from server-side (no CORS issues)
    const response = await $fetch(`${apiUrl}?${params}`, {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    });

    return response;
  }
  catch (error: any) {
    // Handle errors properly
    console.error("Error fetching family members:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Failed to fetch family members",
    });
  }
});
