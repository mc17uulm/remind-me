import {useCallback, useState} from "react";

interface Checkbox<S> {
    list: () => boolean[],
    set: (list : S[]) => void,
    update: (index: number) => void,
    update_all: (_checked: boolean) => void,
    get: (index: number) => boolean,
    filtered: () => boolean[],
    all: () => boolean,
    indeterminate: () => boolean
}

export const useCheckbox = <T extends unknown>(list : T[] = []) : [Checkbox<T>] => {

    const [checked, setChecked] = useState<boolean[]>(list.map(_ => false));

    const set = useCallback((_list : T[]) : void => {
        setChecked(_list.map(_ => false));
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
        if(checked.length === 0) return false;
        return filtered().length === checked.length;
    }, [checked]);

    const indeterminate = useCallback(() : boolean => {
        const _checked = filtered();
        return (_checked.length > 0) && (_checked.length < checked.length);
    }, [checked]);

    const get_list = () : boolean[] => {
        return checked.slice();
    }

    return [{
        list: get_list,
        set: set,
        update: update,
        update_all: update_all,
        get: get,
        all: all,
        indeterminate: indeterminate,
        filtered: filtered
    }];

}