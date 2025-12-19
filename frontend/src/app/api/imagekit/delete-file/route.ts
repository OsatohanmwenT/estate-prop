// app/api/imagekit/deleteFile/route.ts

import ImageKit from "imagekit"; // Use the core server SDK for deletion
import { NextResponse, NextRequest } from "next/server";
import { APP_CONFIG } from "~/config"; // Assuming your config path is correct

// Instantiate the server-side SDK
const imagekitServer = new ImageKit({
  publicKey: APP_CONFIG.IMAGEKIT.PUBLIC_KEY,
  privateKey: APP_CONFIG.IMAGEKIT.PRIVATE_KEY,
  urlEndpoint: APP_CONFIG.IMAGEKIT.URL_ENDPOINT,
});

async function handleDelete(req: NextRequest) {
  try {
    const body = await req.json();
    const fileId = typeof body?.fileId === "string" ? body.fileId.trim() : "";

    if (!fileId) {
      return NextResponse.json(
        { success: false, message: "Missing fileId" },
        { status: 400 }
      );
    }

    await imagekitServer.deleteFile(fileId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    const message = error?.message || "Internal Server Error during deletion";
    console.error("ImageKit deletion error:", error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return handleDelete(req as NextRequest);
}

export async function DELETE(req: NextRequest) {
  return handleDelete(req);
}
