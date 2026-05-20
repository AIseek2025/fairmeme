import { UploadFile as UF } from 'antd';

declare global {
    type UploadFile<T = unknown> = UF<T>;

    interface Window {
        Datafeeds: {
            UDFCompatibleDatafeed: Datafeeds.UDFCompatibleDatafeed;
        };
    }
}

export {};
