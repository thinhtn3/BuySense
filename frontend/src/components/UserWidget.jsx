import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import AuthModal from '@/components/AuthModal.jsx';

export default function UserWidget() {
  const { user, signOut } = useAuth();
  const [modalOpen,    setModalOpen]    = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [signingOut,   setSigningOut]   = useState(false);

  const initial = user?.email?.[0]?.toUpperCase() ?? '?';

  async function handleSignOut() {
    setSigningOut(true);
    try { await signOut(); } finally { setSigningOut(false); setMenuOpen(false); }
  }

  if (!user) {
    return (
      <>
        <button className="uw-signin-btn" onClick={() => setModalOpen(true)}>
          Sign in
        </button>

        {modalOpen && createPortal(
          <AuthModal onClose={() => setModalOpen(false)} />,
          document.body
        )}
      </>
    );
  }

  return (
    <div className="uw-wrap">
      <button
        className="uw-avatar"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={menuOpen}
      >
        {initial}
      </button>

      {menuOpen && (
        <>
          <div className="uw-menu-backdrop" onClick={() => setMenuOpen(false)} />
          <div className="uw-menu">
            <p className="uw-menu__email">{user.email}</p>
            <button
              className="uw-menu__signout"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
