import { FiAlertTriangle, FiHelpCircle } from 'react-icons/fi';
import Modal from './Modal';
import Button from './Button';

/**
 * ConfirmDialog – Structured confirmation modal built on top of Modal.
 */
const ConfirmDialog = ({
  isOpen,
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  icon = null,
}) => {
  const DefaultIcon = variant === 'primary' ? FiHelpCircle : FiAlertTriangle;
  const buttonVariant = variant === 'warning' ? 'secondary' : variant;

  return (
    <Modal
      isOpen={isOpen ?? open}
      onClose={loading ? undefined : onClose}
      title={title}
      size="sm"
      closeOnBackdrop={!loading}
      showCloseButton={!loading}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={buttonVariant}
            size="sm"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="ls-confirm">
        <div className={`ls-confirm__icon ls-confirm__icon--${variant}`} aria-hidden="true">
          {icon || <DefaultIcon />}
        </div>
        <p className="ls-confirm__message">{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

