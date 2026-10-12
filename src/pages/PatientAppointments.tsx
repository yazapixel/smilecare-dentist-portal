import React, { useState, useEffect } from 'react';
import { Search, Calendar, Phone, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import type { Appointment } from '../types';
import { db } from '../lib/supabase';

interface PatientAppointmentsProps {
  setCurrentView: (view: any) => void;
}

export const PatientAppointments: React.FC<PatientAppointmentsProps> = ({ setCurrentView }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filtered, setFiltered] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    db.getAppointments().then(data => {
      setAppointments(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFiltered(appointments);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFiltered(
      appointments.filter(
        apt =>
          apt.patient_name.toLowerCase().includes(term) ||
          apt.patient_phone.includes(term) ||
          apt.id.toLowerCase().includes(term)
      )
    );
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-confirmed"><CheckCircle2 size={14} /> مؤكد</span>;
      case 'pending':
        return <span className="badge badge-pending"><Clock size={14} /> قيد المراجعة</span>;
      case 'completed':
        return <span className="badge badge-completed"><CheckCircle2 size={14} /> مكتمل</span>;
      case 'cancelled':
        return <span className="badge badge-cancelled"><XCircle size={14} /> ملغي</span>;
    }
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>مواعيدي وحالة الحجز</h1>
        <p style={{ color: 'var(--text-muted)' }}>ابحث برقم الجوال أو اسم المريض لعرض حالة مواعيدك السابقة والحالية</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث برقم الجوال (مثال: 0501234567) أو رقم المرجع (مثال: apt-101)"
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '1rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <Search size={18} /> بحث
          </button>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>جاري تحميل المواعيد...</div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>لا توجد مواعيد مطابقة للبحث</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>تأكد من صحة رقم الجوال أو قم بحجز موعد جديد.</p>
          <button className="btn btn-primary" onClick={() => setCurrentView('booking')}>
            حجز موعد جديد
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.map(apt => (
            <div key={apt.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>#{apt.id}</span>
                  {getStatusBadge(apt.status)}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>{apt.service?.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  الطبيب المعالج: <strong>{apt.dentist?.name}</strong>
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span><Calendar size={14} style={{ display: 'inline', marginLeft: '4px' }} /> {apt.appointment_date}</span>
                  <span><Clock size={14} style={{ display: 'inline', marginLeft: '4px' }} /> {apt.time_slot}</span>
                  <span><Phone size={14} style={{ display: 'inline', marginLeft: '4px' }} /> {apt.patient_phone}</span>
                </div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7', marginBottom: '0.25rem' }}>
                  {apt.service?.price} ر.س
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>المريض: {apt.patient_name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
