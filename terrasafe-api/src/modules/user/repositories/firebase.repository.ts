import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dtos/user/create-user.request.dto";
import * as admin from "firebase-admin";

@Injectable()
export class FirebaseRepository {

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {
  }

  async register(email: string, password: string, userDetails: CreateUserDto) {
    const firebaseUser = await admin.auth().createUser({ email, password });

    const userDto: CreateUserDto = {
      ...userDetails,
      firebaseUid: firebaseUser.uid
    };
    console.log("********************firebase user **************************", firebaseUser);
    await this.userService.create(userDto);
    // Send email verification
    const customToken = await admin.auth().createCustomToken(firebaseUser.uid);
    return { ...firebaseUser, customToken };
  }


  async signIn(email: string): Promise<admin.auth.UserRecord> {
    return await admin.auth().getUserByEmail(email);
  }

  async updatePassword(uid: string, newPassword: string) {
    return await admin.auth().updateUser(uid, { password: newPassword });
  }

  async getUserByFirebaseUid(firebaseUid: string) {
    return await this.userService.findUserByIdOrUid(firebaseUid);
  }

  async verifyToken(idToken: string) {
    return await admin.auth().verifyIdToken(idToken);
  }


  async emailVerified(uid: string): Promise<boolean> {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord.emailVerified;
  }


  async isUserExists(uid: string): Promise<boolean> {
    try {
      await admin.auth().getUser(uid);
      return true;
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        return false;
      }
      throw error;
    }
  }
}
