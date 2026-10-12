export interface Service {
  id: string;
  name: string;
  description: string;
  duration_mins: number;
  price: number;
  category: string;
  icon?: string;
}

export interface Dentist {
  id: string;
  name: string;
  specialization: string;
  email: string;
  avatar_url: string;
  bio?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  service_id: string;
  dentist_id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_date: string; // YYYY-MM-DD
  time_slot: string; // e.g. "09:00 ص"
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  // Joined fields for display
  service?: Service;
  dentist?: Dentist;
}

export interface WorkingHour {
  id: string;
  dentist_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string;
  end_time: string;
  is_active: boolean;
}
