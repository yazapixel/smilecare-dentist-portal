import type { Service, Dentist, Appointment } from '../types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'serv-1',
    name: 'فحص الأسنان الشامل والتنقيص',
    description: 'فحص دوري دقيق لحالة الأسنان واللثة مع إزالة الجير والترسبات وتلميع الأسنان.',
    duration_mins: 30,
    price: 250,
    category: 'عناية عامة',
    icon: 'Stethoscope'
  },
  {
    id: 'serv-2',
    name: 'تبييض الأسنان بالليزر',
    description: 'تقنية حديثة وآمنة لتبييض الأسنان واستعادة بياضها الطبيعي وإزالة التصبغات.',
    duration_mins: 60,
    price: 1200,
    category: 'تجميل الأسنان',
    icon: 'Sparkles'
  },
  {
    id: 'serv-3',
    name: 'علاج جذور الأسنان (سحب العصب)',
    description: 'علاج احترافي للأعصاب الملتهبة والمتضررة مع حشو العصب بدقة وبدون ألم.',
    duration_mins: 90,
    price: 950,
    category: 'علاج الأسنان',
    icon: 'Activity'
  },
  {
    id: 'serv-4',
    name: 'تقويم الأسنان (شفاف أو معدني)',
    description: 'تصحيح اصطفاف الأسنان وتحسين الإطباق للحصول على ابتسامة متناسقة.',
    duration_mins: 45,
    price: 3500,
    category: 'تقويم الأسنان',
    icon: 'Smile'
  },
  {
    id: 'serv-5',
    name: 'تركيبات وجسور الأسنان (فينير / كورون)',
    description: 'تركيب تلبيسات سيراميك عالية الجودة لتعويض الأسنان التالفة أو المفقودة.',
    duration_mins: 60,
    price: 1800,
    category: 'تجميل الأسنان',
    icon: 'Shield'
  },
  {
    id: 'serv-6',
    name: 'جراحة خلع الأسنان وعراجين العقل',
    description: 'خلع جراحي وآمن لأسنان العقل المندفنة أو الأسنان التالفة تحت التخدير الموضعي.',
    duration_mins: 45,
    price: 600,
    category: 'جراحة الفم',
    icon: 'Scissors'
  }
];

export const INITIAL_DENTISTS: Dentist[] = [
  {
    id: 'dent-1',
    name: 'د. أحمد الرويلي',
    specialization: 'استشاري جراحة الفم والوجه والفكين',
    email: 'ahmad.ruwaili@smilecare.com',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    bio: 'خريج جامعة الملك سعود، خبرة لأكثر من 12 عاماً في جراحة الفم وزراعة الأسنان.'
  },
  {
    id: 'dent-2',
    name: 'د. سارة المنصور',
    specialization: 'أخصائية تجميل وتقويم الأسنان',
    email: 'sara.mansour@smilecare.com',
    avatar_url: 'https://images.unsplash.com/photo-1594824813572-463283307771?w=400&auto=format&fit=crop&q=80',
    bio: 'حاصلة على البورد الأمريكي في تقويم الأسنان وتصميم الابتسامة الرقمية.'
  },
  {
    id: 'dent-3',
    name: 'د. فيصل الشمري',
    specialization: 'أخصائي علاج عحب وجذور الأسنان',
    email: 'faisal.shammari@smilecare.com',
    avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
    bio: 'متخصص في علاج الحالات المعقدة لسحب العصب واستخدام أحدث التقنيات المجهرية.'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    service_id: 'serv-1',
    dentist_id: 'dent-1',
    patient_name: 'محمد عبدالله القحطاني',
    patient_email: 'mohammed@example.com',
    patient_phone: '0501234567',
    appointment_date: '2026-10-15',
    time_slot: '09:30 ص',
    status: 'confirmed',
    notes: 'يعاني من حساسية خفيفة في الضرس الأيمن العلوي.',
    created_at: '2026-10-10T10:00:00Z'
  },
  {
    id: 'apt-102',
    service_id: 'serv-2',
    dentist_id: 'dent-2',
    patient_name: 'نورة خالد السعيد',
    patient_email: 'noura@example.com',
    patient_phone: '0559876543',
    appointment_date: '2026-10-15',
    time_slot: '11:00 ص',
    status: 'pending',
    notes: 'رغبة في تبييض الأسنان قبل مناسبة زفاف.',
    created_at: '2026-10-11T14:30:00Z'
  },
  {
    id: 'apt-103',
    service_id: 'serv-3',
    dentist_id: 'dent-3',
    patient_name: 'عبدالرحمن خالد العتيبي',
    patient_email: 'abdulrahman@example.com',
    patient_phone: '0541112233',
    appointment_date: '2026-10-16',
    time_slot: '01:30 م',
    status: 'confirmed',
    notes: 'ألم حاد في الضرس السفل، يحتاج كشف عاجل.',
    created_at: '2026-10-11T16:00:00Z'
  }
];

export const TIME_SLOTS = [
  '09:00 ص',
  '09:45 ص',
  '10:30 ص',
  '11:15 ص',
  '12:00 م',
  '01:00 م',
  '01:45 م',
  '02:30 م',
  '03:15 م',
  '04:00 م',
  '05:00 م',
  '06:00 م'
];
