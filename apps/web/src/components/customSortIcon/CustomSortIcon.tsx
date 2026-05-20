import { safeMergeClassName } from '@/utils/common';
import { SortOrder } from 'primereact/datatable';

const CustomSortIcon = ({ sortOrder, sorted }: { sortOrder?: SortOrder; sorted?: boolean }) => {
    return (
        <div className="flex h-[26px] cursor-pointer items-center">
            <div className="flex h-full items-center">
                <div className="ml-[8px] flex flex-col items-center justify-center">
                    <i
                        className={safeMergeClassName('pi-sort-up-fill pi text-[9px] text-[#7A89A2]', {
                            'text-[#fff]': sortOrder === 1,
                        })}
                    ></i>
                    <i
                        className={safeMergeClassName('pi-sort-down-fill pi text-[9px] text-[#7A89A2]', {
                            'text-[#fff]': sortOrder === -1,
                        })}
                    ></i>
                </div>
            </div>
        </div>
    );
};
export default CustomSortIcon;
