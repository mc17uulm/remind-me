export enum HandableModalType {
    HIDE,
    ADD,
    EDIT,
    DELETE
}

interface ModalProps {
    type: HandableModalType,
    open: boolean,
    onClose: () => void,
    onSuccess: () => void,
}

interface HideModalProps extends ModalProps {
    type: HandableModalType.HIDE
}

interface AddModalProps extends ModalProps {
    type: HandableModalType.ADD
}

interface EditModalProps<T> extends ModalProps {
    type: HandableModalType.EDIT,
    element: T;
}

interface DeleteModalProps<T> extends ModalProps {
    type: HandableModalType.DELETE,
    elements: T[]
}

export type HandableModalProps<S> = AddModalProps | EditModalProps<S> | DeleteModalProps<S> | HideModalProps;