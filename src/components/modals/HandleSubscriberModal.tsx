import {HandableModalProps} from "./HandableModal";
import {APISubscriber} from "../../api/handler/SubscriberHandler";
import {useLoader} from "../../hooks/useLoader";

export const HandleSubscriberModal = (props : HandableModalProps<APISubscriber>) => {

    const [loading, doLoading] = useLoader();



}