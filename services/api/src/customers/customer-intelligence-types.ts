import type { AuthContext } from "../auth/auth-context";
import type { CustomerProfileIntelligenceDto } from "./customer-intelligence-dto";

export type GetCustomerProfileIntelligenceInput = {
  auth: AuthContext;
  customerId: string;
};

export type GetCustomerProfileIntelligenceResult =
  CustomerProfileIntelligenceDto;
