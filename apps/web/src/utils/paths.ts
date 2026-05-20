export const paths = {
    home: '/',
    swap: '/swap',
    airdrop: '/airdrop',
    myAirdrop: '/myAirdrop',
    memeCreate: '/memeCreate',
    create: '/create',
    square: '/square',
    profile: (memberName?: string) => {
        return `/square/profile/${memberName}`;
    },
    memeInfo: (address: string) => {
        return `/meme/${address}`;
    },
};
