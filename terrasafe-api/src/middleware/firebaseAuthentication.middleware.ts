// import { Injectable, NestMiddleware } from "@nestjs/common";
// import { NextFunction, Request, Response } from "express";
// import { FirebaseAdminService } from "../modules/user/services/firebase.service";
// import admin from "../config/firebase.admins";
//
// @Injectable()
// export class FirebaseAuthenticationMiddleware implements NestMiddleware {
//   constructor(private readonly firebaseService: FirebaseAdminService) {
//   }
//
//   async use(req: Request, res: Response, next: NextFunction) {
//     const token = req.headers.authorization?.split("Bearer ")[1];
//
//     if (!token) {
//       return res.status(403).json({ message: "No token provided." });
//     }
//
//     try {
//       req["user"] = await admin.auth().verifyIdToken(token);
//       next();
//     } catch (error) {
//       return res.status(403).json({ message: "Failed to authenticate token." });
//     }
//   }
// }
