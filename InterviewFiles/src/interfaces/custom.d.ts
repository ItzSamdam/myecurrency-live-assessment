// express-extensions.d.ts
declare namespace Express {
  interface Request {
    // @ts-ignore
    admin: {
      id: string;
      role: string | null;
    };

    // @ts-ignore
    user: {
      id: string;
    };
  }
}
