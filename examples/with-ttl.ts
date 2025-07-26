import { z } from 'zod';
import { createRssm } from 'rssm';

// Schema for session data
const sessionSchema = z.object({
  token: z.string(),
  userId: z.string(),
  permissions: z.array(z.string()),
  lastActivity: z.string(),
});

type Session = z.infer<typeof sessionSchema>;

// Create state machine with TTL
const { RssmProvider, useRssm } = createRssm<Session>('session');

// Usage with 1-hour TTL
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <RssmProvider
      schema={sessionSchema}
      name="session"
      persist={true}
      ttl={3600} // 1 hour in seconds
      encrypt={true} // Encrypt session data
    >
      {children}
    </RssmProvider>
  );
}

// Hook to use in components
export const useSession = useRssm;