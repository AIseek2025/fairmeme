import { safeMergeClassName } from '@/utils/common';
import { InputText } from 'primereact/inputtext';
interface Props {
    keyword: string;
    setKeyword: (keyword: string) => void;
}
const Search = ({ keyword, setKeyword }: Props) => {
    return (
        <div className="p-inputgroup hidden max-w-[424px] rounded-[3px] border-[1px] border-solid border-[#34363D] bg-[#1E2028] lg:inline-flex">
            <span className="p-inputgroup-addon border-0 bg-transparent">
                <i className="pi pi-search text-[24px] text-[#fff]"></i>
            </span>
            <InputText
                pt={{
                    root: () => ({
                        className: safeMergeClassName('focus:shadow-none border-0 text-[#fff]'),
                    }),
                }}
                className="bg-transparent"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Token name/ticker/address"
            />
            <span className="p-inputgroup-addon cursor-pointer rounded-[3px] border-0 bg-[#FFD41A] text-[14px] font-bold text-[#000]">
                Search
            </span>
        </div>
    );
};
export default Search;
