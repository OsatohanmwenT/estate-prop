import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";
import { APP_CONFIG } from "~/config";


export async function GET() {
  const authenticationParameters = getUploadAuthParams({
    publicKey: APP_CONFIG.IMAGEKIT.PUBLIC_KEY,
    privateKey: APP_CONFIG.IMAGEKIT.PRIVATE_KEY,
  });

  return NextResponse.json(authenticationParameters);
}
