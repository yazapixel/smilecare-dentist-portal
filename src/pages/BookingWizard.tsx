import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { Service, Dentist, Appointment } from '../types';
import { db } from '../lib/supabase';
import { TIME_SLOTS } from '../data/mockData';

interface BookingWizardProps {
  selectedServiceId: string;
  setSelectedServiceId: (id: string) => void;
  setCurrentView: (view: any) => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  selectedServiceId,
  setCurrentView,
}) => {
  const [step, setStep] = useState<number>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const [patientName, setPatientName] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    db.getServices().then(servs => {
      setServices(servs);
      if (selectedServiceId) {
        const found = servs.find(s => s.id === selectedServiceId);
        if (found) setSelectedService(found);
      } else if (servs.length > 0) {
        setSelectedService(servs[0]);
      }
    });

    db.getDentists().then(dens => {
      setDentists(dens);
      if (dens.length > 0) setSelectedDentist(dens[0]);
    });

    // Default to tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, [selectedServiceId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDentist || !selectedDate || !selectedTime || !patientName || !patientPhone) {
      alert('يرجى ملء جميع الحقول الإلزامية.');
      return;
    }

    setLoading(true);
    try {
      const newApt = await db.createAppointment({
        service_id: selectedService.id,
        dentist_id: selectedDentist.id,
        patient_name: patientName,
        patient_email: patientEmail,
        patient_phone: patientPhone,
        appointment_date: selectedDate,
        time_slot: selectedTime,
        notes,
      });
      setCreatedAppointment(newApt);
      setStep(5); // Success step
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حجز الموعد. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>حجز موعد جديد في العيادة</h1>
        <p style={{ color: 'var(--text-muted)' }}>أتمم الخطوات التالية بكل سهولة لتأكيد موعدك الطبي</p>

        {/* Progress Bar */}
        {step < 5 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                style={{
                  width: '50px',
                  height: '6px',
                  borderRadius: '3px',
                  background: step >= s ? 'var(--primary)' : 'var(--border-color)',
                  transition: 'var(--transition)'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Step 1: Select Service */}
      {step === 1 && (
        <div className="card">
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }}>1. اختر الخدمة الطبية المطلوبة</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {services.map(serv => (
              <div
                key={serv.id}
                onClick={() => setSelectedService(serv)}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: selectedService?.id === serv.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: selectedService?.id === serv.id ? 'rgba(2, 132, 199, 0.05)' : 'white',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontWeight: 700 }}>{serv.name}</h4>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{serv.price} ر.س</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{serv.description}</p>
                <span className="badge" style={{ background: '#f1f5f9', color: 'var(--text-muted)' }}>
                  المدة: {serv.duration_mins} دقيقة
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={() => setStep(2)}>
              التالي <ArrowLeft size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Dentist */}
      {step === 2 && (
        <div className="card">
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }}>2. اختر الطبيب المعالج</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {dentists.map(dent => (
              <div
                key={dent.id}
                onClick={() => setSelectedDentist(dent)}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: selectedDentist?.id === dent.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: selectedDentist?.id === dent.id ? 'rgba(2, 132, 199, 0.05)' : 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'var(--transition)'
                }}
              >
                <img
                  src={dent.avatar_url}
                  alt={dent.name}
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem', border: '3px solid #e0f2fe' }}
                />
                <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{dent.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{dent.specialization}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dent.bio}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-outline" onClick={() => setStep(1)}>
              <ArrowRight size={18} /> السابق
            </button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>
              التالي <ArrowLeft size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Date & Time */}
      {step === 3 && (
        <div className="card">
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }}>3. اختر التاريخ والوقت المناسب</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>تاريخ الموعد:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '1rem' }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem' }}>الأوقات المتاحة:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem' }}>
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: selectedTime === slot ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: selectedTime === slot ? 'var(--primary)' : 'white',
                    color: selectedTime === slot ? 'white' : 'var(--text-main)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-outline" onClick={() => setStep(2)}>
              <ArrowRight size={18} /> السابق
            </button>
            <button
              className="btn btn-primary"
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(4)}
            >
              التالي <ArrowLeft size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Patient Info */}
      {step === 4 && (
        <div className="card">
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }}>4. بيانات المريض الشخصية</h2>

          {/* Summary Box */}
          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <div><strong>الخدمة:</strong> {selectedService?.name} ({selectedService?.price} ر.س)</div>
            <div><strong>الطبيب:</strong> {selectedDentist?.name}</div>
            <div><strong>الموعد:</strong> {selectedDate} في تمام الساعة {selectedTime}</div>
          </div>

          <form onSubmit={handleBookingSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>الاسم الثلاثي *</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="مثال: محمد عبدالله العتيبي"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>رقم الجوال *</label>
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="05xxxxxxxx"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>البريد الإلكتروني</label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>ملاحظات طبية أو أعراض (اختياري)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="هل تعاني من حساسية أدوية أو أعراض معينة؟"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-outline" onClick={() => setStep(3)}>
                <ArrowRight size={18} /> السابق
              </button>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'جاري الحجز...' : 'تأكيد وحجز الموعد'} <Check size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 5: Success Confirmation */}
      {step === 5 && createdAppointment && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ background: '#d1fae5', color: '#059669', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={42} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>تم حجز موعدك بنجاح!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>شكراً لك {createdAppointment.patient_name}، تم تسجيل موعدك في النظام بنجاح.</p>

          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', maxWidth: '500px', margin: '0 auto 2rem', textAlign: 'right' }}>
            <div style={{ marginBottom: '0.5rem' }}><strong>رقم الحجز المرجع:</strong> <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{createdAppointment.id}</span></div>
            <div style={{ marginBottom: '0.5rem' }}><strong>الخدمة:</strong> {createdAppointment.service?.name}</div>
            <div style={{ marginBottom: '0.5rem' }}><strong>الطبيب:</strong> {createdAppointment.dentist?.name}</div>
            <div style={{ marginBottom: '0.5rem' }}><strong>التاريخ والوقت:</strong> {createdAppointment.appointment_date} | {createdAppointment.time_slot}</div>
            <div><strong>حالة الحجز:</strong> <span className="badge badge-pending">قيد التأكيد من العيادة</span></div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => setCurrentView('my-appointments')}>
              عرض مواعيدي
            </button>
            <button className="btn btn-outline" onClick={() => { setStep(1); setCreatedAppointment(null); }}>
              حجز موعد آخر
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
