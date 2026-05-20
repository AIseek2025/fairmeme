export const IS_SERVER = 'undefined' === typeof window;
export const IS_BROWSER = !IS_SERVER;
export const IS_TEST = process.env.NEXT_PUBLIC_ENV === 'test';
