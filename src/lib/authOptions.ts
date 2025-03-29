// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { compare } from "bcrypt";
// import { db } from "@/db";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(db),
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/login",
//   },
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           console.log("No email or password provided");
//           return null;
//         }

//         try {
//           const existingUser = await db.user.findUnique({
//             where: { email: credentials.email },
//           });

//           if (!existingUser) {
//             console.log("User not found");
//             return null;
//           }

//           const passwordMatch =
//             existingUser.password && (await compare(credentials.password, existingUser.password));

//           if (!passwordMatch) {
//             console.log("Incorrect password or password not set");
//             return null;
//           }


//           return {
//             id: existingUser.id.toString(),
//             name: existingUser.name,
//             email: existingUser.email,
//             role: existingUser.role,
//           };
//         } catch (error) {
//           console.error("Error during authorization:", error);
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       if (token) {
//         session.user = {
//           id: token.id as string,
//           name: token.name as string || "User",
//           email: token.email as string,
//           role: token.role as string,
//         };
//       }
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//         token.email = user.email;
//         token.role = user.role;
//       }
//       return token;
//     },
//   },
// };
