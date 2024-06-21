import AuthRepository from "./auth.repository";
import { comparePassword } from "../../config/globalSecure.config";
import BadRequestException from "../../exceptions/BadRequestException";
import NotFoundException from "../../exceptions/NotFoundException";
import { IUserLogin } from "./auth.interface";
import { generateAuthToken } from "../../middlewares/jwt/generateAuthToken";
import { excludeGlobal } from "../../utils/misc.utils";

class AuthService {
    private readonly _authRepository: AuthRepository;

    constructor() {
        this._authRepository = new AuthRepository();
    }

    async findUserByEmail(email: string) {
        return await this._authRepository.findUserByEmail(email);
    }

    async loginUser(data: IUserLogin) {
        const user = await this.findUserByEmail(data.email);
        if (!user) {
            throw new NotFoundException('No user found with this email')
        }
        const isMatch = await comparePassword(data.password, user.password);
        if (!isMatch) {
            throw new BadRequestException('Invalid email or password')
        }
        //generate tokens and remove password
        const token = await generateAuthToken(user.id);
        //remove password from user object
        let existingUser = excludeGlobal(user, ['password']);
        return {
            user: existingUser,
            token
        }
    }
}

export default AuthService;