import React, { useState, useEffect } from 'react';
import type { Appointment } from '../../types';
import { db } from '../../lib/supabase';

export const PortalAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    const data = await db.getAppointments();
    setAppointments(data);
  };

  const handleStatusChange = async (id: string, newStatus: Appointment['status']) => {
    await db.updateAppointmentStatus(id, newStatus);
    await loadAppointments();
  };

  const filtered = appointments.filter(apt => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesSearch =
      apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patient_phone.includes(searchTerm) ||
      apt.id.toLowerCase().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge" style={{ background: '#e0f2fe', color: '#0284c7', marginBottom: '0.5rem' }}>إدارة العيادة</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>إدارة مواعيد المرضى</h1>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(st => (
            <button
              key={st}
              className={`btn ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              onClick={() => setStatusFilter(st)}
            >
              {st === 'all' ? 'الكل' : st === 'pending' ? 'قيد المراجعة' : st === 'confirmed' ? 'مؤكدة' : st === 'completed' ? 'مكتملة' : 'ملغية'}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث باسم المريض، رقم الجوال، أو رقم الحجز..."
          style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '1rem' }}
        />
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <th style={{ padding: '0.75rem' }}>المرجع</th>
                <th style={{ padding: '0.75rem' }}>المريض</th>
                <th style={{ padding: '0.75rem' }}>الخدمة الطبية</th>
                <th style={{ padding: '0.75rem' }}>الطبيب</th>
                <th style={{ padding: '0.75rem' }}>التاريخ والوقت</th>
                <th style={{ padding: '0.75rem' }}>ملاحظات المريض</th>
                <th style={{ padding: '0.75rem' }}>الحالة</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    لا توجد مواعيد مطابقة.
                  </td>
                </tr>
              ) : (
                filtered.map(apt => (
                  <tr key={apt.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                    <td style={{ padding: '1rem 0.75rem', fontWeight: 700, color: 'var(--primary)' }}>#{apt.id}</td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <div><strong>{apt.patient_name}</strong></div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{apt.patient_phone}</div>
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <div>{apt.service?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{apt.service?.price} ر.س</div>
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>{apt.dentist?.name}</td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <div>{apt.appointment_date}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{apt.time_slot}</div>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '200px' }}>
                      {apt.notes || 'لا توجد ملاحظات'}
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <span className={`badge badge-${apt.status}`}>
                        {apt.status === 'confirmed' ? 'مؤكد' : apt.status === 'pending' ? 'قيد المراجعة' : apt.status === 'completed' ? 'مكتمل' : 'ملغي'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        {apt.status !== 'confirmed' && (
                          <button
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            onClick={() => handleStatusChange(apt.id, 'confirmed')}
                          >
                            تأكيد
                          </button>
                        )}
                        {apt.status !== 'completed' && (
                          <button
                            className="btn btn-success"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            onClick={() => handleStatusChange(apt.id, 'completed')}
                          >
                            إتمام
                          </button>
                        )}
                        {apt.status !== 'cancelled' && (
                          <button
                            className="btn"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: '#fee2e2', color: '#dc2626' }}
                            onClick={() => handleStatusChange(apt.id, 'cancelled')}
                          >
                            إلغاء
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
