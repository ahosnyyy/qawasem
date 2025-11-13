export default defineEventHandler(async (event) => {
  // Get the ID from the route parameter
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Member ID is required'
    })
  }
  
  // Build the external API URL
  const apiUrl = `https://alqwassem-001-site1.stempurl.com/api/FamilyMembers/${id}/details`
  
  try {
    // Make the request from server-side (no CORS issues)
    const response = await $fetch<{
      success: boolean
      status: number
      message: string
      data: {
        id: number
        title: string
        fullName: string
        mobile: string | null
        bod: string | null
        isStillLive: boolean
        gender: string
        bio: string | null
        jobTitle: string | null
        branch: string | null
        education: string | null
        photoUrl: string
        relations: Array<{
          relatedFullName: string
          relationType: string
        }>
        parent: {
          id: number
          title: string
          fullName: string
          photo: string
          isStillLive: boolean
          parent: any
        } | null
        childs: Array<{
          relatedFullName: string
          relationType: string
        }>
      }
      errors: any
    }>(apiUrl, {
      method: 'GET',
      headers: {
        'accept': '*/*'
      }
    })
    
    return response
  } catch (error: any) {
    // Handle errors properly
    console.error('Error fetching family member details:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch family member details'
    })
  }
})

