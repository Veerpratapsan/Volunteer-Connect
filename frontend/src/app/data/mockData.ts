// Mock data for the application

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  skills: string[];
  profilePicture: string;
  totalHours: number;
  tasksCompleted: number;
  activeAssignments: number;
}

export interface NGO {
  id: string;
  uniqueId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  activeNeeds: number;
  volunteersAssigned: number;
  urgentRequests: number;
  issuesResolved: number;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
  coordinates: { lat: number; lng: number };
  description: string;
  volunteerCount: number;
  deadline: string;
  requiredSkills: string[];
  ngoId: string;
  ngoName: string;
  photo: string;
  checklist: ChecklistItem[];
  status: 'open' | 'in-progress' | 'completed';
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface VolunteerRequest {
  id: string;
  volunteerId: string;
  volunteerName: string;
  volunteerSkills: string[];
  taskId: string;
  taskTitle: string;
  status: 'pending' | 'accepted' | 'rejected';
  date: string;
}

export interface ReportedIssue {
  id: string;
  volunteerId: string;
  volunteerName: string;
  description: string;
  location: string;
  photos: string[];
  date: string;
  status: 'pending' | 'chosen' | 'resolved';
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}

export interface Activity {
  id: string;
  taskId: string;
  taskTitle: string;
  action: string;
  date: string;
  status: string;
}

// Mock volunteers
export const mockVolunteers: Volunteer[] = [
  {
    id: 'v1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1-555-0101',
    address: 'New York, NY',
    skills: ['Teaching', 'First Aid', 'Event Planning'],
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    totalHours: 245,
    tasksCompleted: 42,
    activeAssignments: 3,
  },
  {
    id: 'v2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    phone: '+1-555-0102',
    address: 'San Francisco, CA',
    skills: ['Construction', 'Carpentry', 'Plumbing'],
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    totalHours: 320,
    tasksCompleted: 58,
    activeAssignments: 2,
  },
  {
    id: 'v3',
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    phone: '+1-555-0103',
    address: 'Los Angeles, CA',
    skills: ['Medical Care', 'Counseling', 'Translation'],
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    totalHours: 189,
    tasksCompleted: 35,
    activeAssignments: 4,
  },
];

// Mock NGOs
export const mockNGOs: NGO[] = [
  {
    id: 'ngo1',
    uniqueId: 'NGO-2024-001',
    name: 'Community Care Foundation',
    email: 'info@ccf.org',
    phone: '+1-555-1001',
    address: 'New York, NY',
    description: 'Dedicated to improving community welfare',
    activeNeeds: 12,
    volunteersAssigned: 45,
    urgentRequests: 3,
    issuesResolved: 128,
  },
];

// Mock tasks
export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Food Distribution Drive',
    category: 'Food Security',
    priority: 'urgent',
    location: 'Central Park, New York',
    coordinates: { lat: 40.785091, lng: -73.968285 },
    description: 'Help distribute food packages to homeless individuals in Central Park. We need volunteers to help set up, serve meals, and clean up.',
    volunteerCount: 5,
    deadline: '2026-04-15',
    requiredSkills: ['Event Planning', 'Communication'],
    ngoId: 'ngo1',
    ngoName: 'Community Care Foundation',
    photo: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400',
    checklist: [
      { id: 'c1', text: 'Set up distribution tables', completed: true },
      { id: 'c2', text: 'Organize food packages', completed: true },
      { id: 'c3', text: 'Distribute meals', completed: false },
      { id: 'c4', text: 'Clean up area', completed: false },
    ],
    status: 'in-progress',
  },
  {
    id: 't2',
    title: 'Community Garden Setup',
    category: 'Environment',
    priority: 'high',
    location: 'Brooklyn Community Center',
    coordinates: { lat: 40.650002, lng: -73.949997 },
    description: 'Build raised garden beds and plant vegetables for the community garden project.',
    volunteerCount: 8,
    deadline: '2026-04-20',
    requiredSkills: ['Construction', 'Gardening'],
    ngoId: 'ngo1',
    ngoName: 'Community Care Foundation',
    photo: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    checklist: [
      { id: 'c5', text: 'Build raised beds', completed: false },
      { id: 'c6', text: 'Prepare soil', completed: false },
      { id: 'c7', text: 'Plant seeds', completed: false },
      { id: 'c8', text: 'Install irrigation', completed: false },
    ],
    status: 'open',
  },
  {
    id: 't3',
    title: 'After-School Tutoring',
    category: 'Education',
    priority: 'medium',
    location: 'Queens Public Library',
    coordinates: { lat: 40.728224, lng: -73.794852 },
    description: 'Provide tutoring support for elementary school students in math and reading.',
    volunteerCount: 3,
    deadline: '2026-04-25',
    requiredSkills: ['Teaching', 'Patience'],
    ngoId: 'ngo1',
    ngoName: 'Community Care Foundation',
    photo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
    checklist: [
      { id: 'c9', text: 'Prepare lesson plans', completed: false },
      { id: 'c10', text: 'Conduct tutoring sessions', completed: false },
      { id: 'c11', text: 'Track student progress', completed: false },
    ],
    status: 'open',
  },
  {
    id: 't4',
    title: 'Medical Camp Support',
    category: 'Healthcare',
    priority: 'urgent',
    location: 'Bronx Community Hall',
    coordinates: { lat: 40.844782, lng: -73.864827 },
    description: 'Assist in organizing a free medical camp for underserved communities.',
    volunteerCount: 10,
    deadline: '2026-04-12',
    requiredSkills: ['Medical Care', 'Organization'],
    ngoId: 'ngo1',
    ngoName: 'Community Care Foundation',
    photo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
    checklist: [
      { id: 'c12', text: 'Register patients', completed: false },
      { id: 'c13', text: 'Assist medical staff', completed: false },
      { id: 'c14', text: 'Distribute medicines', completed: false },
    ],
    status: 'open',
  },
  {
    id: 't5',
    title: 'Elderly Care Home Visit',
    category: 'Senior Care',
    priority: 'medium',
    location: 'Manhattan Senior Center',
    coordinates: { lat: 40.758896, lng: -73.985130 },
    description: 'Spend time with elderly residents, organize activities, and provide companionship.',
    volunteerCount: 4,
    deadline: '2026-04-18',
    requiredSkills: ['Communication', 'Empathy'],
    ngoId: 'ngo1',
    ngoName: 'Community Care Foundation',
    photo: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400',
    checklist: [
      { id: 'c15', text: 'Plan activities', completed: false },
      { id: 'c16', text: 'Interact with residents', completed: false },
      { id: 'c17', text: 'Document feedback', completed: false },
    ],
    status: 'open',
  },
];

