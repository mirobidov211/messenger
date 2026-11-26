import clsx from 'clsx';
import PropTypes from 'prop-types';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className, disabled }) => {
  const baseClasses = 'px-4 py-2.5 rounded-xl font-medium transition-all focus:outline-none active:scale-[0.98]';
  const variants = {
    primary: 'bg-[#2aabee] text-white hover:bg-[#229ed9] shadow-sm shadow-[#2aabee]/20',
    secondary: 'bg-[#242f3d] text-white hover:bg-[#2b3a4a]',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/20',
    ghost: 'bg-transparent text-white hover:bg-[#242f3d]'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseClasses, variants[variant], disabled && 'opacity-50 cursor-not-allowed', className)}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
