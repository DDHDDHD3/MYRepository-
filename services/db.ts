import { INITIAL_PROFILE, INITIAL_STUDENTS } from '../constants';
import { Message, ProfileData, Student } from '../types';

// Keys for localStorage
const KEYS = {
  PROFILE: 'app_profile',
  STUDENTS: 'app_students',
  MESSAGES: 'app_messages',
};

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockDB {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(KEYS.PROFILE)) {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
    }
    if (!localStorage.getItem(KEYS.STUDENTS)) {
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    }
    if (!localStorage.getItem(KEYS.MESSAGES)) {
      localStorage.setItem(KEYS.MESSAGES, JSON.stringify([]));
    }
  }

  // --- Profile Operations ---
  getProfile(): ProfileData {
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : INITIAL_PROFILE;
  }

  saveProfile(data: ProfileData): void {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(data));
  }

  // --- Student Operations ---
  async getStudents(): Promise<Student[]> {
    await delay(300); // Simulate network
    const data = localStorage.getItem(KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  }

  async addStudent(student: Omit<Student, 'id'>): Promise<Student> {
    const students = await this.getStudents();
    const newStudent = { ...student, id: Math.random().toString(36).substr(2, 9) };
    students.push(newStudent);
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
    return newStudent;
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<void> {
    const students = await this.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...updates };
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
    }
  }

  async deleteStudent(id: string): Promise<void> {
    let students = await this.getStudents();
    students = students.filter(s => s.id !== id);
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
  }

  // --- Message Operations ---
  async getMessages(): Promise<Message[]> {
    await delay(200);
    const data = localStorage.getItem(KEYS.MESSAGES);
    return data ? JSON.parse(data) : [];
  }

  async sendMessage(msg: Omit<Message, 'id' | 'date' | 'read'>): Promise<void> {
    await delay(500);
    const messages = await this.getMessages();
    const newMessage: Message = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      read: false
    };
    messages.unshift(newMessage);
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
  }

  async markMessageRead(id: string): Promise<void> {
    const messages = await this.getMessages();
    const index = messages.findIndex(m => m.id === id);
    if (index !== -1) {
      messages[index].read = true;
      localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
    }
  }
}

export const db = new MockDB();