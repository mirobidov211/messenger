import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ArrowLeft, Pencil, Camera, Check, Save, Loader2,
  AtSign, Info, User as UserIcon, Mail, Copy, CheckCheck, AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { updateProfileApi } from '../../api/auth';
import Avatar from '../ui/Avatar';

const ProfileView = ({ onBack }) => {
  const currentUser = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { setCurrentView, isEditingProfile, setIsEditingProfile } = useUiStore();

  const [isEditing, setIsEditing] = useState(isEditingProfile || false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || currentUser.first_name || '');
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
      setAvatarPreview(null);
      setAvatarFile(null);
    }
  }, [currentUser]);

  useEffect(() => {
    if (isEditingProfile !== isEditing) {
      setIsEditing(isEditingProfile);
    }
  }, [isEditingProfile]);

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Rasm hajmi 5MB dan oshmasligi kerak!");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
      setErrorMsg('');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsEditingProfile(false);
    setErrorMsg('');
    if (currentUser) {
      setName(currentUser.name || currentUser.first_name || '');
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedUsername = username.trim().replace(/^@/, '');
    if (!trimmedUsername) {
      setErrorMsg("Username bo'sh bo'lishi mumkin emas!");
      return;
    }

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append('username', trimmedUsername);
      formData.append('name', name.trim());
      formData.append('first_name', name.trim());
      formData.append('bio', bio.trim());
      if (avatarFile) formData.append('avatar', avatarFile);

      const updatedUser = await updateProfileApi(formData);
      updateUser(updatedUser);
      setSuccessMsg("Profil ma'lumotlari muvaffaqiyatli saqlandi!");
      setIsEditing(false);
      setIsEditingProfile(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Profilni saqlashda xatolik:', err);
      const responseErrors = err?.response?.data;
      if (typeof responseErrors === 'object') {
        const firstKey = Object.keys(responseErrors)[0];
        const val = responseErrors[firstKey];
        setErrorMsg(`${firstKey}: ${Array.isArray(val) ? val.join(' ') : val}`);
      } else {
        setErrorMsg("Profilni saqlashda xatolik yuz berdi.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (isEditing) handleCancelEdit();
    else if (onBack) onBack();
    else setCurrentView('chats');
  };

  const displayName = currentUser?.name || currentUser?.first_name || currentUser?.username || 'Foydalanuvchi';
  const displayAvatar = avatarPreview || currentUser?.avatar;

  return (
    <div className="w-full h-full flex flex-col theme-sidebar select-none overflow-hidden animate-fade-in transition-colors duration-200">
      {/* Header */}
      <div className="h-14 px-4 theme-header border-b theme-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 -ml-2 theme-text-secondary hover:theme-text-primary rounded-full hover:opacity-80 transition-colors">
            <ArrowLeft size={22} />
          </button>
          <h2 className="theme-text-primary font-semibold text-base">
            {isEditing ? 'Profilni tahrirlash' : 'Profil'}
          </h2>
        </div>
        <div>
          {isEditing ? (
            <button onClick={handleSave} disabled={isSaving} className="p-2 text-[#2aabee] hover:text-blue-400 disabled:opacity-50 rounded-full hover:opacity-80 transition-colors">
              {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Check size={22} />}
            </button>
          ) : (
            <button onClick={() => { setIsEditing(true); setIsEditingProfile(true); }} className="p-2 theme-text-secondary hover:text-[#2aabee] rounded-full hover:opacity-80 transition-colors">
              <Pencil size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="px-4 py-2.5 bg-red-500/15 border-b border-red-500/20 flex items-center gap-2 text-red-500 text-xs shrink-0 animate-fade-in">
          <AlertCircle size={16} className="shrink-0" />
          <span className="flex-1">{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="px-4 py-2.5 bg-emerald-500/15 border-b border-emerald-500/20 flex items-center gap-2 text-emerald-600 text-xs shrink-0 animate-fade-in">
          <CheckCheck size={16} className="shrink-0" />
          <span className="flex-1">{successMsg}</span>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {!isEditing ? (
          <div className="flex flex-col items-center">
            <div className="relative mt-2 mb-4">
              <Avatar alt={displayName} src={currentUser?.avatar} size="2xl" online={true} className="ring-4 ring-white/20 shadow-xl" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold theme-text-primary text-center">{displayName}</h1>
            <p className="text-[#2aabee] text-sm font-medium mt-1">@{currentUser?.username || 'username'}</p>
            {currentUser?.bio && (
              <p className="theme-text-secondary text-sm text-center mt-3 px-6 italic">"{currentUser.bio}"</p>
            )}

            {/* Info Cards */}
            <div className="w-full mt-6 theme-surface border theme-border rounded-2xl overflow-hidden divide-y theme-border shadow-sm">
              <div onClick={() => handleCopy(`@${currentUser?.username}`, 'username')} className="p-3.5 flex items-center justify-between hover:opacity-85 cursor-pointer transition-colors group">
                <div className="flex items-center gap-3.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-[#2aabee]"><AtSign size={18} /></div>
                  <div>
                    <span className="text-xs theme-text-muted block">Foydalanuvchi nomi</span>
                    <span className="text-sm font-medium theme-text-primary group-hover:text-[#2aabee] transition-colors">@{currentUser?.username}</span>
                  </div>
                </div>
                <div className="theme-text-muted group-hover:theme-text-primary transition-colors">
                  {copiedField === 'username' ? <span className="text-xs text-emerald-500 font-medium">Nusxalandi!</span> : <Copy size={16} />}
                </div>
              </div>

              <div className="p-3.5 flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 shrink-0"><Info size={18} /></div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs theme-text-muted block">Bio</span>
                  <span className="text-sm theme-text-secondary block break-words mt-0.5">{currentUser?.bio || "Bio kiritilmagan"}</span>
                </div>
              </div>

              <div className="p-3.5 flex items-center gap-3.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500"><UserIcon size={18} /></div>
                <div>
                  <span className="text-xs theme-text-muted block">Ism</span>
                  <span className="text-sm font-medium theme-text-primary">{displayName}</span>
                </div>
              </div>

              {currentUser?.email && (
                <div onClick={() => handleCopy(currentUser.email, 'email')} className="p-3.5 flex items-center justify-between hover:opacity-85 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500"><Mail size={18} /></div>
                    <div>
                      <span className="text-xs theme-text-muted block">Email</span>
                      <span className="text-sm font-medium theme-text-primary group-hover:text-[#2aabee] transition-colors">{currentUser.email}</span>
                    </div>
                  </div>
                  <div className="theme-text-muted group-hover:theme-text-primary transition-colors">
                    {copiedField === 'email' ? <span className="text-xs text-emerald-500 font-medium">Nusxalandi!</span> : <Copy size={16} />}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => { setIsEditing(true); setIsEditingProfile(true); }} className="w-full mt-6 py-3 px-4 theme-surface text-[#2aabee] border border-[#2aabee]/30 hover:border-[#2aabee] font-medium rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]">
              <Pencil size={18} />
              <span>Profilni tahrirlash</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Avatar alt={displayName} src={displayAvatar} size="2xl" className="ring-4 ring-white/20 shadow-xl opacity-90 group-hover:opacity-75 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="p-3 bg-[#2aabee] text-white rounded-full shadow-lg ring-2 ring-white/30 transform group-hover:scale-110 transition-transform">
                    <Camera size={22} />
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </div>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-3 text-xs text-[#2aabee] hover:underline font-medium">
                Profil rasmini yangilash
              </button>
              {avatarFile && <span className="text-[11px] text-emerald-500 mt-1">Yangi rasm tanlandi: {avatarFile.name}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium theme-text-secondary block px-1">Ism</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ismingizni kiriting" maxLength={64} className="w-full theme-input border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2aabee] focus:ring-1 focus:ring-[#2aabee]/50 transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium theme-text-secondary block px-1">Username</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-[#2aabee] font-semibold text-sm">@</span>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" maxLength={32} className="w-full theme-input border rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#2aabee] focus:ring-1 focus:ring-[#2aabee]/50 transition-all" />
              </div>
              <p className="text-[11px] theme-text-muted px-1">Boshqa foydalanuvchilar sizni ushbu username orqali topishlari mumkin.</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-medium theme-text-secondary">Bio</label>
                <span className="text-[10px] theme-text-muted">{bio.length}/500</span>
              </div>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="O'zingiz haqingizda..." rows={3} maxLength={500} className="w-full theme-input border rounded-xl p-3 text-sm focus:outline-none focus:border-[#2aabee] focus:ring-1 focus:ring-[#2aabee]/50 transition-all resize-none" />
            </div>

            <div className="pt-2">
              <button type="submit" disabled={isSaving} className="w-full py-3 px-4 bg-[#2aabee] hover:bg-[#229ed9] disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#2aabee]/20 transition-all active:scale-[0.98]">
                {isSaving ? (<><Loader2 size={18} className="animate-spin" /><span>Saqlanmoqda...</span></>) : (<><Save size={18} /><span>Saqlash</span></>)}
              </button>
              <button type="button" onClick={handleCancelEdit} disabled={isSaving} className="w-full mt-2 py-2 px-4 theme-text-muted hover:theme-text-primary text-xs font-medium rounded-xl hover:opacity-85 transition-colors">
                Bekor qilish
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

ProfileView.propTypes = { onBack: PropTypes.func };
export default ProfileView;
