const abi = [
    {
        type: 'constructor',
        inputs: [
            {
                name: '_sablierNFT',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'createFairMemeMarket',
        inputs: [
            {
                name: 'name',
                type: 'string',
                internalType: 'string',
            },
            {
                name: 'symbol',
                type: 'string',
                internalType: 'string',
            },
            {
                name: 'devAddress',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'devPercent',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'auctionPrice',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'auctionTime',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [
            {
                name: 'token',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'market',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        name: 'owner',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'ownerWithdrawEth',
        inputs: [],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'renounceOwnership',
        inputs: [],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'sablierNFT',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'transferOwnership',
        inputs: [
            {
                name: 'newOwner',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'event',
        name: 'OwnershipTransferred',
        inputs: [
            {
                name: 'previousOwner',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'newOwner',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
] as const;
export default abi;
