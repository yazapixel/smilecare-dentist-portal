import React from 'react';
import { Stethoscope, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <div className="logo-brand" style={{ color: 'white', marginBottom: '1rem' }}>
            <div className="logo-icon">
              <Stethoscope size={22} />
            </div>
            <span>عيادة سمايل كير</span>
          </div>
          <p>
            نخبة من أخصائيي الأسنان وأحدث التقنيات الطبية لنضمن لك ابتسامة مشرقة وصحة فموية متكاملة.
          </p>
        </div>

        <div className="footer-col">
          <h3>ساعات العمل</h3>
          <p>السبت - الخميس: 09:00 صباحاً - 09:00 مساءً</p>
          <p>الجمعة: مغلق (حالات الطوارئ فقط)</p>
        </div>

        <div className="footer-col">
          <h3>تواصل معنا</h3>
          <p><MapPin size={16} style={{ display: 'inline', marginLeft: '6px' }} /> شارع الملك فهد، الرياض، المملكة العربية السعودية</p>
          <p><Phone size={16} style={{ display: 'inline', marginLeft: '6px' }} /> +966 11 234 5678</p>
          <p><Mail size={16} style={{ display: 'inline', marginLeft: '6px' }} /> info@smilecare.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>جميع الحقوق محفوظة © 2026 عيادة سمايل كير للأسنان. مدعوم بواسطة قاعدة بيانات Supabase.</p>
      </div>
    </footer>
  );
};
