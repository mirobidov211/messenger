import { useAuthStore } from '../../store/authStore';

const Header = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <header className="p-4 bg-[#17212b] border-b border-[#242f3d] flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">Messenger</h1>
      <div className="text-gray-400 text-sm">{user?.username}</div>
    </header>
  );
};
export default Header;
