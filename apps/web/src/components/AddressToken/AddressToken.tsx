import { getAddressDisplayName } from '@/utils/common';
import { Flex, Typography } from 'antd';

interface PropsType {
    address?: string;
    copyable?: boolean;
    className?: string;
}

const AddressToken = ({ address = '', copyable = false, className }: PropsType) => {
    // const [api, contextHolder] = notification.useNotification();
    return (
        <Flex>
            <Typography.Text className={className} copyable={copyable && address ? { text: address } : false}>
                {getAddressDisplayName(address, 4)}
            </Typography.Text>
        </Flex>
    );
};

export default AddressToken;
