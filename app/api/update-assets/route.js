import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      assetId,
      title,
      filename,
      modelName,
      modelCode,
      altText,
      brand,
      description,
      assetType,
    } = body;

    // Validate required field
    if (!assetId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing assetId" }),
        { status: 400 }
      );
    }

    // Get API credentials from environment variables
    const apiSecret = process.env.API_SECRET;
    const subscriptionKey = process.env.PRIMARY_SUBSCRIPTION_KEY;

    // Build array of updates
    const patchData = [];

    // Title - basic field
    if (title !== undefined && title !== null && title !== "") {
      patchData.push({ 
        op: "replace", 
        path: "/title", 
        value: title 
      });
    }

    // Filename - basic field
    if (filename !== undefined && filename !== null && filename !== "") {
      patchData.push({ 
        op: "replace", 
        path: "/filename", 
        value: filename 
      });
    }

    // Model Name - custom attribute
    if (modelName !== undefined && modelName !== null && modelName !== "") {
      patchData.push({
        op: "replace",
        path: "/attributes/115a5cf5-4be4-40ee-b1e0-1da0cb814d61",
        value: modelName,
      });
    }

    // Model Code - custom attribute
    if (modelCode !== undefined && modelCode !== null && modelCode !== "") {
      patchData.push({
        op: "replace",
        path: "/attributes/36c5fd35-a75b-49ba-85b7-981c6de4c42e",
        value: modelCode,
      });
    }

    // Alt Text - basic field
    if (altText !== undefined && altText !== null && altText !== "") {
      patchData.push({ 
        op: "replace", 
        path: "/altText", 
        value: altText 
      });
    }

    // Brand - custom attribute
    if (brand !== undefined && brand !== null && brand !== "") {
      patchData.push({
        op: "replace",
        path: "/attributes/536af291-fe5e-4cd2-82c7-bde871b7c5bd",
        value: brand,
      });
    }

    // Description - basic field
    if (description !== undefined && description !== null && description !== "") {
      patchData.push({ 
        op: "replace", 
        path: "/description", 
        value: description 
      });
    }

    // Asset Type - custom attribute
    if (assetType !== undefined && assetType !== null && assetType !== "") {
      patchData.push({
        op: "replace",
        path: "/attributes/62e56442-1a48-443d-8fc7-513e4cf7d69e",
        value: assetType,
      });
    }

    // Check if there's anything to update
    if (patchData.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No update fields provided",
          assetId,
        }),
        { status: 400 }
      );
    }

    // Make the API request to MediaValet
    const response = await axios.patch(
      `https://api.mediavalet.com/assets/${assetId}`,
      patchData,
      {
        headers: {
          "x-mv-api-version": "1.2",
          Authorization: `Bearer ${apiSecret}`,
          "Ocp-Apim-Subscription-Key": subscriptionKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // Log success
    console.log(`✅ Asset ${assetId} updated → ${JSON.stringify(patchData)}`);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        data: response.data,
        assetId,
        updatedFields: patchData.length,
      }),
      { status: 200 }
    );
  } catch (error) {
    // Log error
    console.error("❌ Update error:", error.response?.data || error.message);

    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        error: error.response?.data || error.message,
        assetId: body?.assetId,
      }),
      { status: 500 }
    );
  }
}