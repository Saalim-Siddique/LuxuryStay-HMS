import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import Button from './Button';

/**
 * Dropdown – Accessible contextual action menu with outside-click and Escape support.
 */
const Dropdown = ({
  trigger,
  label = 'Actions',
  items = [],
  align = 'right',
  width,
  className = '',
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  const renderTrigger = () => {
    if (typeof trigger === 'function') {
      return trigger({ isOpen, toggle, ariaProps: { 'aria-expanded': isOpen, 'aria-haspopup': 'menu', 'aria-controls': menuId } });
    }

    if (trigger) {
      return (
        <span
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-controls={menuId}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggle();
            }
          }}
        >
          {trigger}
        </span>
      );
    }

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        rightIcon={<FiChevronDown />}
      >
        {label}
      </Button>
    );
  };

  return (
    <div ref={containerRef} className={['ls-dropdown', className].filter(Boolean).join(' ')}>
      {renderTrigger()}

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          className={`ls-dropdown__menu ls-dropdown__menu--${align}`}
          style={width ? { minWidth: width } : undefined}
        >
          {items.map((item, idx) => {
            if (item.divider) {
              return <div key={`divider-${idx}`} className="ls-dropdown__divider" role="separator" />;
            }

            const itemClass = [
              'ls-dropdown__item',
              item.danger && 'ls-dropdown__item--danger',
            ]
              .filter(Boolean)
              .join(' ');

            const content = (
              <>
                {item.icon && <span className="d-inline-flex align-items-center" aria-hidden="true">{item.icon}</span>}
                <span>{item.label}</span>
              </>
            );

            if (item.to && !item.disabled) {
              return (
                <Link
                  key={item.id || item.label || idx}
                  to={item.to}
                  role="menuitem"
                  className={itemClass}
                  onClick={close}
                >
                  {content}
                </Link>
              );
            }

            if (item.href && !item.disabled) {
              return (
                <a
                  key={item.id || item.label || idx}
                  href={item.href}
                  role="menuitem"
                  className={itemClass}
                  onClick={close}
                >
                  {content}
                </a>
              );
            }

            return (
              <button
                key={item.id || item.label || idx}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={itemClass}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  close();
                }}
              >
                {content}
              </button>
            );
          })}

          {children && (
            <div onClick={close}>{children}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

