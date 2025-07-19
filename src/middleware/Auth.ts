import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "./catchAsyncErrors";
import admin from "@src/config/firebaseAdmin";

declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

const tokenExtractor = (req: Request): string | null => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

export const isAuthenticated = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = tokenExtractor(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  }
);
