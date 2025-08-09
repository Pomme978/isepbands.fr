import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "./prisma"; 

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),
    emailAndPassword: {
        enabled: true, 
    }, 

    trustedOrigins: [
    "http://localhost:3000",
    "https://nextjs--main--isepbands-web--pomme978--tk0bt2ansaois.pit-1.try.coder.app",
    "https://*.try.coder.app",
  ],
});