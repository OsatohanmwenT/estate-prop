import { NextResponse } from "next/server";
import ImageKit from "imagekit";
import { APP_CONFIG } from "~/config";

const imagekit = new ImageKit({
  publicKey: APP_CONFIG.IMAGEKIT.PUBLIC_KEY,
  privateKey: APP_CONFIG.IMAGEKIT.PRIVATE_KEY,
  urlEndpoint: APP_CONFIG.IMAGEKIT.URL_ENDPOINT,
});

export async function DELETE(request: Request) {
  try {
    const { fileId } = await request.json();

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    await imagekit.deleteFile(fileId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ImageKit delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
