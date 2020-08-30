// utils/ tokens.ts
import { sign, Secret } from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as Secret;
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET as Secret;

export const generateAccessToken = (userId: number) => {
  return sign({ userId }, ACCESS_SECRET, { expiresIn: "30min" });
};

export const generateRefreshToken = (userId: number) => {
  return sign({ userId }, REFRESH_SECRET, { expiresIn: "10 days" });
};