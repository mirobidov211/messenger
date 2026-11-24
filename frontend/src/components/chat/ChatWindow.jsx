import { useState, useEffect, useRef, useCallback } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useChats } from '../../hooks/useChats';
import { ArrowLeft, MoreVertical, MessageSquare } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useChatStore } from '../../store/chatStore';
import { deleteMessageApi, editMessageApi } from '../../api/chats';

const ChatWindow = () => {
  const currentUser = useAuthStore((state) => state.user);
  const { activeChat, setActiveChat, messages, fetchMessages, sendMessage, markAsRead } = useChats();
  const { removeMessage, updateMessage } = useChatStore();
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const messagesEndRef = useRef(null);

  const { sendChatMessage, sendReadReceipt, sendTyping, readyState } = useWebSocket(activeChat?.id);

  const [editingMessage, setEditingMessage] = useState(null);

  // Touch/mouse swipe
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchDeltaX = useRef(0);
  const mouseStartX = useRef(0);
  const isMouseDown = useRef(false);

  useEffect(() => {
    if (activeChat?.id) {
      fetchMessages(activeChat.id);
      markAsRead(activeChat.id);
      sendReadReceipt();
    }
    setEditingMessage(null);
  }, [activeChat?.id]);

  const chatMessages = messages[String(activeChat?.id)] || messages[activeChat?.id] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  useEffect(() => {
    if (activeChat) {
      const username = activeChat.name || activeChat.other_user?.username;
      if (username) {
        const expectedHash = `#${username}`;
        if (window.location.hash !== expectedHash) {
          window.history.replaceState(null, '', `/#${username}`);
        }
      }
    }
  }, [activeChat]);

  const handleBack = () => {
    setActiveChat(null);
    setSidebarOpen(true);
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;
    if (diffX > 0 && Math.abs(diffX) > Math.abs(diffY) * 1.2) {
      touchDeltaX.current = diffX;
    }
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current > 75) {
      handleBack();
    }
    touchDeltaX.current = 0;
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('input, textarea, button')) return;
    isMouseDown.current = true;
    mouseStartX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    const diffX = e.clientX - mouseStartX.current;
    if (diffX > 100) {
      handleBack();
    }
  };

  const handleSend = async (text) => {
    if (!text || !activeChat) return;
    try {
      if (editingMessage) {
        const updated = await editMessageApi(activeChat.id, editingMessage.id, text);
        updateMessage(activeChat.id, editingMessage.id, {
          content: text,
          text,
          edited_at: updated?.edited_at || new Date().toISOString(),
        });
        setEditingMessage(null);
      } else {
        if (readyState === 1) {
          sendChatMessage(text);
        } else {
          await sendMessage(activeChat.id, text);
        }
      }
    } catch (err) {
      console.error('Xabar yuborishda xatolik:', err);
    }
  };

  const handleDeleteMessage = useCallback(async (message) => {
    if (!activeChat) return;
    try {
      await deleteMessageApi(activeChat.id, message.id);
      removeMessage(activeChat.id, message.id);
    } catch (err) {
      console.error('Xabarni o\'chirishda xatolik:', err);
    }
  }, [activeChat, removeMessage]);

  const handleEditMessage = useCallback((message) => {
    setEditingMessage(message);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingMessage(null);
  }, []);

  if (!activeChat) {
    return (
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[#0e1621]">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-[#242f3d] flex items-center justify-center shadow-lg">
            <MessageSquare size={36} className="text-[#2aabee]" />
          </div>
          <div className="bg-[#17212b] px-6 py-3 rounded-2xl text-sm text-gray-400 shadow-lg border border-[#242f3d]/50">
            Xabar yozish uchun chatni tanlang yoki qidiring
          </div>
        </div>
      </div>
    );
  }

  const displayName = activeChat.name || activeChat.other_user?.username || 'Chat';
  const avatarSrc = activeChat.avatar || activeChat.other_user?.avatar;
  const isOnline = Boolean(activeChat.is_online || activeChat.isOnline || activeChat.other_user?.is_online);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="flex-1 flex flex-col bg-[#0e1621] h-full relative"
    >
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#17212b] border-b border-[#0e1621]/80 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="lg:hidden text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-[#242f3d] transition-all">
            <ArrowLeft size={22} />
          </button>
          <Avatar alt={displayName} src={avatarSrc} online={isOnline} size="sm" />
          <div>
            <h2 className="text-white font-semibold text-sm leading-tight">{displayName}</h2>
            <p className="text-[#2aabee] text-xs font-medium" data-testid="chat-status">
              {isOnline ? 'online' : 'yaqinda online edi'}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-[#242f3d] transition-all">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0e1621] custom-scrollbar flex flex-col">
        {chatMessages.length === 0 ? (
          <div className="m-auto flex flex-col items-center justify-center text-center p-6 bg-[#17212b]/60 rounded-2xl max-w-xs border border-[#242f3d]/50 shadow-lg backdrop-blur-sm">
            <div className="w-14 h-14 rounded-full bg-[#242f3d] flex items-center justify-center mb-3 text-[#2aabee] shadow-inner">
              <MessageSquare size={26} />
            </div>
            <h3 className="text-white font-semibold text-sm">Hozircha xabarlar yo'q</h3>
            <p className="text-gray-500 text-xs mt-1.5">
              Birinchi bo'lib salom deb yozing va suhbatni boshlang!
            </p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isOwn =
              msg.sender?.id === currentUser?.id ||
              msg.sender_id === currentUser?.id ||
              msg.senderId === currentUser?.id ||
              msg.senderId === 'me' ||
              (msg.sender_username && msg.sender_username === currentUser?.username);

            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={Boolean(isOwn)}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <MessageInput
        onSend={handleSend}
        onTyping={sendTyping}
        editingMessage={editingMessage}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  );
};

export default ChatWindow;
