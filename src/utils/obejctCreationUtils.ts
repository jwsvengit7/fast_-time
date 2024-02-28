import Authentication from "../controllers/implementation/UserAuthService";
import {UserServices} from "../controllers/implementation/UserService";
import { UserVerification } from "../controllers/implementation/UserVerificationService";

const userService:any = new UserServices();
const userVerification:any = new UserVerification();
const authService:any = new Authentication();

export {
    userService ,userVerification,authService
}
