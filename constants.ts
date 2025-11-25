
import { ProfileData, Student } from './types';

export const INITIAL_PROFILE: ProfileData = {
  name: "Abdullahi Muse Isse",
  title: "Multimedia & System Management Specialist",
  location: "Mogadishu, Banaadir, Somalia",
  phone: "+252 61 4163362",
  email: "abdallaise877@gmail.com",
  imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80",
  summary: "A highly motivated and dedicated individual seeking a challenging position in a dynamic and professional working environment. I aim to utilize my diverse skills in multimedia production, including graphic design, video editing, and digital content creation, as well as my practical experience in system management.",
  personalInfo: {
    dob: "11 September 1999",
    pob: "Galdogob",
    gender: "Male",
    maritalStatus: "Single",
    nationality: "Somali"
  },
  reference: {
    name: "Macalim Zakria Imi",
    role: "Manager",
    email: "Zakariamacalin123@gmail.com",
    phone: "+252 61 7654470",
    location: "Mogadishu, Banadir, Somalia"
  },
  experience: [
    {
      id: "1",
      role: "Sales Assistant",
      company: "Qabas Alhoda",
      duration: "Jan 2025 - June 2025",
      description: [
        "Managed customer transactions and inventory updates.",
        "Supported system-based data entry and digital records."
      ]
    },
    {
      id: "2",
      role: "Multimedia & System Management Assistant",
      company: "Freelance / Qabas Alhoda",
      duration: "Jan 2025 - June 2025",
      description: [
        "Designed promotional materials using multimedia tools.",
        "Managed databases for registration and data tracking.",
        "Supported IT systems, including user accounts and digital filing."
      ]
    }
  ],
  education: [
    {
      id: "1",
      degree: "Information Technology (IT)",
      school: "City University of Mogadishu",
      year: "2024 - 2025"
    },
    {
      id: "2",
      degree: "MEAN Stack Web Development",
      school: "Tabaarak ICT Solution",
      year: "Aug - Sep"
    },
    {
      id: "3",
      degree: "Secondary School Certificate",
      school: "Mujamac Yaqshid Secondary",
      year: "2019 - 2020"
    }
  ],
  skills: [
    {
      category: "Multimedia",
      items: ["Video editing", "Photography", "Graphic Design"]
    },
    {
      category: "System Mgmt",
      items: ["Data entry", "Record management", "User support"]
    },
    {
      category: "Languages",
      items: ["Somali (Native)", "English", "Arabic"]
    },
    {
      category: "Soft Skills",
      items: ["Communication", "Problem Solving", "Adaptability"]
    }
  ],
  projects: [
    {
      id: "p1",
      title: "Mogadishu Tech Hub Dashboard",
      category: "System Management",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      shortDescription: "A centralized system management interface for monitoring network nodes.",
      longDescription: "Developed a comprehensive dashboard for the Mogadishu Tech Hub to monitor real-time network performance, user activity, and system health. The system integrates with local ISP APIs to provide accurate data visualization.",
      tags: ["React", "Node.js", "Recharts", "MongoDB"],
      link: "#"
    },
    {
      id: "p2",
      title: "Somali Coastal Preservation",
      category: "Multimedia",
      imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
      shortDescription: "A multimedia project combining drone photography and videography.",
      longDescription: "Led a visual storytelling campaign to raise awareness about the preservation of Banaadir's coastline. Utilized drone videography and high-resolution photography to document coastal changes and community interaction.",
      tags: ["Photography", "Video Editing", "Adobe Premiere", "Drone"],
      link: "#"
    },
    {
      id: "p3",
      title: "School Management System",
      category: "MEAN Stack",
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
      shortDescription: "A web application facilitating student registration and grade tracking.",
      longDescription: "Built a full-stack web application for local secondary schools to digitize student records. Features include attendance tracking, grade management, and parent portals. Built using MongoDB, Express, Angular, and Node.js.",
      tags: ["MongoDB", "Express", "Angular", "Node.js"],
      link: "#"
    }
  ]
};

export const INITIAL_STUDENTS: Student[] = [
  { id: '1', studentId: 'STD001', name: 'Ahmed Ali', grade: 'A', attendance: 95, status: 'Active' },
  { id: '2', studentId: 'STD002', name: 'Fatima Nur', grade: 'B+', attendance: 88, status: 'Active' },
  { id: '3', studentId: 'STD003', name: 'Hassan Omar', grade: 'A-', attendance: 92, status: 'Active' },
  { id: '4', studentId: 'STD004', name: 'Sara Yasmin', grade: 'C', attendance: 75, status: 'Inactive' },
  { id: '5', studentId: 'STD005', name: 'Khalid Mo', grade: 'B', attendance: 82, status: 'Active' },
];
