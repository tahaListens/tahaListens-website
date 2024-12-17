"use client";

import { BrowserOAuthClient } from "@atproto/oauth-client-browser";
import { useEffect, useState, useRef } from "react";

export default function LoginButton() {
  const [session, setSession] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const clientRef = useRef<BrowserOAuthClient>();

  const clientId = "https://a795-96-10-225-165.ngrok-free.app/client-metadata.json";
  const redirectUri = "https://a795-96-10-225-165.ngrok-free.app";
  const handleResolver = "https://tahabot.bsky.social"; // Default handle resolver

  useEffect(() => {
    const setupOAuth = async () => {
      try {
        const client = new BrowserOAuthClient({
          clientId,
          handleResolver, // Using Bluesky's resolver for now
        });

        await client.init();
        clientRef.current = client;
        setIsReady(true);

        const restoredSession = await client.restore(client.getLastSessionSub());
        if (restoredSession) {
          console.log("Restored session:", restoredSession);
          setSession(restoredSession);
        }
      } catch (error) {
        console.error("OAuth initialization failed:", error);
      }
    };

    setupOAuth();
  }, []);

  const handleSignIn = async () => {
    if (!clientRef.current) return;

    try {
      await clientRef.current.signIn("bsky.social", {
        state: "my-app-state",
      });
    } catch (error) {
      console.error("Sign-in failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {session ? (
        <p className="text-sm text-gray-600">
          Signed in as: {session.sub}
        </p>
      ) : isReady ? (
        <button
          onClick={handleSignIn}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sign in with Bluesky
        </button>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
