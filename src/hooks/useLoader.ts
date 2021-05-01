import {useState} from "react";

type useLoaderResponse = [
    boolean,
    (callback : () => Promise<any>) => Promise<void>
];

/**
 * The useLoader hook handles the loading state while executing a asynchronous function.
 * Before the execution the loading state is set to 'true'. After to 'false'. 'false' is also the default value.
 * Returns the loading value and the wrapper function for the asynchronous function.
 */
export const useLoader = () : useLoaderResponse => {

    const [loading, setLoading] = useState<boolean>(false);

    const doLoading = async (callback : () => Promise<any>) : Promise<void> => {
        setLoading(true);
        await callback();
        setLoading(false);
    }

    return [loading, doLoading];

}