import { Strategy } from "passport";
// @ts-ignore
import passport from "passport";

/**
 * Abstract class representing an authenticator strategy.
 */
export abstract class AbstractAuthenticator {
    /**
     * Returns the authentication strategy.
     * @returns The authentication strategy.
     */
    abstract getStrategy(): Strategy;
}
export default passport;