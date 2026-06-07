import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../constants/toastConfig';
import PageLoader from './ui/PageLoader';
import {
  FiCamera, FiEdit3, FiLock, FiBookOpen, FiEye, FiEyeOff,
  FiCheck, FiUser,
} from 'react-icons/fi';
import { MdOutlineQuiz } from 'react-icons/md';
import { DEFAULT_AVATARS, getDefaultAvatar } from '../constants/avatars';

const API = process.env.REACT_APP_BACKEND_URL;

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_BYTES = 2 * 1024 * 1024;

// ── Avatar display ────────────────────────────────────────────────────────────

const AvatarDisplay = ({ avatarType, avatarUrl, name, size = 'lg' }) => {
  const initials = name
    ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const sizeClass = size === 'lg' ? 'w-28 h-28 text-3xl' : 'w-10 h-10 text-sm';

  if (avatarType === 'uploaded' && avatarUrl?.startsWith('data:')) {
    return (
      <img
        src={avatarUrl}
        alt="Profile"
        className={`${sizeClass} rounded-full object-cover border-4 border-blue-300 dark:border-blue-600 shadow-md`}
      />
    );
  }

  const def = getDefaultAvatar(avatarUrl);
  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br ${def.gradient} flex items-center justify-center border-4 border-blue-300 dark:border-blue-600 shadow-md select-none`}
    >
      <span className="text-white font-bold font-ten">{initials}</span>
    </div>
  );
};

// ── Section card wrapper ──────────────────────────────────────────────────────

const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-xl overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-100 dark:border-blue-800">
      <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
        <Icon className="size-4 text-white" />
      </div>
      <h2 className="font-ten font-bold text-gray-800 dark:text-white text-lg">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ── Password input with show/hide ─────────────────────────────────────────────

const PwInput = ({ label, value, onChange, placeholder, disabled }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-nine font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full p-3 pr-10 bg-transparent border border-gray-300 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-nine text-sm disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition"
          tabIndex={-1}
        >
          {show ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
        </button>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const Profile = () => {
  const { user, token, updateUser } = useAuth();
  const fileRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Name edit
  const [name, setName] = useState('');
  const [savingName, setSavingName] = useState(false);

  // Avatar
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Password
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [savingPw, setSavingPw] = useState(false);

  // ── Fetch profile ──────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setProfile(data);
        setName(data.name);
      } catch (err) {
        toast.error(err.message || 'Failed to load profile', toastOptions);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // ── Name update ───────────────────────────────────────────────────────────

  const handleNameSave = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      toast.warning('Name must be at least 2 characters', toastOptions);
      return;
    }
    setSavingName(true);
    try {
      const res = await fetch(`${API}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProfile((p) => ({ ...p, name: data.name }));
      updateUser({ name: data.name });
      toast.success('Name updated', toastOptions);
    } catch (err) {
      toast.error(err.message || 'Failed to update name', toastOptions);
    } finally {
      setSavingName(false);
    }
  };

  // ── Avatar upload ─────────────────────────────────────────────────────────

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.warning('Please upload a JPEG, PNG, or WEBP image', toastOptions);
      e.target.value = '';
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.warning('Image must be under 2 MB', toastOptions);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const avatarData = ev.target.result;
      setAvatarLoading(true);
      try {
        const res = await fetch(`${API}/api/profile/avatar/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ avatarData }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setProfile((p) => ({ ...p, avatarType: data.avatarType, avatarUrl: data.avatarUrl }));
        updateUser({ avatarType: data.avatarType, avatarUrl: data.avatarUrl });
        toast.success('Avatar updated', toastOptions);
      } catch (err) {
        toast.error(err.message || 'Upload failed', toastOptions);
      } finally {
        setAvatarLoading(false);
        e.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Default avatar select ─────────────────────────────────────────────────

  const handleSelectDefault = async (avatarId) => {
    if (profile?.avatarType === 'default' && profile?.avatarUrl === avatarId) return;
    setAvatarLoading(true);
    try {
      const res = await fetch(`${API}/api/profile/avatar/default`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ avatarId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProfile((p) => ({ ...p, avatarType: data.avatarType, avatarUrl: data.avatarUrl }));
      updateUser({ avatarType: data.avatarType, avatarUrl: data.avatarUrl });
    } catch (err) {
      toast.error(err.message || 'Failed to update avatar', toastOptions);
    } finally {
      setAvatarLoading(false);
    }
  };

  // ── Password change ───────────────────────────────────────────────────────

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) {
      toast.warning('All password fields are required', toastOptions);
      return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      toast.warning('Passwords do not match', toastOptions);
      return;
    }
    if (pwForm.newPw.length < 6) {
      toast.warning('New password must be at least 6 characters', toastOptions);
      return;
    }

    setSavingPw(true);
    try {
      const res = await fetch(`${API}/api/profile/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          currentPassword: pwForm.current,
          newPassword: pwForm.newPw,
          confirmPassword: pwForm.confirm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Password changed successfully', toastOptions);
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to change password', toastOptions);
    } finally {
      setSavingPw(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────

  if (loading) {
    return <PageLoader message="Loading profile..." />;
  }

  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '—';

  const currentAvatarId =
    profile?.avatarType === 'default' ? profile.avatarUrl : null;

  return (
    <>
      <ToastContainer />
      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="p-6 w-full md:w-10/12 mx-auto mt-10 md:mt-20 mb-20 min-h-screen">

        {/* ── Page header ── */}
        <div className="mb-10">
          <h1 className="font-first font-bold text-slate-900 dark:text-white text-4xl md:text-5xl">
            Profile
          </h1>
          <p className="font-nine text-gray-500 dark:text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col gap-6">

          {/* ── Avatar section ── */}
          <Section icon={FiCamera} title="Avatar">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              {/* Current avatar */}
              <div className="relative shrink-0">
                <AvatarDisplay
                  avatarType={profile?.avatarType}
                  avatarUrl={profile?.avatarUrl}
                  name={profile?.name}
                  size="lg"
                />
                {avatarLoading && (
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                    <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 w-full">
                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={avatarLoading}
                  className="flex items-center gap-2 px-4 py-2 border border-blue-400 text-blue-500 font-nine font-semibold text-sm rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition duration-200 disabled:opacity-50 mb-5"
                >
                  <FiCamera className="size-4" />
                  Upload Photo
                </button>
                <p className="text-xs text-gray-400 font-nine mb-5 -mt-4">
                  JPEG, PNG, or WEBP · Max 2 MB
                </p>

                {/* Default avatar palette */}
                <p className="text-xs font-nine font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Or choose a style
                </p>
                <div className="flex flex-wrap gap-3">
                  {DEFAULT_AVATARS.map((av) => {
                    const isSelected =
                      profile?.avatarType === 'default' && currentAvatarId === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => handleSelectDefault(av.id)}
                        disabled={avatarLoading}
                        title={av.name}
                        className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${av.gradient} transition duration-200 disabled:opacity-50 ${
                          isSelected
                            ? 'ring-4 ring-white dark:ring-gray-900 ring-offset-2 ring-offset-blue-500 scale-110'
                            : 'hover:scale-105 opacity-80 hover:opacity-100'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <FiCheck className="size-5 text-white drop-shadow" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Section>

          {/* ── Personal information ── */}
          <Section icon={FiUser} title="Personal Information">
            <form onSubmit={handleNameSave} className="flex flex-col gap-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-nine font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Display Name
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    disabled={savingName}
                    placeholder="Your name"
                    className="flex-1 p-3 bg-transparent border border-gray-300 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-nine text-sm disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={savingName || name.trim() === profile?.name}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-nine font-semibold text-sm rounded-md border border-orange-400 hover:shadow-md hover:shadow-orange-300 hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 whitespace-nowrap"
                  >
                    {savingName ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiEdit3 className="size-4" />
                    )}
                    Save
                  </button>
                </div>
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-nine font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile?.email ?? ''}
                  readOnly
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-md font-nine text-sm cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 font-nine mt-1">Email cannot be changed</p>
              </div>

              {/* Member since (read-only) */}
              <div>
                <label className="block text-sm font-nine font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Member Since
                </label>
                <input
                  type="text"
                  value={joinDate}
                  readOnly
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-md font-nine text-sm cursor-not-allowed"
                />
              </div>
            </form>
          </Section>

          {/* ── Account statistics ── */}
          <Section icon={FiBookOpen} title="Account Statistics">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-5 text-center">
                <div className="flex justify-center mb-2">
                  <FiEdit3 className="size-6 text-blue-500" />
                </div>
                <p className="font-thirteen font-bold text-3xl text-gray-800 dark:text-white">
                  {profile?.totalCreated ?? 0}
                </p>
                <p className="font-nine text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Quizzes Created
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-5 text-center">
                <div className="flex justify-center mb-2">
                  <MdOutlineQuiz className="size-6 text-blue-500" />
                </div>
                <p className="font-thirteen font-bold text-3xl text-gray-800 dark:text-white">
                  {profile?.totalTaken ?? 0}
                </p>
                <p className="font-nine text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Quizzes Taken
                </p>
              </div>
            </div>
          </Section>

          {/* ── Change password ── */}
          <Section icon={FiLock} title="Change Password">
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
              <PwInput
                label="Current Password"
                value={pwForm.current}
                onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
                placeholder="Enter current password"
                disabled={savingPw}
              />
              <PwInput
                label="New Password"
                value={pwForm.newPw}
                onChange={(e) => setPwForm((p) => ({ ...p, newPw: e.target.value }))}
                placeholder="At least 6 characters"
                disabled={savingPw}
              />
              <PwInput
                label="Confirm New Password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="Repeat new password"
                disabled={savingPw}
              />

              <button
                type="submit"
                disabled={savingPw}
                className="self-start flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-nine font-semibold text-sm rounded-md border border-orange-400 hover:shadow-md hover:shadow-orange-300 hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 mt-1"
              >
                {savingPw ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiLock className="size-4" />
                )}
                {savingPw ? 'Changing…' : 'Change Password'}
              </button>
            </form>
          </Section>

        </div>
      </div>
    </>
  );
};

export default Profile;
