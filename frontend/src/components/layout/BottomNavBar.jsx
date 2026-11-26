import { MessageSquare, Settings, User } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useChatStore } from '../../store/chatStore';
import clsx from 'clsx';

const BottomNavBar = () => {
  const { currentView, setCurrentView, setIsEditingProfile } = useUiStore();
  const { activeChat, setActiveChat, chats } = useChatStore();

  const totalUnreadCount = chats?.reduce((acc, c) => acc + (c.unread_count || c.unreadCount || 0), 0) || 0;

  const handleSelectTab = (view) => {
    if (activeChat) {
      setActiveChat(null);
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
    if (view === 'profile') {
      setIsEditingProfile(false);
    }
    setCurrentView(view);
  };

  return (
    <nav className="lg:hidden shrink-0 w-full theme-header border-t theme-border px-4 py-2 flex items-center justify-around z-30 select-none shadow-lg transition-colors duration-200">
      {/* Chatlar */}
      <button
        onClick={() => handleSelectTab('chats')}
        className={clsx(
          'flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all relative',
          currentView === 'chats' && !activeChat
            ? 'text-[#2aabee]'
            : 'theme-text-muted hover:theme-text-primary'
        )}
      >
        <div className="relative">
          <MessageSquare size={22} strokeWidth={currentView === 'chats' && !activeChat ? 2.4 : 1.8} />
          {totalUnreadCount > 0 && (
            <span className="absolute -top-1 -right-2.5 bg-[#2aabee] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none">
              {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
            </span>
          )}
        </div>
        <span
          className={clsx(
            'text-[11px] mt-1 font-medium transition-colors',
            currentView === 'chats' && !activeChat ? 'text-[#2aabee] font-semibold' : 'theme-text-muted'
          )}
        >
          Chatlar
        </span>
      </button>

      {/* Sozlamalar */}
      <button
        onClick={() => handleSelectTab('settings')}
        className={clsx(
          'flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all relative',
          currentView === 'settings'
            ? 'text-[#2aabee]'
            : 'theme-text-muted hover:theme-text-primary'
        )}
      >
        <Settings size={22} strokeWidth={currentView === 'settings' ? 2.4 : 1.8} />
        <span
          className={clsx(
            'text-[11px] mt-1 font-medium transition-colors',
            currentView === 'settings' ? 'text-[#2aabee] font-semibold' : 'theme-text-muted'
          )}
        >
          Sozlamalar
        </span>
      </button>

      {/* Profil */}
      <button
        onClick={() => handleSelectTab('profile')}
        className={clsx(
          'flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all relative',
          currentView === 'profile'
            ? 'text-[#2aabee]'
            : 'theme-text-muted hover:theme-text-primary'
        )}
      >
        <User size={22} strokeWidth={currentView === 'profile' ? 2.4 : 1.8} />
        <span
          className={clsx(
            'text-[11px] mt-1 font-medium transition-colors',
            currentView === 'profile' ? 'text-[#2aabee] font-semibold' : 'theme-text-muted'
          )}
        >
          Profil
        </span>
      </button>
    </nav>
  );
};

export default BottomNavBar;
