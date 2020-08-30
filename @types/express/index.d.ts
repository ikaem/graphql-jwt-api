declare global {
  namespace Express {
    interface Request {
      user: {
        userId: number,
        iat: number,
        exp: number
      } | null;
    }
  }
}

export {}

// declare namespace Express {
//   export interface Request {
//     user: string;
//   }
// }