import clsx from 'clsx';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const Input = forwardRef(({ type = 'text', placeholder, value, onChange, className, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={clsx(
          'w-full px-4 py-2.5 rounded-xl bg-[#242f3d] border focus:outline-none transition-all text-white placeholder-gray-500 text-sm',
          error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50' : 'border-[#0e1621] focus:border-[#2aabee] focus:ring-1 focus:ring-[#2aabee]/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1.5 px-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  className: PropTypes.string,
  error: PropTypes.string,
};

export default Input;
