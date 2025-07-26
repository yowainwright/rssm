import { z } from 'zod';
import { createRssm } from 'rssm';

// Schema for sensitive user data
const sensitiveDataSchema = z.object({
  userId: z.string(),
  ssn: z.string(),
  creditCard: z.object({
    number: z.string(),
    cvv: z.string(),
    expiry: z.string(),
  }),
});

type SensitiveData = z.infer<typeof sensitiveDataSchema>;

// Create encrypted state machine
const { RssmProvider, useRssm } = createRssm<SensitiveData>('sensitive');

// Usage with encryption enabled
export function SecureDataProvider({ children }: { children: React.ReactNode }) {
  return (
    <RssmProvider
      schema={sensitiveDataSchema}
      name="sensitive"
      encrypt={true}  // Enable encryption
      persist={true}
      logging={false} // Disable logging for sensitive data
    >
      {children}
    </RssmProvider>
  );
}