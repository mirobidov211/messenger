import { useState, useEffect, useCallback } from 'react';
import { Search, Menu, X, Loader2, User } from 'lucide-react';
import ChatList from '../chat/ChatList';
import ProfileView from '../profile/ProfileView';
import SettingsView from '../settings/SettingsView';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../ui/Avatar';
import clsx from 'clsx';
import { useUiStore } from '../../store/uiStore';
import { useChatStore } from '../../store/chatStore';
import { useChats } from '../../hooks/useChats';
import { searchUsersApi } from '../../api/chats';

const Sidebar = () => {
  const currentUser = useAuthStore((state) => state.user);
  const { isSidebarOpen, currentView, setCurrentView, setIsDrawerOpen, setSidebarOpen } = useUiStore();
  const activeChat = useChatStore((state) => state.activeChat);
  const { startChatWithUser } = useChats();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchUsersApi(trimmed);
        setSearchResults(results);
      } catch (err) {
        console.error('Qidiruvda xatolik:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectUser = async (targetUser) => {
    try {
      setIsStartingChat(true);
      await startChatWithUser(targetUser);
      setSearchQuery('');
      setSearchResults([]);
      setSidebarOpen(false);
    } catch (err) {
      console.error('Chat ochishda xatolik:', err);
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div
      className={clsx(
        'flex flex-col w-full lg:w-[360px] bg-[#17212b] h-full border-r border-[#0e1621]/80 transition-all duration-300',
        !isSidebarOpen || (activeChat && 'hidden lg:flex') ? 'hidden lg:flex' : 'flex'
      )}
    >
      {currentView === 'profile' ? (
        <ProfileView onBack={() => setCurrentView('chats')} />
      ) : currentView === 'settings' ? (
        <SettingsView onBack={() => setCurrentView('chats')} />
      ) : (
        <>
          {/* Header: Menu + Search */}
          <div className="p-3 flex items-center gap-2 bg-[#17212b]">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-[#242f3d] transition-all active:scale-95"
              title="Menyu"
            >
              <Menu size={22} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full bg-[#242f3d] text-white placeholder-gray-500 rounded-full py-2 pl-10 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#2aabee]/50 transition-all"
              />
              <Search size={17} className="absolute left-3.5 top-2.5 text-gray-500" />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Chat list or search results */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {searchQuery.trim() ? (
              <div>
                <div className="px-4 py-2.5 text-[11px] font-semibold uppercase text-[#2aabee] tracking-wider">
                  Global Search
                </div>

                {isSearching ? (
                  <div className="flex items-center justify-center p-8 text-gray-500 gap-2">
                    <Loader2 size={20} className="animate-spin text-[#2aabee]" />
                    <span className="text-sm">Qidirilmoqda...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-0.5">
                    {searchResults.map((searchedUser) => (
                      <div
                        key={searchedUser.id}
                        onClick={() => handleSelectUser(searchedUser)}
                        className={clsx(
                          'flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#242f3d] transition-colors',
                          isStartingChat && 'opacity-60 pointer-events-none'
                        )}
                      >
                        <Avatar
                          alt={searchedUser.name || searchedUser.username}
                          src={searchedUser.avatar}
                          online={searchedUser.is_online}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-medium truncate">
                            {searchedUser.name || searchedUser.username}
                          </h4>
                          <p className="text-gray-500 text-xs truncate">
                            {searchedUser.is_online
                              ? 'online'
                              : searchedUser.bio || `@${searchedUser.username}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
                    <User size={32} className="text-gray-600 mb-2" />
                    <p className="text-sm font-medium text-gray-400">Foydalanuvchi topilmadi</p>
                    <p className="text-xs text-gray-600 mt-1">Boshqa username kiriting</p>
                  </div>
                )}
              </div>
            ) : (
              <ChatList />
            )}
          </div>

          {/* Bottom user profile */}
          <div
            onClick={() => setCurrentView('profile')}
            className="p-3 bg-[#242f3d]/40 border-t border-[#0e1621]/60 flex items-center gap-3 cursor-pointer hover:bg-[#242f3d] transition-colors group"
            title="Mening profilim"
          >
            <Avatar
              alt={currentUser?.name || currentUser?.username || 'U'}
              src={currentUser?.avatar}
              size="sm"
            />
            <div className="flex-1 truncate">
              <h3 className="text-white text-sm font-medium truncate group-hover:text-[#2aabee] transition-colors">
                {currentUser?.name || currentUser?.first_name || currentUser?.username}
              </h3>
              <p className="text-[#2aabee] text-xs truncate">
                {currentUser?.username ? `@${currentUser.username}` : 'Online'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
