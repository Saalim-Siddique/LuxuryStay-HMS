import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

/**
 * Modal – Accessible dialog rendered via React Portal with backdrop and Escape handling.
 */
const Modal = ({
  isOpen,
  open,
  onClose,
  title,
  subtitle,
  size = 'md',
  footer = null,
  showCloseButton = true,
  closeOnBackdrop = true,
  className = '',
  children,
}) => {
  const visible = isOpen ?? open ?? false;
  const titleId = useId();

  useEffect(() => {
    if (!visible) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="ls-modal-backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className={['ls-modal', `ls-modal--${size}`, className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        {(title || showCloseButton) && (
          <div className="ls-modal__header">
            <div>
              {title && (
                <h2 id={titleId} className="ls-modal__title">
                  {title}
                </h2>
              )}
              {subtitle && <p className="ls-modal__subtitle">{subtitle}</p>}
            </div>

            {showCloseButton && onClose && (
              <button
                type="button"
                className="ls-modal__close"
                onClick={onClose}
                aria-label="Close modal"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        )}

        <div className="ls-modal__body">{children}</div>

        {footer && <div className="ls-modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

export default Modal;

