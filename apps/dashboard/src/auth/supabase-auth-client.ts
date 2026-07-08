import {
  createClient,
  type AuthChangeEvent,
  type Session,
  type SupabaseClient,
} from "@supabase/supabase-js";
import type { ProviderAuthModeConfig } from "./auth-config";

export type AuthSession = {
  accessToken: string;
  userId: string;
  email: string | null;
};

export type LoginInput = {
  email: string;
  password: string;
};

export interface DashboardAuthClient {
  getSession(): Promise<AuthSession | null>;
  signIn(input: LoginInput): Promise<void>;
  signOut(): Promise<void>;
  subscribe(
    listener: (session: AuthSession | null, event: AuthChangeEvent) => void,
  ): () => void;
}

function toAuthSession(session: Session | null): AuthSession | null {
  const accessToken = session?.access_token?.trim();

  if (!session || !accessToken) {
    return null;
  }

  return {
    accessToken,
    userId: session.user.id,
    email: session.user.email ?? null,
  };
}

function createSupabaseBrowserClient(
  config: ProviderAuthModeConfig,
): SupabaseClient {
  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export class SupabaseAuthClient implements DashboardAuthClient {
  private readonly client: SupabaseClient;

  constructor(
    config: ProviderAuthModeConfig,
    client: SupabaseClient = createSupabaseBrowserClient(config),
  ) {
    this.client = client;
  }

  async getSession(): Promise<AuthSession | null> {
    const { data, error } = await this.client.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    return toAuthSession(data.session);
  }

  async signIn(input: LoginInput): Promise<void> {
    const { error } = await this.client.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  }

  subscribe(
    listener: (session: AuthSession | null, event: AuthChangeEvent) => void,
  ): () => void {
    const {
      data: { subscription },
    } = this.client.auth.onAuthStateChange((event, session) => {
      listener(toAuthSession(session), event);
    });

    return () => {
      subscription.unsubscribe();
    };
  }
}