// Mock volunteer requests
export const mockVolunteerRequests: VolunteerRequest[] = [
  {
    id: 'r1',
    volunteerId: 'v2',
    volunteerName: 'Michael Chen',
    volunteerSkills: ['Construction', 'Carpentry', 'Plumbing'],
    taskId: 't2',
    taskTitle: 'Community Garden Setup',
    status: 'pending',
    date: '2026-04-09',
  },
  {
    id: 'r2',
    volunteerId: 'v3',
    volunteerName: 'Emily Rodriguez',
    volunteerSkills: ['Medical Care', 'Counseling', 'Translation'],
    taskId: 't4',
    taskTitle: 'Medical Camp Support',
    status: 'pending',
    date: '2026-04-08',
  },
  {
    id: 'r3',
    volunteerId: 'v1',
    volunteerName: 'Sarah Johnson',
    volunteerSkills: ['Teaching', 'First Aid', 'Event Planning'],
    taskId: 't3',
    taskTitle: 'After-School Tutoring',
    status: 'pending',
    date: '2026-04-08',
  },
];

// Mock reported issues
export const mockReportedIssues: ReportedIssue[] = [
  {
    id: 'i1',
    volunteerId: 'v1',
    volunteerName: 'Sarah Johnson',
    description: 'Noticed a large pothole on Main Street that could be dangerous for pedestrians and vehicles. Immediate attention needed.',
    location: 'Main Street & 5th Avenue',
    photos: ['https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=300'],
    date: '2026-04-08',
    status: 'pending',
  },
  {
    id: 'i2',
    volunteerId: 'v2',
    volunteerName: 'Michael Chen',
    description: 'Found several homeless individuals sleeping under the bridge in harsh weather conditions. They need shelter and warm meals.',
    location: 'Brooklyn Bridge Underpass',
    photos: ['https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=300'],
    date: '2026-04-07',
    status: 'chosen',
  },
  {
    id: 'i3',
    volunteerId: 'v3',
    volunteerName: 'Emily Rodriguez',
    description: 'Community park playground equipment is broken and unsafe for children. Swings and slides need repair.',
    location: 'Riverside Community Park',
    photos: ['https://images.unsplash.com/photo-1580238053495-b9720401fd0c?w=300'],
    date: '2026-04-06',
    status: 'pending',
  },
];

