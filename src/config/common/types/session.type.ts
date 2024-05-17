
export class Session {
  sessionId: string;
  userId: string;
  email: string;
  refreshToken: {
    token: string;
    expireAt: Date;
  };
  deviceToken: string;
  firstName?: string;
  lastName?: string;
  blocked:boolean;
}
