import AirdropCard from '../AirdropCard';
import Allocation from '../Allocation';
import TokenUtility from '../TokenUtility';
import AirdropTable from '../AirdropTable';

const AirdropTab = () => {
    return (
        <>
            <AirdropCard />
            <div className="px-[1.5rem] lg:mx-auto lg:w-[73.75rem] lg:px-0">
                <Allocation />
                <TokenUtility />
                <AirdropTable />
            </div>
        </>
    );
};
export default AirdropTab;
