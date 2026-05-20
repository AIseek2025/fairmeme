export const VOL_FILTER = [
    {
        label: 'Vol(24h)',
        value: 'vol24',
    },
    {
        label: 'Vol(12h)',
        value: 'vol12',
    },
    {
        label: 'Vol(6h)',
        value: 'vol6',
    },
    {
        label: 'Vol(1h)',
        value: 'vol1',
    },
];
export const CHANGE_FILTER = [
    {
        label: '24h %',
        value: 'change24',
    },
    {
        label: '12h %',
        value: 'change12',
    },
    {
        label: '6h %',
        value: 'change6',
    },
    {
        label: '1h %',
        value: 'change1',
    },
];
export const TURNOVER_FILTER = [
    {
        label: 'Turnover(24h)',
        value: 'turnover24',
    },
    {
        label: 'Turnover(12h)',
        value: 'turnover12',
    },
    {
        label: 'Turnover(6h)',
        value: 'turnover6',
    },
    {
        label: 'Turnover(1h)',
        value: 'turnover1',
    },
];
export const TXS_FILTER = [
    {
        label: 'TXs(24h)',
        value: 'txs24',
    },
    {
        label: 'TXs(12h)',
        value: 'txs12',
    },
    {
        label: 'TXs(6h)',
        value: 'txs6',
    },
    {
        label: 'TXs(1h)',
        value: 'txs1',
    },
];

export const SORT_LIST = [
    {
        label: 'Price',
        value: 'tokenPrice',
    },
    {
        label: 'Created',
        value: 'created',
    },
    {
        label: 'Mar.Cap',
        value: 'marketCap',
    },
    {
        label: 'FDMC',
        value: 'fdmc',
    },
    {
        label: 'Liquidity',
        value: 'tokenLiquidity',
    },
    ...VOL_FILTER.map((i) => ({ value: i.value, label: i.label })),
    ...CHANGE_FILTER.map((i) => ({ value: i.value, label: i.label })),
    ...TURNOVER_FILTER.map((i) => ({ value: i.value, label: i.label })),
    ...TXS_FILTER.map((i) => ({ value: i.value, label: i.label })),
    {
        label: 'Holders',
        value: 'holders',
    },
    {
        label: 'Watchers',
        value: 'watchers',
    },
    {
        label: 'Views(24h)',
        value: 'views',
    },
    {
        label: 'Auc.T',
        value: 'aucT',
    },
    {
        label: 'Auc.P',
        value: 'aucP',
    },
];
export const ORDER_LIST = [
    {
        key: 'Ascending',
        label: 'Ascending',
    },
    {
        key: 'Descending',
        label: 'Descending',
    },
];