// Mock chat messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg1',
    userId: 'v1',
    userName: 'Sarah Johnson',
    message: 'Hey everyone! Just finished the food distribution drive. Great turnout today!',
    timestamp: '2026-04-09 10:30',
  },
  {
    id: 'msg2',
    userId: 'v2',
    userName: 'Michael Chen',
    message: 'That\'s awesome Sarah! How many people did you help?',
    timestamp: '2026-04-09 10:35',
  },
  {
    id: 'msg3',
    userId: 'v1',
    userName: 'Sarah Johnson',
    message: 'We served meals to about 80 people. The community really appreciated it.',
    timestamp: '2026-04-09 10:37',
  },
  {
    id: 'msg4',
    userId: 'v3',
    userName: 'Emily Rodriguez',
    message: 'Amazing work! Is anyone available for the medical camp this Friday?',
    timestamp: '2026-04-09 11:15',
  },
  {
    id: 'msg5',
    userId: 'v2',
    userName: 'Michael Chen',
    message: 'I can help with setup in the morning. What time does it start?',
    timestamp: '2026-04-09 11:20',
  },
];

// Mock activities
export const mockActivities: Activity[] = [
  {
    id: 'a1',
    taskId: 't1',
    taskTitle: 'Food Distribution Drive',
    action: 'Completed task',
    date: '2026-04-05',
    status: 'completed',
  },
  {
    id: 'a2',
    taskId: 't3',
    taskTitle: 'After-School Tutoring',
    action: 'Completed session',
    date: '2026-04-03',
    status: 'completed',
  },
  {
    id: 'a3',
    taskId: 't5',
    taskTitle: 'Elderly Care Home Visit',
    action: 'Participated',
    date: '2026-03-28',
    status: 'completed',
  },
  {
    id: 'a4',
    taskId: 't2',
    taskTitle: 'Community Garden Setup',
    action: 'Started task',
    date: '2026-03-25',
    status: 'in-progress',
  },
];

// Leaderboard data
export const volunteerLeaderboard = [
  { rank: 1, name: 'Michael Chen', tasksCompleted: 58, hours: 320 },
  { rank: 2, name: 'Sarah Johnson', tasksCompleted: 42, hours: 245 },
  { rank: 3, name: 'Emily Rodriguez', tasksCompleted: 35, hours: 189 },
  { rank: 4, name: 'David Kim', tasksCompleted: 31, hours: 165 },
  { rank: 5, name: 'Jessica Lee', tasksCompleted: 28, hours: 142 },
];

export const ngoLeaderboard = [
  { rank: 1, name: 'Community Care Foundation', issuesResolved: 128, volunteers: 45 },
  { rank: 2, name: 'Hope for All', issuesResolved: 95, volunteers: 38 },
  { rank: 3, name: 'City Helpers United', issuesResolved: 87, volunteers: 32 },
  { rank: 4, name: 'Green Earth Initiative', issuesResolved: 72, volunteers: 28 },
  { rank: 5, name: 'Youth Empowerment Org', issuesResolved: 64, volunteers: 25 },
];

// Recent NGO activities
export const mockNGOActivities = [
  {
    id: 'na1',
    volunteer: 'Sarah Johnson',
    task: 'Food Distribution Drive',
    action: 'Completed checklist item: Distribute meals',
    time: '2 hours ago',
  },
  {
    id: 'na2',
    volunteer: 'Michael Chen',
    task: 'Community Garden Setup',
    action: 'Expressed interest in task',
    time: '5 hours ago',
  },
  {
    id: 'na3',
    volunteer: 'Emily Rodriguez',
    task: 'Medical Camp Support',
    action: 'Expressed interest in task',
    time: '1 day ago',
  },
  {
    id: 'na4',
    volunteer: 'Sarah Johnson',
    task: 'Food Distribution Drive',
    action: 'Completed checklist item: Organize food packages',
    time: '1 day ago',
  },
];
