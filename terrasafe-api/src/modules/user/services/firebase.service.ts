import { Inject, Injectable } from "@nestjs/common";
import { FirebaseRepository } from "../repositories/firebase.repository";
import { CreateUserDto } from "../dtos/user/create-user.request.dto";

@Injectable()
export class FirebaseService {

  constructor(
    @Inject(FirebaseRepository)
    private readonly firebaseRepository: FirebaseRepository
  ) {
  }

  async register(email: string, password: string, userDetails: CreateUserDto) {
    return await this.firebaseRepository.register(email, password, userDetails);
  }


  async signIn(email: string) {
    return await this.firebaseRepository.signIn(email);
  }

  async updatePassword(uid: string, newPassword: string) {
    return await this.firebaseRepository.updatePassword(uid, newPassword);
  }

  async getUserByFirebaseUid(firebaseUid: string) {
    return await this.firebaseRepository.getUserByFirebaseUid(firebaseUid);
  }

  async verifyToken(idToken: string) {
    return await this.firebaseRepository.verifyToken(idToken);
  }

  async emailVerified(uid: string): Promise<boolean> {
    return await this.firebaseRepository.emailVerified(uid);
  }


  async isUserExists(uid: string): Promise<boolean> {
    return await this.firebaseRepository.isUserExists(uid);
  }
}
