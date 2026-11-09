import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const out: Record<string, unknown> = {
    urlDefined: url.length > 0,
    urlHost: (() => {
      try {
        return new URL(url.trim()).host;
      } catch {
        return "INVALID_URL";
      }
    })(),
    urlHasWhitespaceOrQuote: /\s|["']/.test(url),
    urlEndsWithSlash: url.endsWith("/"),
    keyDefined: key.length > 0,
    keyLength: key.length,
    keyPrefix: key.slice(0, 15),
    keyHasWhitespaceOrQuote: /\s|["']/.test(key),
  };

  try {
    const r = await fetch(`${url.trim()}/auth/v1/health`, {
      headers: { apikey: key.trim() },
    });
    out.authHealthStatus = r.status;
  } catch (e) {
    out.authHealthStatus = "FETCH_FAILED: " + String(e);
  }

  const supabase = await createClient();
  const { data, error, status } = await supabase
    .from("restaurants")
    .select("id, name")
    .eq("slug", "cafe-test");

  out.restaurantsStatus = status;
  out.restaurantsCount = data?.length ?? null;
  out.restaurantsError = error
    ? { code: error.code, message: error.message }
    : null;

  return NextResponse.json(out);
}