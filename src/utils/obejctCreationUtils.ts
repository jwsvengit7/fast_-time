import {UserServices} from "../controllers/implementation/UserService";
import { UserVerification } from "../controllers/implementation/UserVerificationService";

const userCreation:any = new UserServices();
const userVerification:any = new UserVerification();

export {
    userCreation ,userVerification
}
