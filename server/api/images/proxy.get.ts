export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const imageUrl = query.url as string;

  if (!imageUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image URL is required",
    });
  }

  try {
    // Fetch the image from the external URL (server-side, no CORS issues)
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Failed to fetch image: ${response.statusText}`,
      });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/png";

    // Set appropriate headers
    setHeader(event, "Content-Type", contentType);
    setHeader(event, "Cache-Control", "public, max-age=31536000, immutable");

    // Return the image buffer
    return Buffer.from(imageBuffer);
  } catch (error: any) {
    console.error("Error proxying image:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Failed to proxy image",
    });
  }
});

