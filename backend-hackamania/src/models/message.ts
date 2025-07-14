export interface Message {
  messageid: number;
  timestamp: Date;
  message: string;
  userid: string;
  happiness: number;    // 0 to 1
  sadness: number;      // 0 to 1
  frustration: number;  // 0 to 1
  tiredness: number;    // 0 to 1
  // Optionally, the user relation:
  // user?: User;
}