import TwitterProvider from 'next-auth/providers/twitter';

const useSecureCookies = process.env.NODE_ENV === 'production';

export const authOptions = {
    session: { strategy: 'jwt' },
    providers: [
        TwitterProvider({
            clientId: process.env.TWITTER_ID,
            clientSecret: process.env.TWITTER_SECRET,
            client: {
                httpOptions: {
                    timeout: 20000,
                },
            },
            version: '2.0',
            authorization: {
                params: {
                    scope: 'tweet.read users.read follows.read offline.access',
                },
            },
            profile(profile) {
                return {
                    id: profile.data.id,
                    name: profile.data.name,
                    screen_name: profile.data.username,
                    image: profile.data.profile_image_url,
                };
            },
        }),
    ],
    cookies: {
        sessionToken: {
            name: useSecureCookies ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'Lax',
                path: '/',
                secure: useSecureCookies,
            },
        },
    },
    secret: process.env.AUTH_SECRET,
    debug: process.env.NODE_ENV !== 'production',
    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token;
                token.sub = account.providerAccountId;
            }
            if (user) {
                token.user = { ...user };
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                ...token.user,
                id: token?.sub,
            };
            return session;
        },
    },
};
