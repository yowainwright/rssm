import { z } from "zod";
import { createRssm } from "rssm";

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
const { RssmProvider, useRssm } = createRssm<SensitiveData>("sensitive");

// Hook to use in components
export const useSensitiveData = useRssm;

// Usage with encryption enabled
export function SecureDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RssmProvider
      schema={sensitiveDataSchema}
      name="sensitive"
      encrypt={true}
      persist={true}
      logging={false}
    >
      {children}
    </RssmProvider>
  );
}
