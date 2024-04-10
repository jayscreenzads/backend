import { z } from "zod";

const ROLE = ["ADMIN", "AGENT_DRIVER", "AGENT", "ADVERTISER"] as const;

export const SignUpSchema = z.object({
  firstName: z.string(),
  middleName: z.string().nullable(),
  lastName: z.string(),
  suffixName: z.string().nullable(),
  dateOfBirth: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string().nullable(),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  role: z.enum(ROLE),
});
