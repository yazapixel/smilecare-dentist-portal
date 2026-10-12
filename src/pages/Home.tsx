import React, { useEffect, useState } from 'react';
import { Calendar, Shield, Sparkles, Clock, ArrowLeft, Star, PhoneCall } from 'lucide-react';
import type { Service, Dentist } from '../types';
import { db } from '../lib/supabase';

interface HomeProps {
  setCurrentView: (view: any) => void;
  setSelectedServiceId: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setCurrentView, setSelectedServiceId }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);

  useEffect(() => {
    db.getServices().then(setServices);
    db.getDentists().then(setDentists);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        color: 'white',
        padding: '5rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: '1.5rem' }}>
            <Sparkles size={16} /> رعاية أسنان متقدمة وبمعايير عالمية
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.25rem', lineHeight: 1.3 }}>
            ابتسامتك الثقة تبدأ من هنا في <span style={{ color: '#38bdf8' }}>سمايل كير</span>
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', color: '#e0f2fe', lineHeight: 1.8 }}>
            نقدم أحدث الحلول الطبية والتجميلية للعناية بالأسنان بأيدي نخبة من الاستشاريين والأخصائيين باستخدام أحدث التقنيات الرقمية.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-success"
              style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}
              onClick={() => setCurrentView('booking')}
            >
              <Calendar size={20} /> احجز موعدك الآن
            </button>
            <button
              className="btn"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', fontSize: '1.1rem', padding: '1rem 2rem' }}
              onClick={() => setCurrentView('my-appointments')}
            >
              استعلام عن موعد سابق
            </button>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border-color)', padding: '2rem 1.5rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '12px', borderRadius: '50%' }}>
              <Shield size={28} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <h4 style={{ fontWeight: 700 }}>ضمان الجودة والتعقيم</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>معايير تعقيم صارمة 100%</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            <div style={{ background: '#d1fae5', color: '#059669', padding: '12px', borderRadius: '50%' }}>
              <Star size={28} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <h4 style={{ fontWeight: 700 }}>أطباء استشاريون</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>خبرة طويلة وسجّل حافل</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            <div style={{ background: '#fef3c7', color: '#d97706', padding: '12px', borderRadius: '50%' }}>
              <Clock size={28} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <h4 style={{ fontWeight: 700 }}>حجز فوراً وسهل</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>تأكيد فوري ومتابعة مستمرة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge" style={{ background: '#e0f2fe', color: '#0284c7', marginBottom: '0.5rem' }}>خدماتنا الطبية المتميزة</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>اختر الخدمة المناسبة لصحة أسنانك</h2>
        </div>

        <div className="grid-3">
          {services.map(service => (
            <div key={service.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
              <div>
                <span className="badge" style={{ background: '#f1f5f9', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {service.category}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{service.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', minHeight: '60px' }}>
                  {service.description}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>يبدأ من</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7' }}>{service.price} ر.س</div>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedServiceId(service.id);
                    setCurrentView('booking');
                  }}
                >
                  احجز الآن <ArrowLeft size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors Section */}
      <section style={{ background: '#f1f5f9', padding: '4rem 0', marginTop: '3rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge" style={{ background: '#d1fae5', color: '#059669', marginBottom: '0.5rem' }}>فريقنا الطبي المتميز</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>نخبة من أفضل أطباء الأسنان</h2>
          </div>

          <div className="grid-3">
            {dentists.map(dentist => (
              <div key={dentist.id} className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                <img
                  src={dentist.avatar_url}
                  alt={dentist.name}
                  style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.25rem', border: '4px solid #e0f2fe' }}
                />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem' }}>{dentist.name}</h3>
                <p style={{ color: '#0284c7', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>{dentist.specialization}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{dentist.bio}</p>
                <button
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                  onClick={() => {
                    setCurrentView('booking');
                  }}
                >
                  حجز موعد مع الطبيب
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', borderRadius: 'var(--radius-lg)', padding: '3rem 2rem', boxShadow: 'var(--shadow-lg)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>هل تحتاج لاستشارة عاجلة أو استفسار؟</h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '1.1rem' }}>فريق خدمة العملاء جاهز للإجابة على كافة استفساراتكم طوال أيام الأسبوع.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+966112345678" className="btn btn-success" style={{ fontSize: '1.1rem', padding: '0.9rem 2rem' }}>
              <PhoneCall size={20} /> اتصل بنا الآن
            </a>
            <button className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.9rem 2rem' }} onClick={() => setCurrentView('booking')}>
              <Calendar size={20} /> احجز موعدك الإلكتروني
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
