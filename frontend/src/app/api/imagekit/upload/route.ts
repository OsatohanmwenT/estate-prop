import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { APP_CONFIG } from "~/config";

export async function POST(request: NextRequest) {
  try {
    // Validate configuration
    if (
      !APP_CONFIG.IMAGEKIT.PUBLIC_KEY ||
      !APP_CONFIG.IMAGEKIT.PRIVATE_KEY ||
      !APP_CONFIG.IMAGEKIT.URL_ENDPOINT
    ) {
      console.error("Missing ImageKit configuration");
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }

    const imagekit = new ImageKit({
      publicKey: APP_CONFIG.IMAGEKIT.PUBLIC_KEY,
      privateKey: APP_CONFIG.IMAGEKIT.PRIVATE_KEY,
      urlEndpoint: APP_CONFIG.IMAGEKIT.URL_ENDPOINT,
    });

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();

    const response = await imagekit.upload({
      file: Buffer.from(buffer),
      fileName: file.name,
    });

    return NextResponse.json({
      fileId: response.fileId,
      url: response.url,
      name: response.name,
    });
  } catch (error) {
    console.log(error)
    console.error(
      "ImageKit upload error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
