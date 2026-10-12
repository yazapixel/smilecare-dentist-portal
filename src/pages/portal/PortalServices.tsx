import React, { useState, useEffect } from 'react';
import { Plus, Clock } from 'lucide-react';
import type { Service, Dentist } from '../../types';
import { db } from '../../lib/supabase';

export const PortalServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);

  // Add service modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [duration, setDuration] = useState<string>('30');
  const [category, setCategory] = useState<string>('عناية عامة');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [servs, dens] = await Promise.all([db.getServices(), db.getDentists()]);
    setServices(servs);
    setDentists(dens);
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    await db.addService({
      name,
      description,
      price: Number(price),
      duration_mins: Number(duration),
      category
    });

    setName('');
    setDescription('');
    setPrice('');
    setShowAddModal(false);
    loadData();
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge" style={{ background: '#e0f2fe', color: '#0284c7', marginBottom: '0.5rem' }}>إدارة العيادة</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>الخدمات والأطباء</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> إضافة خدمة جديدة
        </button>
      </div>

      {/* Services Section */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>الخدمات الطبية المتاحة</h2>
      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        {services.map(serv => (
          <div key={serv.id} className="card">
            <span className="badge" style={{ background: '#f1f5f9', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              {serv.category}
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{serv.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{serv.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{serv.price} ر.س</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><Clock size={14} style={{ display: 'inline', marginLeft: '4px' }} /> {serv.duration_mins} دقيقة</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dentists Section */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>الأطباء المقيدون بالعيادة</h2>
      <div className="grid-3">
        {dentists.map(dent => (
          <div key={dent.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src={dent.avatar_url}
              alt={dent.name}
              style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e0f2fe' }}
            />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{dent.name}</h3>
              <p style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>{dent.specialization}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dent.email}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
          padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', background: 'white' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }}>إضافة خدمة طبية جديدة</h2>
            <form onSubmit={handleAddService}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>اسم الخدمة</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: تنظيف وتلميع متقدم"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>التصنيف</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>السعر (ر.س)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="300"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>المدة (بالدقائق)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>وصف الخدمة</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  حفظ وإضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
