
export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  shortDescription: string;
  longDescription: string;
  tags: string[];
  link?: string;
}

export interface PersonalInfo {
  dob: string;
  pob: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
}

export interface Reference {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
}

export interface ProfileData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  imageUrl?: string;
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  personalInfo: PersonalInfo;
  reference: Reference;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  grade: string;
  attendance: number; // Percentage
  status: 'Active' | 'Inactive';
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalMessages: number;
  avgAttendance: number;
}
