import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { formatMessageTime } from '../../utils/formatDate';
import { Check, CheckCheck, Pencil, Trash2, X } from 'lucide-react';

const MessageBubble = ({ message, isOwn, onEdit, onDelete }) => {
  const [menu, setMenu] = useState(null);
  const menuRef = useRef(null);
  const longPressTimer = useRef(null);
  const bubbleRef = useRef(null);

  const closeMenu = useCallback(() => setMenu(null), []);

  useEffect(() => {
    if (!menu) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menu, closeMenu]);

  const handleContextMenu = (e) => {
    if (!isOwn) return;
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e) => {
    if (!isOwn) return;
    const touch = e.touches[0];
    longPressTimer.current = setTimeout(() => {
      const rect = bubbleRef.current?.getBoundingClientRect();
      setMenu({
        x: rect ? rect.left : touch.clientX,
        y: rect ? rect.bottom + 4 : touch.clientY,
      });
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleEdit = () => {
    closeMenu();
    onEdit(message);
  };

  const handleDelete = () => {
    closeMenu();
    onDelete(message);
  };

  const isEdited = Boolean(message.edited_at);
  const text = message.content || message.text || '';

  return (
    <>
      <div
        className={clsx('flex w-full animate-slide-in', isOwn ? 'justify-end' : 'justify-start')}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchEnd}
      >
        <div
          ref={bubbleRef}
          className={clsx(
            'max-w-[85%] sm:max-w-[70%] rounded-2xl px-3.5 py-2.5 relative select-none shadow-sm transition-colors duration-200',
            isOwn
              ? 'bg-[#2aabee] text-white dark:bg-[#2b5278] dark:text-white rounded-br-md shadow-blue-500/10'
              : 'theme-surface theme-text-primary rounded-bl-md border theme-border'
          )}
        >
          {/* Reply */}
          {message.replyTo && (
            <div className={clsx(
              'border-l-2 pl-2 mb-1.5 rounded-lg p-1.5 text-sm',
              isOwn
                ? 'border-white/80 bg-black/10'
                : 'border-[#2aabee] theme-surface-secondary'
            )}>
              <span className={clsx('font-medium text-xs', isOwn ? 'text-white' : 'text-[#2aabee]')}>
                {message.replyTo.sender}
              </span>
              <p className={clsx('truncate text-xs', isOwn ? 'text-white/80' : 'theme-text-secondary')}>
                {message.replyTo.text}
              </p>
            </div>
          )}

          {/* Text */}
          <p className="text-[14px] leading-relaxed break-words select-text">{text}</p>

          {/* Time + read status */}
          <div className="flex items-center justify-end gap-1 mt-1 flex-wrap">
            {isEdited && (
              <span className={clsx(
                'text-[10px] italic mr-1',
                isOwn ? 'text-white/70' : 'theme-text-muted'
              )}>
                tahrirlangan
              </span>
            )}
            <span className={clsx(
              'text-[11px] select-none',
              isOwn ? 'text-white/80' : 'theme-text-muted'
            )}>
              {formatMessageTime(message.created_at || message.createdAt)}
            </span>
            {isOwn && (
              <span className="text-[14px] text-white">
                {message.is_read || message.isRead ? (
                  <CheckCheck size={14} />
                ) : (
                  <Check size={14} />
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {menu && isOwn && (
        <div
          ref={menuRef}
          className="fixed z-50 theme-surface border theme-border rounded-xl shadow-2xl overflow-hidden min-w-[150px] animate-scale-in"
          style={{
            top: Math.min(menu.y, window.innerHeight - 110),
            left: Math.min(menu.x, window.innerWidth - 170),
          }}
        >
          <button
            onClick={handleEdit}
            className="flex items-center gap-2.5 w-full px-4 py-3 text-sm theme-text-primary hover:opacity-80 transition-colors"
          >
            <Pencil size={15} className="text-[#2aabee]" />
            Tahrirlash
          </button>
          <div className="h-px theme-border border-t" />
          <button
            onClick={handleDelete}
            className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-500 hover:opacity-80 transition-colors"
          >
            <Trash2 size={15} />
            O'chirish
          </button>
          <div className="h-px theme-border border-t" />
          <button
            onClick={closeMenu}
            className="flex items-center gap-2.5 w-full px-4 py-2 text-xs theme-text-muted hover:opacity-80 transition-colors"
          >
            <X size={13} />
            Bekor qilish
          </button>
        </div>
      )}
    </>
  );
};

MessageBubble.propTypes = {
  message: PropTypes.object.isRequired,
  isOwn: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default MessageBubble;
