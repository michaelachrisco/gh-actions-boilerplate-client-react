import { useAppDispatch } from 'app/redux';
import { ConfirmationModalCallback, confirmConfirmationModal, declineConfirmationModal, openConfirmationModal } from './slice';

export interface ConfirmationModalConfig {
    message?: string;
    cancelButtonLabel?: string;
    confirmButtonLabel?: string; 
    onConfirm?: ConfirmationModalCallback;
    onDecline?: ConfirmationModalCallback;
}

export interface ConfirmationModalManager {
  openModal: (config: ConfirmationModalConfig) => void;
  confirmModal: () => void;
  declineModal: () => void;
}

export type useConfirmationModal = () => ConfirmationModalManager;

export const useConfirmationModal: useConfirmationModal = () => {
    const dispatch = useAppDispatch();

    const openModal = (config: ConfirmationModalConfig) => {
        dispatch(openConfirmationModal(config));
    }

    const confirmModal = () => {
        dispatch(confirmConfirmationModal());
    }

    const declineModal = () => {
        dispatch(declineConfirmationModal());
    }

    return {
        openModal,
        confirmModal,
        declineModal
    }
}