import { useEffect, useRef, useState } from 'react';

interface PropsType {
    tokenInfo?: GetTokenDetailInfo.Response;
}

// const UDF_URL = 'http://43.128.106.49:8081/api/v1';
const UDF_URL = '/api/v1';
const TradingViewChart: React.FC<PropsType> = (props) => {
    const { tokenInfo } = props;
    const [scriptLoaded, setScriptLoaded] = useState(false);
    /**
     * Used to store a reference to the chart container
     */
    const chartContainerRef = useRef<HTMLDivElement | null>(null);

    /**
     * Used to store a reference to the TradingView widget instance
     */
    const tvWidgetRef = useRef<TradingView.IChartingLibraryWidget | null>(null);

    useEffect(() => {
        /* Create a <script> element and set its src attribute to the path of the TradingView charting library */
        const script = document.createElement('script');
        script.src = '/tradingView/charting_library/charting_library.standalone.js';
        script.async = true;

        const datafeedScript = document.createElement('script');
        datafeedScript.src = '/tradingView/datafeeds/udf/dist/bundle.js';
        datafeedScript.async = true;

        /* Execute when the script is loaded */
        const onScriptsLoad = () => {
            setScriptLoaded(true);
        };

        script.onload = () => {
            document.body.appendChild(datafeedScript);
        };

        datafeedScript.onload = onScriptsLoad;

        /* Append the script element to the document.body to trigger loading */
        document.body.appendChild(script);

        return () => {
            /* Remove the widget if the TradingView widget instance exists */
            if (tvWidgetRef.current !== null) {
                tvWidgetRef.current.remove();
                tvWidgetRef.current = null;
                // Remove the loaded scripts from document.body
                document.body.removeChild(script);
                document.body.removeChild(datafeedScript);
            }
        };
    }, []);

    useEffect(() => {
        if (chartContainerRef.current && scriptLoaded && tokenInfo?.token.tokenTicker) {
            const datafeed = new (window as any).Datafeeds.UDFCompatibleDatafeed(UDF_URL);
            const widgetOptions: TradingView.ChartingLibraryWidgetOptions = {
                autosize: true,
                width: chartContainerRef.current?.clientWidth,
                height: chartContainerRef.current?.clientHeight,
                symbol: tokenInfo.token.id.toString(),
                interval: '60' as TradingView.ResolutionString,
                // interval: '1' as TradingView.ResolutionString,
                container: chartContainerRef.current.id,
                datafeed: datafeed,
                library_path: '/tradingView/charting_library/',
                locale: 'en',
                theme: 'dark',
                disabled_features: ['header_symbol_search', 'header_compare'],
            };

            /* Create and initialize the TradingView widget and store the instance reference */
            // eslint-disable-next-line new-cap
            tvWidgetRef.current = new (window as any).TradingView.widget(widgetOptions);
        }
    }, [scriptLoaded, tokenInfo]);
    if (!tokenInfo) {
        return <div className="h-full w-full bg-transparent"></div>;
    }
    return <div ref={chartContainerRef} id="desktop-chart" className="h-full w-full" />;
};

export default TradingViewChart;
