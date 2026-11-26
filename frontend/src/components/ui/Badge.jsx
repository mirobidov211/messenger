import PropTypes from 'prop-types';

const Badge = ({ count }) => {
  if (!count || count === 0) return null;
  return (
    <span className="bg-[#2aabee] text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center leading-tight shadow-sm shadow-[#2aabee]/30">
      {count > 99 ? '99+' : count}
    </span>
  );
};

Badge.propTypes = { count: PropTypes.number };
export default Badge;
