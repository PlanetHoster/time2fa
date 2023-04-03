import { TimeBased } from "./time-based/time-based";

export const totp = () => {
  return new TimeBased();
};
