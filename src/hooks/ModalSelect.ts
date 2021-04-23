import {MouseEvent, useCallback, useState} from "react";
import {HandableModalType} from "../components/modals/HandableModal";

interface ModalSelectFunctions<S> {
    onAdd: (e : MouseEvent) => void,
    onEdit: (e : MouseEvent, element : S) => void,
    onDelete: (e : MouseEvent, element : S) => void,
    onMultipleDelete: (e: MouseEvent, elements : S[]) => void,
    onClose: () => void,
    hide: () => void
}

export const useModalSelect = <T extends unknown>() : [HandableModalType, T[], ModalSelectFunctions<T>] => {

    const [selected, setSelected] = useState<T[]>([]);
    const [type, setType] = useState<HandableModalType>(HandableModalType.HIDE);

    console.log(selected);

    const onAdd = useCallback((e : MouseEvent) : void => {
        e.preventDefault();
        setSelected([]);
        setType(HandableModalType.ADD);
    }, []);

    const onEdit = useCallback((e : MouseEvent, element : T) : void => {
        e.preventDefault();
        setSelected([element]);
        setType(HandableModalType.EDIT);
    }, []);

    const onDelete = useCallback((e : MouseEvent, element : T) : void => {
        e.preventDefault();
        setSelected([element]);
        setType(HandableModalType.DELETE);
    }, [])

    const onMultipleDelete = useCallback((e : MouseEvent, elements : T[]) : void => {
        e.preventDefault();
        setSelected(elements);
        setType(HandableModalType.DELETE);
    }, []);

    const onClose = useCallback(() : void => {
        setType(HandableModalType.HIDE);
        setSelected([]);
    }, []);

    return [
        type,
        selected, {
            onAdd: onAdd,
            onEdit: onEdit,
            onDelete: onDelete,
            onMultipleDelete: onMultipleDelete,
            onClose: onClose,
            hide: onClose
        }
    ];

}