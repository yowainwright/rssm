import { z } from 'zod';
import { createRssm } from 'rssm';

// Define your schema
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().positive(),
});

type User = z.infer<typeof userSchema>;

// Create the state machine
const { RssmProvider, useRssm } = createRssm<User>('userState');

// Export for use in your app
export { RssmProvider as UserProvider, useRssm as useUser };