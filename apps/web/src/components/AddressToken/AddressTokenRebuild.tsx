'use client';
import { useCopy } from '@/hooks/useCopy';
import { getAddressDisplayName, safeMergeClassName } from '@/utils/common';
interface PropsType {
    address?: string;
    copyable?: boolean;
    className?: string;
    addressClassName?: string;

    iconClassName?: string;
}
export const AddressTokenRebuild = ({
    address = '',
    copyable = false,
    className,
    addressClassName,
    iconClassName,
}: PropsType) => {
    const { copy } = useCopy();
    return (
        <div
            className={safeMergeClassName('gap-1 text-white flex-items-center hover:text-yellow', className)}
            onClick={() => {
                if (copyable) {
                    copy(address);
                    return;
                }
            }}
        >
            <p className={addressClassName}>{getAddressDisplayName(address, 4)}</p>
            {copyable && (
                <i
                    className={safeMergeClassName(
                        'pi pi-clone cursor-pointer text-base hover:text-yellow',
                        iconClassName,
                    )}
                ></i>
            )}
        </div>
    );
};
