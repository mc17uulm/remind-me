import {MouseEvent, useCallback, useState} from "react";

export enum ModalState {
    HIDE,
    ADD,
    EDIT,
    DELETE
}

interface DefaultModalProps {
    type: ModalState,
    open: boolean,
    onClose: () => void,
    onSuccess: () => void,
}

interface HideModalProps extends DefaultModalProps {
    type: ModalState.HIDE
}

interface AddModalProps extends DefaultModalProps {
    type: ModalState.ADD
}

interface EditModalProps<T> extends DefaultModalProps {
    type: ModalState.EDIT,
    element: T;
}

interface DeleteModalProps<T> extends DefaultModalProps {
    type: ModalState.DELETE,
    elements: T[]
}

export type ModalProps<S> = AddModalProps | EditModalProps<S> | DeleteModalProps<S> | HideModalProps;

interface Modal<S> {
    state : ModalState,
    selected : S[],
    isOpen: () => boolean,
    add: (e : MouseEvent) => void,
    edit: (e : MouseEvent, element : S) => void,
    delete: (e : MouseEvent, elements : S[]) => void,
    close: () => void,
    hide: () => void
}

export const useModal = <T extends unknown>() : [Modal<T>] => {

    const [selected, setSelected] = useState<T[]>([]);
    const [type, setType] = useState<ModalState>(ModalState.HIDE);

    const onAdd = useCallback((e : MouseEvent) : void => {
        e.preventDefault();
        setSelected([]);
        setType(ModalState.ADD);
    }, []);

    const onEdit = useCallback((e : MouseEvent, element : T) : void => {
        e.preventDefault();
        console.log(element);
        setSelected([element]);
        setType(ModalState.EDIT);
    }, []);

    const onDelete = useCallback((e : MouseEvent, elements : T[]) : void => {
        e.preventDefault();
        setSelected(elements);
        setType(ModalState.DELETE);
    }, []);

    const onClose = useCallback(() : void => {
        setType(ModalState.HIDE);
        setSelected([]);
    }, []);

    const isOpen = () : boolean => {
        return type !== ModalState.HIDE;
    }

    return [
        {
            state: type,
            selected: selected,
            isOpen: isOpen,
            add: onAdd,
            edit: onEdit,
            delete: onDelete,
            close: onClose,
            hide: onClose
        }
    ];

}