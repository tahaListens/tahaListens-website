import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { JoseKey } from "@atproto/jwk-jose";

let clientInstance: NodeOAuthClient | null = null;
const stateStore = new Map();
const sessionStore = new Map();

export async function getBlueskyClient() {
  if (clientInstance) return clientInstance;

  // Replace with your ngrok URL
  const BASE_URL = "https://b442-96-10-225-165.ngrok-free.app";

  clientInstance = new NodeOAuthClient({
    clientMetadata: {
      client_id: `${BASE_URL}/api/oauth/client-metadata.json`,
      client_name: "Your App Name",
      client_uri: BASE_URL,
      redirect_uris: [`${BASE_URL}/auth/callback`],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "private_key_jwt",
      token_endpoint_auth_signing_alg: "ES256",
      scope: "atproto",
      application_type: "web",
      dpop_bound_access_tokens: true,
      jwks_uri: `${BASE_URL}/api/oauth/jwks.json`
    },

    keyset: await Promise.all([
      JoseKey.fromImportable(process.env.PRIVATE_KEY_1),
      //JoseKey.fromImportable(process.env.PRIVATE_KEY_2),
      //JoseKey.fromImportable(process.env.PRIVATE_KEY_3),
    ]),

    stateStore: {
      async set(key: string, state: any) {
        stateStore.set(key, state);
      },
      async get(key: string) {
        return stateStore.get(key);
      },
      async del(key: string) {
        stateStore.delete(key);
      }
    },

    sessionStore: {
      async set(sub: string, session: any) {
        sessionStore.set(sub, session);
      },
      async get(sub: string) {
        return sessionStore.get(sub);
      },
      async del(sub: string) {
        sessionStore.delete(sub);
      }
    }
  });

  return clientInstance;
}