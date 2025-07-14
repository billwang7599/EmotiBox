// user.model.ts
export interface User {
  userid: string;
  teamleadid?: string | null; // Nullable
  // You may also model relations if needed, for example:
  // teamlead?: User | null;
  // teamMembers?: User[];
  // messages?: Message[];
}