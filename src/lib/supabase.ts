import { createClient } from '@supabase/supabase-js';
import type { Service, Dentist, Appointment } from '../types';
import { INITIAL_SERVICES, INITIAL_DENTISTS, INITIAL_APPOINTMENTS } from '../data/mockData';

// Get Supabase URL and anon key from env if available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// LocalStorage fallback storage service
const STORAGE_KEYS = {
  SERVICES: 'smilecare_services',
  DENTISTS: 'smilecare_dentists',
  APPOINTMENTS: 'smilecare_appointments',
};

export function getStoredData<T>(key: string, initialData: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return initialData;
  }
}

export function setStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Error writing localStorage:', err);
  }
}

// Unified API service layer supporting both Supabase and LocalStorage fallback
export const db = {
  async getServices(): Promise<Service[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('services').select('*');
      if (!error && data) return data as Service[];
    }
    return getStoredData<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  },

  async addService(service: Omit<Service, 'id'>): Promise<Service> {
    const newService: Service = {
      ...service,
      id: 'serv-' + Date.now(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('services').insert([service]).select().single();
      if (!error && data) return data as Service;
    }
    const current = getStoredData<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    const updated = [newService, ...current];
    setStoredData(STORAGE_KEYS.SERVICES, updated);
    return newService;
  },

  async getDentists(): Promise<Dentist[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('dentists').select('*');
      if (!error && data) return data as Dentist[];
    }
    return getStoredData<Dentist[]>(STORAGE_KEYS.DENTISTS, INITIAL_DENTISTS);
  },

  async getAppointments(): Promise<Appointment[]> {
    let rawAppointments: Appointment[] = [];
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
      if (!error && data) rawAppointments = data as Appointment[];
    } else {
      rawAppointments = getStoredData<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    }

    // Enrich with service and dentist details
    const services = await this.getServices();
    const dentists = await this.getDentists();

    return rawAppointments.map(apt => ({
      ...apt,
      service: services.find(s => s.id === apt.service_id) || services[0],
      dentist: dentists.find(d => d.id === apt.dentist_id) || dentists[0]
    }));
  },

  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'status'>): Promise<Appointment> {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: 'apt-' + Math.floor(1000 + Math.random() * 9000),
      status: 'pending',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('appointments').insert([{
        service_id: newAppointment.service_id,
        dentist_id: newAppointment.dentist_id,
        patient_name: newAppointment.patient_name,
        patient_email: newAppointment.patient_email,
        patient_phone: newAppointment.patient_phone,
        appointment_date: newAppointment.appointment_date,
        time_slot: newAppointment.time_slot,
        status: newAppointment.status,
        notes: newAppointment.notes
      }]).select().single();

      if (!error && data) {
        const services = await this.getServices();
        const dentists = await this.getDentists();
        return {
          ...data,
          service: services.find(s => s.id === data.service_id),
          dentist: dentists.find(d => d.id === data.dentist_id)
        };
      }
    }

    const current = getStoredData<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    const updated = [newAppointment, ...current];
    setStoredData(STORAGE_KEYS.APPOINTMENTS, updated);

    const services = await this.getServices();
    const dentists = await this.getDentists();
    return {
      ...newAppointment,
      service: services.find(s => s.id === newAppointment.service_id),
      dentist: dentists.find(d => d.id === newAppointment.dentist_id)
    };
  },

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('appointments').update({ status }).eq('id', id);
      return;
    }
    const current = getStoredData<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    const updated = current.map(apt => apt.id === id ? { ...apt, status } : apt);
    setStoredData(STORAGE_KEYS.APPOINTMENTS, updated);
  }
};
