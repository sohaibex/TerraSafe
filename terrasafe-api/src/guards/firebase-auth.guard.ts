import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FirebaseService } from "../modules/user/services/firebase.service";

@Injectable()
export class FirebaseAuthGuard extends AuthGuard("jwt") {

  constructor(private readonly firebaseService: FirebaseService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Log the full Authorization header
    console.log("Authorization Header:", request.headers.authorization);

    const token = request.headers.authorization?.split(" ")[1];

    // Log the parsed token
    console.log("Parsed Token:", token);

    try {
      const user = await this.firebaseService.verifyToken(token);

      // Log the user object returned from the Firebase service
      console.log("User from Firebase:", user);

      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid Firebase token.");
    }
  }
}
