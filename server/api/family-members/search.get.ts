export default defineEventHandler(async (event) => {
  // Get query parameters from the request
  const query = getQuery(event)
  
  // Build the external API URL with query parameters
  const apiUrl = 'https://alqwassem-001-site1.stempurl.com/api/FamilyMembers'
  const params = new URLSearchParams({
    PageNumber: String(query.PageNumber || 1),
    PageSize: String(query.PageSize || 50),
    ...(query.Search && { Search: String(query.Search) })
  })
  
  try {
    // Make the request from server-side (no CORS issues)
    const response = await $fetch<{
      success: boolean
      status: number
      message: string
      data: {
        pageNumber: number
        pageSize: number
        totalRecords: number
        data: Array<{
          id: number
          title: string
          fullName: string
          mobile: string | null
          bod: string | null
          gender: string
          jobTitle: string | null
          branch: string | null
          education: string | null
          isStillLive: boolean
          motherName: string | null
          wifeName: string | null
          photoUrl: string
        }>
      }
      errors: any
    }>(`${apiUrl}?${params}`, {
      method: 'GET',
      headers: {
        'accept': '*/*'
      }
    })
    
    return response
  } catch (error: any) {
    // Handle errors properly
    console.error('Error fetching family members:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch family members'
    })
  }
})

