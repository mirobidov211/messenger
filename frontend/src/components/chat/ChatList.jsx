import ChatItem from './ChatItem';
import { useChats } from '../../hooks/useChats';
import { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

const ChatList = () => {
  const { chats, fetchChats, activeChat, setActiveChat } = useChats();
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleChatClick = (chat) => {
    setActiveChat(chat);
    setSidebarOpen(false);
  };

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500 h-64 select-none">
        <div className="w-16 h-16 rounded-full bg-[#242f3d] flex items-center justify-center mb-3 text-[#2aabee] shadow-inner">
          <MessageSquare size={28} />
        </div>
        <p className="font-semibold text-white text-sm">No chats yet</p>
        <p className="text-xs text-gray-500 mt-1.5 max-w-[220px]">
          Do'stlaringizni qidirib, birinchi xabarni yozing!
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#0e1621]/40">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={activeChat?.id === chat.id}
          onClick={() => handleChatClick(chat)}
        />
      ))}
    </div>
  );
};
export default ChatList;
