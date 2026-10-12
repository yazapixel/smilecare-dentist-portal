import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail } from 'lucide-react';

interface PortalLoginProps {
  setIsPortalAuthenticated: (auth: boolean) => void;
  setCurrentView: (view: any) => void;
}

export const PortalLogin: React.FC<PortalLoginProps> = ({
  setIsPortalAuthenticated,
  setCurrentView,
}) => {
  const [email, setEmail] = useState<string>('admin@smilecare.com');
  const [password, setPassword] = useState<string>('••••••••');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setIsPortalAuthenticated(true);
      setCurrentView('portal-dashboard');
      setLoading(false);
    }, 600);
  };

  return (
    <div className="container" style={{ maxWidth: '500px', padding: '4rem 1.5rem' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>بوابة إدارة العيادة والأطباء</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>قم بتسجيل الدخول لإدارة المواعيد، الجداول، والخدمات الطبية</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>البريد الإلكتروني للإدارة</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>

          <button
            type="button"
            className="btn btn-outline"
            style={{ width: '100%' }}
            onClick={() => {
              setIsPortalAuthenticated(true);
              setCurrentView('portal-dashboard');
            }}
          >
            دخول سريع تجريبي (Demo Mode)
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <button
            style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setCurrentView('patient')}
          >
            ← العودة لموقع المرضى والبحث
          </button>
        </div>
      </div>
    </div>
  );
};
