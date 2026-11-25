import { formatCurrency } from '../../utils/formatters';

/**
 * PriceDisplay – Standardized luxury tariff readout with optional label, unit, and strikethrough rate.
 */
const PriceDisplay = ({
  amount,
  originalAmount = null,
  currency = 'USD',
  label = '',
  unit = '/ night',
  size = 'md',
  className = '',
}) => {
  const formatted = formatCurrency(amount, currency);
  const formattedOriginal =
    originalAmount != null && originalAmount > amount
      ? formatCurrency(originalAmount, currency)
      : null;

  return (
    <div className={['ls-public-price', `ls-public-price--${size}`, className].filter(Boolean).join(' ')}>
      {label && <span className="ls-public-price__label">{label}</span>}
      <div className="ls-public-price__row">
        {formattedOriginal && (
          <span className="ls-public-price__strike">{formattedOriginal}</span>
        )}
        <span className="ls-public-price__amount">{formatted}</span>
        {unit && <span className="ls-public-price__unit">{unit}</span>}
      </div>
    </div>
  );
};

export default PriceDisplay;

