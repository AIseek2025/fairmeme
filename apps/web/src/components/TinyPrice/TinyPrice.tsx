import { formatTinyPrice } from '@/utils/common';

const TinyPrice = ({ price }: { price: number }) => {
    const formattedPrice = formatTinyPrice(price);

    return <div className="tiny-price" dangerouslySetInnerHTML={{ __html: formattedPrice }} />;
};

export default TinyPrice;
