import React from 'react';
import { Stethoscope, Calendar, User, ShieldCheck, Home } from 'lucide-react';

interface NavbarProps {
  currentView: 'patient' | 'booking' | 'my-appointments' | 'portal-login' | 'portal-dashboard' | 'portal-appointments' | 'portal-services';
  setCurrentView: (view: any) => void;
  isPortalAuthenticated: boolean;
  setIsPortalAuthenticated: (auth: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  isPortalAuthenticated,
  setIsPortalAuthenticated,
}) => {
  const isPortalView = currentView.startsWith('portal-');

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo-brand" onClick={() => setCurrentView(isPortalView && isPortalAuthenticated ? 'portal-dashboard' : 'patient')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <Stethoscope size={24} />
          </div>
          <span>عيادة سمايل كير (SmileCare)</span>
        </div>

        <div className="nav-links">
          {!isPortalView ? (
            <>
              <button
                className={`nav-link ${currentView === 'patient' ? 'active' : ''}`}
                onClick={() => setCurrentView('patient')}
              >
                <Home size={18} style={{ display: 'inline', marginLeft: '6px' }} />
                الرئيسية
              </button>
              <button
                className={`nav-link ${currentView === 'booking' ? 'active' : ''}`}
                onClick={() => setCurrentView('booking')}
              >
                <Calendar size={18} style={{ display: 'inline', marginLeft: '6px' }} />
                حجز موعد جديد
              </button>
              <button
                className={`nav-link ${currentView === 'my-appointments' ? 'active' : ''}`}
                onClick={() => setCurrentView('my-appointments')}
              >
                <User size={18} style={{ display: 'inline', marginLeft: '6px' }} />
                مواعيدي وحالة الحجز
              </button>
              <button
                className="portal-toggle-btn"
                onClick={() => setCurrentView(isPortalAuthenticated ? 'portal-dashboard' : 'portal-login')}
              >
                <ShieldCheck size={18} />
                بوابة الطبيب
              </button>
            </>
          ) : (
            <>
              {isPortalAuthenticated && (
                <>
                  <button
                    className={`nav-link ${currentView === 'portal-dashboard' ? 'active' : ''}`}
                    onClick={() => setCurrentView('portal-dashboard')}
                  >
                    لوحة القيادة
                  </button>
                  <button
                    className={`nav-link ${currentView === 'portal-appointments' ? 'active' : ''}`}
                    onClick={() => setCurrentView('portal-appointments')}
                  >
                    إدارة المواعيد
                  </button>
                  <button
                    className={`nav-link ${currentView === 'portal-services' ? 'active' : ''}`}
                    onClick={() => setCurrentView('portal-services')}
                  >
                    الخدمات والأطباء
                  </button>
                </>
              )}
              <button
                className="portal-toggle-btn"
                style={{ background: '#ef4444' }}
                onClick={() => {
                  if (isPortalAuthenticated) {
                    setIsPortalAuthenticated(false);
                  }
                  setCurrentView('patient');
                }}
              >
                {isPortalAuthenticated ? 'تسجيل خروج' : 'العودة لموقع المرضى'}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
