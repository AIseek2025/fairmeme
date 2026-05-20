'use client';

import { ConfigProvider, Segmented, type SegmentedProps, Tabs, type TabsProps } from 'antd';
import { memo, useMemo } from 'react';

export interface SegmentedTabsProps extends Omit<TabsProps, 'onTabClick' | 'renderTabBar' | 'items'> {
    items: NonNullable<TabsProps['items']>;
}

export const SegmentedTabs = memo(function SegmentedTabs({ items, ...restProps }: SegmentedTabsProps) {
    const segmentOptions: SegmentedProps<string>['options'] = useMemo(
        () =>
            items.map((tabItem) => ({
                ...tabItem,
                label: tabItem.label,
                value: tabItem.key,
            })),
        [items],
    );

    const renderTabBar: TabsProps['renderTabBar'] = (props) => {
        return (
            <Segmented
                block
                value={props.activeKey}
                onChange={(key) => props.onTabClick(key, {} as any)}
                options={segmentOptions}
                className="mx-auto mb-4 w-[60%]"
            />
        );
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Segmented: {
                        itemSelectedBg: '#FFD41A',
                        itemSelectedColor: '#181A20',
                    },
                },
            }}
        >
            <Tabs {...restProps} items={items} renderTabBar={renderTabBar} />
        </ConfigProvider>
    );
});
