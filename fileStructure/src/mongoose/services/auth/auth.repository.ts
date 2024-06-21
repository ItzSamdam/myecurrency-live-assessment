import User from '../../models/user';
import { ICreateUser } from './auth.interface';

class AuthRepository {
    
    async findUserByEmail(email: string) {
        return await User.findOne({ email });
    }

    async createUser(user: ICreateUser) {
        return await User.create(user);
    }

    async findUserById(id: string) {
        return await User.findById(id);
    }

    async getUserProfile(id: string) {
        return await User.findById(id).populate('profile');
    }

}

export default AuthRepository;