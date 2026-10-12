import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import type { Appointment } from '../../types';
import { db } from '../../lib/supabase';

interface PortalDashboardProps {
  setCurrentView: (view: any) => void;
}

export const PortalDashboard: React.FC<PortalDashboardProps> = ({ setCurrentView }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    db.getAppointments().then(apts => {
      setAppointments(apts);
    });
  }, []);

  const totalRevenue = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'completed')
    .reduce((sum, a) => sum + (a.service?.price || 0), 0);

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge" style={{ background: '#e0f2fe', color: '#0284c7', marginBottom: '0.5rem' }}>بوابة إدارة العيادة</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>لوحة قيادة الأطباء والإدارة</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => setCurrentView('portal-appointments')}>
            إدارة كافة المواعيد <ArrowLeft size={16} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <Calendar size={28} />
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>إجمالي المواعيد</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{appointments.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: '#fef3c7', color: '#d97706', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <Clock size={28} />
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>قيد الانتظار والتأكيد</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{pendingCount}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: '#d1fae5', color: '#059669', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle2 size={28} />
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>المواعيد المؤكدة</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{confirmedCount}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: '#f1f5f9', color: '#0f172a', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <DollarSign size={28} />
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>الإيرادات المتوقعة</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7' }}>{totalRevenue} ر.س</div>
          </div>
        </div>
      </div>

      {/* Recent Appointments Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>أحدث المواعيد المحجوزة</h2>
          <button
            style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setCurrentView('portal-appointments')}
          >
            عرض الكل ←
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <th style={{ padding: '0.75rem' }}>رقم الحجز</th>
                <th style={{ padding: '0.75rem' }}>المريض</th>
                <th style={{ padding: '0.75rem' }}>الخدمة</th>
                <th style={{ padding: '0.75rem' }}>الطبيب</th>
                <th style={{ padding: '0.75rem' }}>التاريخ والوقت</th>
                <th style={{ padding: '0.75rem' }}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0, 5).map(apt => (
                <tr key={apt.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: 700, color: 'var(--primary)' }}>#{apt.id}</td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <div><strong>{apt.patient_name}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{apt.patient_phone}</div>
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>{apt.service?.name}</td>
                  <td style={{ padding: '1rem 0.75rem' }}>{apt.dentist?.name}</td>
                  <td style={{ padding: '1rem 0.75rem' }}>{apt.appointment_date} ({apt.time_slot})</td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <span className={`badge badge-${apt.status}`}>
                      {apt.status === 'confirmed' ? 'مؤكد' : apt.status === 'pending' ? 'قيد المراجعة' : apt.status === 'completed' ? 'مكتمل' : 'ملغي'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
