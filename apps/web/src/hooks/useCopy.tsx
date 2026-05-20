import { useToast } from '@/context/ToastContext';
import { useState } from 'react';

export const useCopy = () => {
    const [copiedText, setCopiedText] = useState<string | null>(null);
    const { showToast } = useToast();

    const copy = async (text: string) => {
        if (!navigator?.clipboard) {
            console.warn('Clipboard not supported');
            return false;
        }

        // try to save to clipboard then save it in the state if worked
        try {
            await navigator.clipboard.writeText(text);
            showToast({
                severity: 'success',
                summary: <span className="font-bold text-[#00CE7D]">Copied</span>,
                detail: <span className="font-helvetica text-base font-normal leading-6 text-white">{text}</span>,
                className: 'bg-[#252A40]',
                contentClassName: 'border-none text-[1.5rem] ',

                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path
                            d="M24.7711 8.67856L12.5364 21.0986L7.22973 15.7106C7.01895 15.4956 6.7674 15.3248 6.48981 15.2082C6.21222 15.0916 5.91415 15.0315 5.61307 15.0315C5.31198 15.0315 5.01392 15.0916 4.73632 15.2082C4.45873 15.3248 4.20718 15.4956 3.9964 15.7106C3.5718 16.1439 3.33398 16.7265 3.33398 17.3332C3.33398 17.9399 3.5718 18.5225 3.9964 18.9559L10.9217 25.9879C11.1325 26.2027 11.384 26.3733 11.6614 26.4898C11.9389 26.6063 12.2368 26.6663 12.5377 26.6663C12.8387 26.6663 13.1366 26.6063 13.414 26.4898C13.6915 26.3733 13.943 26.2027 14.1537 25.9879L28.0044 11.9252C28.4294 11.4918 28.6675 10.9089 28.6675 10.3019C28.6675 9.69484 28.4294 9.11201 28.0044 8.67856C27.7936 8.46356 27.5421 8.29276 27.2645 8.17616C26.9869 8.05957 26.6888 7.99951 26.3877 7.99951C26.0866 7.99951 25.7886 8.05957 25.511 8.17616C25.2334 8.29276 24.9818 8.46356 24.7711 8.67856Z"
                            fill="#00CE7D"
                        />
                    </svg>
                ),
                closeIcon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="0.5" y="0.5" width="23" height="23" stroke="#252A40" />
                        <path
                            d="M19.5675 4.49788L19.4245 4.36788L19.3035 4.27788L19.1705 4.19888C18.8698 4.03305 18.5234 3.96924 18.1833 4.01702C17.8432 4.06481 17.5278 4.22161 17.2845 4.46388L12.0005 9.75088L6.73348 4.48488L6.67048 4.42488C6.01548 3.85688 5.07048 3.85788 4.49848 4.42888L4.38548 4.54888L4.27848 4.69288L4.19848 4.82588C4.03297 5.12668 3.96934 5.473 4.01711 5.81298C4.06488 6.15297 4.22149 6.46834 4.46348 6.71188L9.75348 12.0009L4.42848 17.3279C3.85848 17.9879 3.85848 18.9309 4.42848 19.5049L4.54848 19.6169L4.69248 19.7249L4.82548 19.8039C5.12619 19.9697 5.47258 20.0335 5.81265 19.9857C6.15271 19.938 6.46811 19.7812 6.71148 19.5389L11.9995 14.2489L17.3215 19.5739C17.9915 20.1549 18.9365 20.1349 19.5315 19.5389L19.6385 19.4209L19.7345 19.2889C19.9356 18.9834 20.0253 18.6179 19.9885 18.254C19.9517 17.8901 19.7907 17.5499 19.5325 17.2909L14.2455 11.9999L19.5085 6.73588L19.6055 6.63288C20.1455 6.00588 20.1305 5.06288 19.5675 4.49688V4.49788Z"
                            fill="white"
                        />
                    </svg>
                ),
            });
            setCopiedText(text);
        } catch (error) {
            console.error(`Failed copying the text ${text}`, error);
            setCopiedText(null);
        }
    };

    return { copiedText, copy };
};
