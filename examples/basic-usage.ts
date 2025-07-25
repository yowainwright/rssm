import { z } from 'zod';
import { createRSSSM } from 'rsssm';

// Define your schema
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().positive(),
});

type User = z.infer<typeof userSchema>;

// Create the state machine
const { RSSMProvider, useRSSSM } = createRSSSM<User>('userState');

// Export for use in your app
export { RSSMProvider as UserProvider, useRSSSM as useUser };