import React, { useEffect, useState } from 'react';
import { db } from '../../services/db';
import { Student } from '../../types';
import { Button } from '../../components/ui/Button';
import { Search, Plus, Trash2, Edit2, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { FadeIn } from '../../components/ui/FadeIn';

export const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({});

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    const data = await db.getStudents();
    setStudents(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStudent.id) {
      await db.updateStudent(currentStudent.id, currentStudent);
    } else {
      await db.addStudent(currentStudent as Student);
    }
    setIsModalOpen(false);
    loadStudents();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      await db.deleteStudent(id);
      loadStudents();
    }
  };

  const exportExcel = () => {
    const data = students.map(s => ({
      "Student ID": s.studentId,
      "Name": s.name,
      "Grade": s.grade,
      "Attendance": `${s.attendance}%`,
      "Status": s.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "Students_Report.xlsx");
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Student Management</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={exportExcel}>
               <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button onClick={() => { setCurrentStudent({}); setIsModalOpen(true); }}>
               <Plus className="w-4 h-4 mr-2" /> Add Student
            </Button>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={200}>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500">
                <tr>
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Grade</th>
                  <th className="px-6 py-4">Attendance</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
                ) : filteredStudents.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8">No students found</td></tr>
                ) : (
                  filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-500">{student.studentId}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {student.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                          <div 
                            className={`h-2 rounded-full ${student.attendance >= 80 ? 'bg-green-500' : 'bg-orange-500'}`} 
                            style={{width: `${student.attendance}%`}}
                          ></div>
                        </div>
                        <span className="text-xs mt-1 block">{student.attendance}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${student.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => { setCurrentStudent(student); setIsModalOpen(true); }}
                            className="p-1 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(student.id)}
                            className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">{currentStudent.id ? 'Edit Student' : 'New Student'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900"><div className="w-6 h-6">X</div></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student ID</label>
                <input 
                  required 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentStudent.studentId || ''}
                  onChange={e => setCurrentStudent({...currentStudent, studentId: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input 
                  required 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentStudent.name || ''}
                  onChange={e => setCurrentStudent({...currentStudent, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Grade</label>
                  <input 
                    required 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentStudent.grade || ''}
                    onChange={e => setCurrentStudent({...currentStudent, grade: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Attendance (%)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    required 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentStudent.attendance || 0}
                    onChange={e => setCurrentStudent({...currentStudent, attendance: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentStudent.status || 'Active'}
                  onChange={e => setCurrentStudent({...currentStudent, status: e.target.value as 'Active' | 'Inactive'})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
                <Button type="submit" className="flex-1">Save Student</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};