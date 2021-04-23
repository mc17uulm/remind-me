import {useState} from "react";

type useLoaderResponse = [
    boolean,
    (callback : () => Promise<any>) => Promise<void>
];

export const useLoader = () : useLoaderResponse => {

    const [loading, setLoading] = useState<boolean>(false);

    const doLoading = async (callback : () => Promise<any>) : Promise<void> => {
        setLoading(true);
        await callback();
        setLoading(false);
    }

    return [loading, doLoading];

}