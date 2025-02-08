"use client";

import React, { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import Buddy from "@/components/Buddy";
import { Footer } from "./components/Footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [displayName, setDisplayName] = useLocalStorage<string | null>(
    "displayName",
    null
  );
  const [, setClientId] = useLocalStorage<string | null>("clientId", null);

  useEffect(() => {
    const name = localStorage.getItem("displayName");
    if (name) setDisplayName(name);
  }, [setDisplayName]);

  const handleClearCache = React.useCallback(() => {
    setDisplayName(null);
    setClientId(null);
    window.location.reload();
  }, [setDisplayName, setClientId]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-orange-600 to-black">
      <main className="flex max-h-screen w-full flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden">
          <Buddy />
        </div>

        <div className="absolute bottom-4 pb-4 text-center text-gray-600 text-sm z-50">
          <h3>
            You are discoverable as <span className="font-semibold">{displayName}</span>
          </h3>
          <p className="mt-2 text-blue-500">
            You can be discovered by everyone on this network
          </p>
        </div>
      </main>

      <Footer displayName={displayName} />

      <div className="fixed top-0 right-0 p-4 text-xs z-50">
        {process.env.NODE_ENV === "development" && (
          <Button variant="outline" size="sm" className="mr-3" onClick={handleClearCache}>
            Clear Cache
          </Button>
        )}
        <p className="text-gray-500 opacity-50">
          <span className="font-semibold">Better Alt</span> of
          <span className="text-blue-500"> Snapdrop.net</span>
        </p>
      </div>
    </div>
  );
}
