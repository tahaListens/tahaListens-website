"use client";

import { BrowserOAuthClient } from "@atproto/oauth-client-browser";
import { useEffect, useState, useRef } from "react";

export default function LoginButton() {
  const [session, setSession] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const clientRef = useRef<BrowserOAuthClient>();

  // Updated NGROK URL for testing environment
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;
  const handleResolver = "https://bsky.social/xrpc/com.atproto.identity.resolveHandle";

  useEffect(() => {
    const setupOAuth = async () => {
      try {
        // Initialize the client for NGROK testing environment
        const client = new BrowserOAuthClient({
          clientId,
          handleResolver, // Bluesky default resolver
        });

        await client.init();
        clientRef.current = client;
        setIsReady(true);

        // Restore session with the updated method
        const restoredSession = await client.restore(client.getSession()?.sub);
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
      // Sign-in using a valid handle (adjust this to test different users)
      await clientRef.current.signIn("tahabot.bsky.social", {
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
