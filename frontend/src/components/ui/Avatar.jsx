import { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const Avatar = ({ src, alt, size = 'md', online, className }) => {
  const sizes = {
    sm: 'w-9 h-9 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-28 h-28 text-3xl',
    '2xl': 'w-32 h-32 text-4xl'
  };

  const onlineDotSizes = {
    sm: 'w-2.5 h-2.5 border-[2px]',
    md: 'w-3 h-3 border-2',
    lg: 'w-3.5 h-3.5 border-2',
    xl: 'w-4 h-4 border-[3px]',
    '2xl': 'w-4.5 h-4.5 border-[3px]',
  };

  const [imgError, setImgError] = useState(false);

  const getFullAvatarUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }
    const backendOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:8000')
      .replace(/\/api\/?$/, '')
      .replace(/\/+$/, '');
    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const avatarSrc = getFullAvatarUrl(src);

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const getGradient = (name) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-emerald-400 to-emerald-600',
      'from-purple-400 to-purple-600',
      'from-orange-400 to-orange-600',
      'from-pink-400 to-pink-600',
      'from-cyan-400 to-cyan-600',
      'from-indigo-400 to-indigo-600',
      'from-rose-400 to-rose-600',
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className={clsx('relative inline-block rounded-full select-none shrink-0', sizes[size] || sizes.md, className)}>
      {avatarSrc && !imgError ? (
        <img
          src={avatarSrc}
          alt={alt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <div className={clsx(
          'w-full h-full flex items-center justify-center bg-gradient-to-br text-white rounded-full font-semibold shadow-inner',
          getGradient(alt)
        )}>
          {getInitial(alt)}
        </div>
      )}
      {online && (
        <span className={clsx(
          'absolute bottom-0 right-0 bg-green-500 rounded-full border-white dark:border-[#17212b]',
          onlineDotSizes[size] || onlineDotSizes.md
        )}></span>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl']),
  online: PropTypes.bool,
  className: PropTypes.string,
};

export default Avatar;
