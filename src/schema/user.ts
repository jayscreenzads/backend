import { z } from "zod";

const ROLE = ["ADMIN", "AGENT_DRIVER", "AGENT", "ADVERTISER"] as const;

export const SignUpSchema = z.object({
  firstName: z.string(),
  middleName: z.string().nullable(),
  lastName: z.string(),
  suffixName: z.string().nullable(),
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
  role: z.enum(ROLE),
});
