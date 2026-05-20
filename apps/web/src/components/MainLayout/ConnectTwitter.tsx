import React, { useEffect } from 'react';
import { Button } from 'primereact/button';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useAsyncEffect, useMemoizedFn, useRequest } from 'ahooks';
import { membersPut } from '@/services/api/airdrop';

type Props = {};
const TwitterIcon = ({
    size = 16,
    color,
    className = '',
}: {
    size: string | number;
    color: string;
    className?: string;
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className={`${color} ${className}`}
        >
            <g clipPath="url(#clip0_333_211)">
                <path d="M12.6 0.800049H15.0667L9.73333 6.93338L16 15.2H11.0667L7.2 10.1334L2.8 15.2H0.333333L6.06667 8.66672L0 0.800049H5.06667L8.53333 5.40005L12.6 0.800049ZM11.7333 13.7334H13.0667L4.33333 2.13338H2.86667L11.7333 13.7334Z" />
            </g>
            <defs>
                <clipPath id="clip0_333_211">
                    <rect width={size} height={size} fill={color} />
                </clipPath>
            </defs>
        </svg>
    );
};

const ConnectTwitter = (props: Props) => {
    const { data: session } = useSession();

    const { data: membersPutRes, run: membersPutRun } = useRequest(membersPut, {
        manual: true,
    });

    useAsyncEffect(async () => {
        // console.log('x-session>>>', session);
        if (session?.user?.screen_name) {
            // await membersPutRun({
            //     memberName: session?.user?.screen_name,
            //     pictureUrl: session?.user?.image,
            // });
        }
    }, [session]);
    const xClick = useMemoizedFn(() => {
        if (session?.user?.screen_name) {
            signOut();
        } else {
            signIn('twitter');
        }
    });
    return (
        <Button
            onClick={() => xClick()}
            className="gap-2 rounded-md border-2 border-[#29313F] bg-transparent px-4 py-2.5 flex-center hover:bg-yellow hover:text-[#333]"
        >
            <span>{session?.user?.screen_name ? `@${session?.user?.screen_name}` : 'Connect'}</span>
            <TwitterIcon size={16} color="#fff" />
        </Button>
    );
};
export default ConnectTwitter;
