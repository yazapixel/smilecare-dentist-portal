import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { BookingWizard } from './pages/BookingWizard';
import { PatientAppointments } from './pages/PatientAppointments';
import { PortalLogin } from './pages/portal/PortalLogin';
import { PortalDashboard } from './pages/portal/PortalDashboard';
import { PortalAppointments } from './pages/portal/PortalAppointments';
import { PortalServices } from './pages/portal/PortalServices';
import { isSupabaseConfigured } from './lib/supabase';

export function App() {
  const [currentView, setCurrentView] = useState<
    | 'patient'
    | 'booking'
    | 'my-appointments'
    | 'portal-login'
    | 'portal-dashboard'
    | 'portal-appointments'
    | 'portal-services'
  >('patient');

  const [isPortalAuthenticated, setIsPortalAuthenticated] = useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');

  return (
    <div className="app-container">
      {/* Optional banner if Supabase not configured */}
      {!isSupabaseConfigured && (
        <div style={{ background: '#fef3c7', color: '#92400e', padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.85rem', borderBottom: '1px solid #fde68a' }}>
          💡 <strong>وضع المعاينة المحلية (Demo Mode):</strong> يعمل التطبيق حالياً بالذاكرة المحلية (LocalStorage). لربط قاعدة بيانات Supabase الحقيقية، قم بإضافة المتغيرات في ملف <code>.env</code>.
        </div>
      )}

      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isPortalAuthenticated={isPortalAuthenticated}
        setIsPortalAuthenticated={setIsPortalAuthenticated}
      />

      <main className="main-content">
        {currentView === 'patient' && (
          <Home
            setCurrentView={setCurrentView}
            setSelectedServiceId={setSelectedServiceId}
          />
        )}
        {currentView === 'booking' && (
          <BookingWizard
            selectedServiceId={selectedServiceId}
            setSelectedServiceId={setSelectedServiceId}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === 'my-appointments' && (
          <PatientAppointments setCurrentView={setCurrentView} />
        )}
        {currentView === 'portal-login' && (
          <PortalLogin
            setIsPortalAuthenticated={setIsPortalAuthenticated}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === 'portal-dashboard' && (
          <PortalDashboard setCurrentView={setCurrentView} />
        )}
        {currentView === 'portal-appointments' && <PortalAppointments />}
        {currentView === 'portal-services' && <PortalServices />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
