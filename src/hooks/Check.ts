import {useCallback, useState} from "react";

interface CheckFunctions<S> {
    set: (list : S[]) => void,
    update: (index: number) => void,
    update_all: (_checked: boolean) => void,
    get: (index: number) => boolean,
    filtered: () => boolean[],
    all: () => boolean,
    indeterminate: () => boolean
}

export const useCheck = <T extends unknown>() : [boolean[], CheckFunctions<T>] => {

    const [checked, setChecked] = useState<boolean[]>([]);

    const set = useCallback((list : T[]) : void => {
        setChecked(list.map(num => false));
    }, []);

    const update = useCallback((index : number) : void => {
        setChecked(checked.map((val : boolean, _index : number) => {
            return (_index === index) ? !val : val;
        }));
    }, [checked]);

    const update_all = useCallback((_checked : boolean) : void => {
        setChecked(checked.map(() =>  _checked));
    }, [checked]);

    const get = useCallback((index : number) : boolean => {
        if(index > checked.length || index < 0) return false;
        return checked[index];
    }, [checked]);

    const filtered = useCallback(() : boolean[] => {
        return checked.filter((val : boolean) => {
            return val;
        });
    }, [checked]);

    const all = useCallback(() : boolean => {
        return filtered().length === checked.length;
    }, [checked]);

    const indeterminate = useCallback(() : boolean => {
        const _checked = filtered();
        return (_checked.length > 0) && (_checked.length < checked.length);
    }, [checked]);

    return [checked, {
        set: set,
        update: update,
        update_all: update_all,
        get: get,
        all: all,
        indeterminate: indeterminate,
        filtered: filtered
    }];

}