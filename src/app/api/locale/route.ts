import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { locale } = (await req.json()) as { locale?: string };

  if (locale !== "ko" && locale !== "en") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("locale", locale, {
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 60 * 24 * 365,
  });

  return res;
}
