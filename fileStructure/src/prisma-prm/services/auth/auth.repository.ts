import { prisma } from '../../utils/misc.utils';
import { ICreateUser } from './auth.interface';

class AuthRepository {
    
    async findUserByEmail(email: string) {
        return await prisma.user.findUnique({
            where: {
                email
            }
        });
    }

    async createUser(user: ICreateUser) {
        return await prisma.user.create({
            data: {
                email: user.email,
                password: user.password,
                username: user.username,
                profile: {
                    create: {
                        bio: user.username || 'I am a new user',
                    }
                }
            }
        });
    }

    async findUserById(id: string) {
        return await prisma.user.findUnique({
            where: {
                id
            }
        });
    }

    async getUserProfile(id: string) {
        return await prisma.profile.findUnique({
            where: {
                userId: id
            },
            include: {
                user: true
            }
        });
    }

}

export default AuthRepository;