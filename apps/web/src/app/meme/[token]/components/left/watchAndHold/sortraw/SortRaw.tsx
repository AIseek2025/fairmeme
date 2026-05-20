import { safeMergeClassName } from '@/utils/common';
import { useSafeState } from 'ahooks';
import React from 'react';

type SortStatus = 'nosort' | 'asc' | 'desc';
type FilterProps = {
    field: string;
    sortStatus: SortStatus;
};
type SortProps = {
    field: string;
    sortStatus: SortStatus;
    active: boolean;
    onSort: () => void;
};
const Sort = ({ field, sortStatus, active, onSort }: SortProps) => {
    return (
        <div className="flex cursor-pointer items-center text-grey-blue" onClick={onSort}>
            <span className={safeMergeClassName({ 'text-[#fff]': active && sortStatus !== 'nosort' })}>{field}</span>
            <div className="ml-[8px] flex flex-col items-center justify-center">
                <i
                    className={safeMergeClassName('pi-sort-up-fill pi text-[9px] text-[#7A89A2]', {
                        'text-[#fff]': sortStatus === 'asc',
                    })}
                ></i>
                <i
                    className={safeMergeClassName('pi-sort-down-fill pi text-[9px] text-[#7A89A2]', {
                        'text-[#fff]': sortStatus === 'desc',
                    })}
                ></i>
            </div>
        </div>
    );
};
function SortRaw<T extends { id: number }>({
    data,
    renderItem,
    sorts,
    dataContainerClassName,
}: {
    data: T[];
    renderItem: (item: T) => React.ReactNode;
    sorts: {
        key: string;
        label: string;
        className?: string;
    }[];
    dataContainerClassName?: string;
}) {
    const [filter, setFilter] = useSafeState<FilterProps>({
        field: '',
        sortStatus: 'nosort',
    });

    const handleSort = (field: string) => {
        setFilter((state) => {
            if (state.field !== field) {
                return { field, sortStatus: 'asc' };
            }
            const newSortStatus: SortStatus = (() => {
                switch (state.sortStatus) {
                    case 'nosort':
                        return 'asc';
                    case 'asc':
                        return 'desc';
                    case 'desc':
                        return 'nosort';
                    default:
                        return 'nosort';
                }
            })();
            return { ...state, field, sortStatus: newSortStatus };
        });
    };
    return (
        <>
            <div className="flex justify-between gap-4 py-3">
                {sorts.map((sortItem) => {
                    return (
                        <div className={sortItem.className} key={sortItem.key}>
                            <Sort
                                field={sortItem.label}
                                active={filter.field === sortItem.label}
                                sortStatus={filter.field === sortItem.label ? filter.sortStatus : 'nosort'}
                                onSort={() => handleSort(sortItem.label)}
                            />
                        </div>
                    );
                })}
            </div>
            <div className={dataContainerClassName}>{data.map(renderItem)}</div>
        </>
    );
}

export default SortRaw;
