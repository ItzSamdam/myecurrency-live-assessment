import { Strategy, Profile } from "passport-google-oauth20";
import { AbstractAuthenticator } from "./abstract.strategy";
import { config } from "../../config/config.config";

/**
 * Authenticator class for Google authentication strategy.
 */
class GoogleAuthenticator extends AbstractAuthenticator {
    getStrategy(): Strategy {
        return new Strategy(
            {
                clientID: config.google.clientID,
                clientSecret: config.google.clientSecret,
                callbackURL: config.google.callbackURL,
            },
            (accessToken: string, refreshToken: string, profile: Profile, done: Function) => {
                // You can customize the user creation and retrieval logic here
                const user = {
                    id: profile.id,
                    displayName: profile.displayName,
                    provider: "google",
                    //@ts-ignore
                    email: profile?.emails[0].value
                };
                return done(null, user);
            }
        );
    }
}

export default GoogleAuthenticator;