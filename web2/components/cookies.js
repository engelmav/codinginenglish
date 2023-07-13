"use client";
import { useState, useEffect } from "react";
import tw from "twin.macro";
import Link from "next/link";

const CIE_COOKIE_CONSENT = "com.codinginenglish.cookie_consent";
export default function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useState(false);

  useEffect(() => {
    const storedCookieConsent = getLocalStorage(CIE_COOKIE_CONSENT, null);
    console.log("storedCookieConsent: ", storedCookieConsent);

    setCookieConsent(storedCookieConsent);
  }, [setCookieConsent]);
  useEffect(() => {
    const newValue = cookieConsent ? "granted" : "denied";

    window.gtag("consent", "update", {
      analytics_storage: newValue,
    });

    setLocalStorage(CIE_COOKIE_CONSENT, cookieConsent);

    //For Testing
    console.log("Cookie Consent: ", cookieConsent);
  }, [cookieConsent]);
  if (cookieConsent !== null) return null;
  return (
    <div
      tw={
        "my-10 mx-auto max-w-max md:max-w-screen-sm fixed bottom-0 left-0 right-0 flex px-3 md:px-4 py-3 justify-between items-center flex-col sm:flex-row gap-4 bg-gray-700 rounded-lg shadow"
      }
    >
      <div tw="text-center">
        <Link href="/privacy-policy">
          <p tw="text-white">
            We use <span tw="font-bold text-sky-400">cookies</span> on our site.
          </p>
        </Link>
      </div>

      <div tw="flex gap-2">
        <button
          tw="px-5 py-2 text-gray-300 rounded-md border-gray-900"
          onClick={() => setCookieConsent(false)}
        >
          Decline
        </button>
        <button
          tw="bg-gray-900 px-5 py-2 text-white rounded-lg"
          onClick={() => setCookieConsent(true)}
        >
          Allow Cookies
        </button>
      </div>
    </div>
  );
}

function getLocalStorage(key, defaultValue) {
  const stickyValue = localStorage.getItem(key);

  return stickyValue !== null && stickyValue !== "undefined"
    ? JSON.parse(stickyValue)
    : defaultValue;
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
