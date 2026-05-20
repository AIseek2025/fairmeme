declare namespace Datafeeds {
    /**
     * Constructor for the UDFCompatibleDatafeed class.
     * @param datafeedURL The URL of the UDF data feed.
     * @param updateFrequency The update frequency for real-time data (in milliseconds).
     */
    type UDFCompatibleDatafeed = new (
        datafeedURL: string,
        updateFrequency?: number,
        limitedServerResponse?: {
            /**
             * Set this value to the maximum number of bars which
             * the data backend server can supply in a single response.
             * This doesn't affect or change the library behavior regarding
             * how many bars it will request. It just allows this Datafeed
             * implementation to correctly handle this situation.
             */
            maxResponseLength: number;
            /**
             * If the server can't return all the required bars in a single
             * response then `expectedOrder` specifies whether the server
             * will send the latest (newest) or earliest (older) data first.
             */
            expectedOrder: 'latestFirst' | 'earliestFirst';
        },
    ) => TradingView.ChartingLibraryWidgetOptions['datafeed'];
}
