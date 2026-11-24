import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Smile, Paperclip, Send, Mic, X, Pencil } from 'lucide-react';

const MessageInput = ({ onSend, onTyping, editingMessage, onCancelEdit }) => {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingMessage) {
      const content = editingMessage.content || editingMessage.text || '';
      setText(content);
      inputRef.current?.focus();
    } else {
      setText('');
    }
  }, [editingMessage]);

  const handleChange = (e) => {
    setText(e.target.value);
    if (onTyping) onTyping();
  };

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape' && editingMessage) {
      onCancelEdit();
    }
  };

  const handleCancelEdit = () => {
    setText('');
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <div className="bg-[#17212b] flex flex-col">
      {/* Edit mode banner */}
      {editingMessage && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#242f3d] border-t border-[#0e1621]/50">
          <div className="flex items-center gap-2 min-w-0">
            <Pencil size={14} className="text-[#2aabee] flex-shrink-0" />
            <span className="text-[#2aabee] text-xs font-semibold flex-shrink-0">Tahrirlash</span>
            <span className="text-gray-400 text-xs truncate">
              {editingMessage.content || editingMessage.text}
            </span>
          </div>
          <button
            onClick={handleCancelEdit}
            className="ml-2 p-1 text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-3 flex items-end gap-2">
        <button className="p-2 text-gray-500 hover:text-[#2aabee] transition-colors rounded-full hover:bg-[#242f3d]">
          <Paperclip size={22} />
        </button>
        <div className="flex-1 bg-[#242f3d] rounded-xl flex items-center px-1.5 py-0.5">
          <button className="p-2 text-gray-500 hover:text-[#2aabee] transition-colors">
            <Smile size={22} />
          </button>
          <textarea
            ref={inputRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={editingMessage ? 'Tahrirlang...' : 'Xabar'}
            className="flex-1 bg-transparent text-white resize-none max-h-32 focus:outline-none p-2 text-sm custom-scrollbar placeholder-gray-500"
            rows={1}
            style={{ minHeight: '40px' }}
          />
        </div>
        {text.trim() ? (
          <button
            onClick={handleSend}
            className="p-3 bg-[#2aabee] text-white rounded-full hover:bg-[#229ed9] transition-all shadow-lg shadow-[#2aabee]/20 active:scale-95"
          >
            <Send size={20} className="ml-0.5" />
          </button>
        ) : (
          <button className="p-3 bg-[#242f3d] text-gray-500 rounded-full hover:text-[#2aabee] transition-colors">
            <Mic size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

MessageInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  onTyping: PropTypes.func,
  editingMessage: PropTypes.object,
  onCancelEdit: PropTypes.func,
};

export default MessageInput;
