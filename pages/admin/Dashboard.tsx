import React, { useEffect, useState } from 'react';
import { db } from '../../services/db';
import { Student, Message } from '../../types';
import { Users, MessageSquare, UserCheck, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FadeIn } from '../../components/ui/FadeIn';

export const Dashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const s = await db.getStudents();
      const m = await db.getMessages();
      setStudents(s);
      setMessages(m);
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Active Students', value: students.filter(s => s.status === 'Active').length, icon: UserCheck, color: 'bg-green-500' },
    { label: 'Total Messages', value: messages.length, icon: MessageSquare, color: 'bg-purple-500' },
    { label: 'Avg Attendance', value: `${Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / (students.length || 1))}%`, icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const chartData = students.map(s => ({
    name: s.name.split(' ')[0],
    attendance: s.attendance
  }));

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
      </FadeIn>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <FadeIn key={i} delay={i * 100} direction="up">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center justify-between h-full">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Chart */}
        <FadeIn delay={400} className="h-full">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Student Attendance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="attendance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeIn>

        {/* Recent Activity */}
        <FadeIn delay={500} className="h-full">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Messages</h3>
            <div className="space-y-4">
              {messages.slice(0, 3).map((msg) => (
                <div key={msg.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                   <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                      {msg.name.charAt(0)}
                   </div>
                   <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">{msg.subject}</p>
                      <p className="text-sm text-slate-500 truncate">{msg.email}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(msg.date).toLocaleDateString()}</p>
                   </div>
                </div>
              ))}
              {messages.length === 0 && <p className="text-slate-400 text-sm">No messages yet.</p>}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};