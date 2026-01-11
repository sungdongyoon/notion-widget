// import { cookies } from "next/headers";

import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const SUPPORTED = ["ko", "en"] as const;
type Locale = (typeof SUPPORTED)[number];

export default getRequestConfig(async () => {
  const store = await cookies();
  const fromCookie = store.get("locale")?.value;

  const locale: Locale =
    fromCookie === "ko" || fromCookie === "en" ? fromCookie : "ko";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
