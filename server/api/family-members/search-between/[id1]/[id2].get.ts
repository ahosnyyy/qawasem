export default defineEventHandler(async (event) => {
  // Get the IDs from route parameters
  const id1 = getRouterParam(event, 'id1')
  const id2 = getRouterParam(event, 'id2')
  
  if (!id1 || !id2) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Both member IDs are required'
    })
  }
  
  // Build the external API URL
  const apiUrl = `https://alqwassem-001-site1.stempurl.com/api/FamilyMembers/search-between/${id1}/${id2}`
  
  try {
    // Make the request from server-side (no CORS issues)
    const response = await $fetch<{
      success: boolean
      status: number
      message: string
      data: {
        member1: Array<{
          id: number
          title: string
          fullName: string
          photo: string
          isStillLive: boolean
          parent: any
        }>
        member2: Array<{
          id: number
          title: string
          fullName: string
          photo: string
          isStillLive: boolean
          parent: any
        }>
        commonAncestor: {
          id: number
          title: string
          fullName: string
          photo: string
          isStillLive: boolean
          parent: any
        }
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
    console.error('Error fetching common ancestor:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch common ancestor'
    })
  }
})

