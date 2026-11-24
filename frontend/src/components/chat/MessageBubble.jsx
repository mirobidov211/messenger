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
            'max-w-[85%] sm:max-w-[70%] rounded-2xl px-3.5 py-2.5 relative select-none shadow-sm',
            isOwn
              ? 'bg-[#2b5278] text-white rounded-br-md'
              : 'bg-[#182533] text-white rounded-bl-md'
          )}
        >
          {/* Reply */}
          {message.replyTo && (
            <div className="border-l-2 border-[#2aabee] pl-2 mb-1.5 bg-black/20 rounded-lg p-1.5 text-sm">
              <span className="text-[#2aabee] font-medium text-xs">{message.replyTo.sender}</span>
              <p className="text-gray-300 truncate text-xs">{message.replyTo.text}</p>
            </div>
          )}

          {/* Text */}
          <p className="text-[14px] leading-relaxed break-words select-text">{text}</p>

          {/* Time + read status */}
          <div className="flex items-center justify-end gap-1 mt-1 flex-wrap">
            {isEdited && (
              <span className="text-[10px] text-gray-400/70 italic mr-1">tahrirlangan</span>
            )}
            <span className="text-[11px] text-gray-400/60 select-none">
              {formatMessageTime(message.created_at || message.createdAt)}
            </span>
            {isOwn && (
              <span
                className={clsx(
                  'text-[14px]',
                  message.is_read || message.isRead ? 'text-[#2aabee]' : 'text-gray-500'
                )}
              >
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
          className="fixed z-50 bg-[#17212b] border border-[#242f3d] rounded-xl shadow-2xl overflow-hidden min-w-[150px] animate-scale-in"
          style={{
            top: Math.min(menu.y, window.innerHeight - 110),
            left: Math.min(menu.x, window.innerWidth - 170),
          }}
        >
          <button
            onClick={handleEdit}
            className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-white hover:bg-[#242f3d] transition-colors"
          >
            <Pencil size={15} className="text-[#2aabee]" />
            Tahrirlash
          </button>
          <div className="h-px bg-[#242f3d]" />
          <button
            onClick={handleDelete}
            className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-400 hover:bg-[#242f3d] transition-colors"
          >
            <Trash2 size={15} />
            O'chirish
          </button>
          <div className="h-px bg-[#242f3d]" />
          <button
            onClick={closeMenu}
            className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-gray-500 hover:bg-[#242f3d] transition-colors"
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
