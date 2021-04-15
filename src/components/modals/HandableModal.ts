export enum HandableModalType {
    HIDE,
    ADD,
    EDIT,
    DELETE
}

export interface ModalProps<T> {
    open: boolean,
    onClose: () => void,
    onSuccess: () => void,
    element: T | null,
    type: HandableModalType
}