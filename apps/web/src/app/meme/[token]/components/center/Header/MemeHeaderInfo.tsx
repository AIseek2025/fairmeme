'use client';
import HeaderCollect from './HeaderCollect';
import HeaderData from './HeaderData';

const MemeHeaderInfo = () => {
    return (
        <section className="customScrollbar w-full overflow-x-auto bg-nav-bgc">
            <div className="flex items-center justify-between gap-4 text-nowrap p-3 px-4">
                <HeaderCollect />
                <HeaderData />
            </div>
        </section>
    );
};
export default MemeHeaderInfo;
