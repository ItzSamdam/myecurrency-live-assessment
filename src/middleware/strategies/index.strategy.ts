import GoogleAuthenticator from "./google.strategy";
// @ts-ignore
import passport, { Passport } from "./abstract.strategy";
import {prisma} from "../../utils/misc.utils";

const googleAuthenticator = new GoogleAuthenticator();

// Configure passport with auth-strategies
passport.use(googleAuthenticator.getStrategy());

passport.serializeUser((user: any, done: Function) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done: Function) => {

    try {
        /**
         * Represents a user object.
         */
        const user = await prisma.user.findUnique({
            where: { id: id },
        });
        done(null, user);
    } catch (err) {
        done(err, null);
    } finally {

    }
});

export default passport;