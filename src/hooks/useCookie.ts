import {useEffect, useState} from "react";

type CookieResponse = [
    string | null,
    (value: string, expires: number) => void
];

export const useCookie = (identifier: string) : CookieResponse => {

    const [cookie, setCookie] = useState<string | null>(null);

    useEffect(() => {
        const cookie = decodeURIComponent(document.cookie)
            .split(";")
            .map((val : string) => {
                return val.split("=");
            })
            .filter((val : string[]) => {
                return val[0].trim() === identifier;
            });
        if(cookie.length === 1) {
            setCookie(cookie[0][1]);
        }
    }, []);

    const set = (value : string, expires : number) : void => {
        const date = new Date();
        date.setTime(date.getTime() + (expires*24*60*60*1000));
        document.cookie = identifier + '=' + value + ';expires=' + date.toUTCString() + ";path=/;SameSite=Strict";
        setCookie(value);
    }

    return [
        cookie,
        set
    ];

}