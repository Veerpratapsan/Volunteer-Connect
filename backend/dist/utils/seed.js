"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unifiedConfig_1 = require("../config/unifiedConfig");
const tasksData = [
    {
        title: 'Food Distribution Drive',
        category: 'Food Security',
        priority: 'urgent',
        location: '123 Main St, New York',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        description: 'Help distribute 500 meals to families in need. Sorting and handing out packages.',
        volunteerCount: 15,
        deadline: '2026-04-20',
        requiredSkills: ['Lifting', 'Communication', 'Organization'],
        ngoId: 'ngo1',
        ngoName: 'Community Care Foundation',
        photo: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80',
        checklist: [
            { id: '1', text: 'Arrive for briefing', completed: false },
            { id: '2', text: 'Sort food packages', completed: false },
            { id: '3', text: 'Distribute meals', completed: false }
        ],
        status: 'open'
    },
    {
        title: 'Park Cleanup & Beautification',
        category: 'Environment',
        priority: 'medium',
        location: 'Central Park',
        coordinates: { lat: 40.7822, lng: -73.9653 },
        description: 'Join us to clean up the park, plant new saplings, and restore the playground.',
        volunteerCount: 30,
        deadline: '2026-04-25',
        requiredSkills: ['Physical Labor', 'Gardening'],
        ngoId: 'ngo2',
        ngoName: 'Green Earth Initiative',
        photo: 'https://images.unsplash.com/photo-1534440615560-6101af715c0e?auto=format&fit=crop&q=80',
        checklist: [
            { id: '1', text: 'Collect trash', completed: false },
            { id: '2', text: 'Plant 20 saplings', completed: false }
        ],
        status: 'open'
    }
];
const activitiesData = [
    {
        volunteerName: 'Michael Chen',
        taskTitle: 'Food Distribution Drive',
        action: 'Registered',
        date: '1 hour ago'
    },
    {
        volunteerName: 'Sarah Johnson',
        taskTitle: 'Community Teaching',
        action: 'Completed',
        date: '2 hours ago'
    }
];
const issuesData = [
    {
        title: 'Broken Pipes at Shelter',
        status: 'open',
        reporter: 'David Kim',
        date: '2026-04-18',
        description: 'Water leak found in the main shelter area.',
        priority: 'high'
    }
];
async function seed() {
    console.log('Seeding database with mock data...');
    try {
        for (const task of tasksData) {
            const docRef = unifiedConfig_1.db.collection('tasks').doc();
            await docRef.set({ id: docRef.id, ...task });
            console.log(`Added Task: ${task.title}`);
        }
        for (const activity of activitiesData) {
            const docRef = unifiedConfig_1.db.collection('activities').doc();
            await docRef.set({ id: docRef.id, ...activity });
            console.log(`Added Activity: ${activity.action}`);
        }
        for (const issue of issuesData) {
            const docRef = unifiedConfig_1.db.collection('issues').doc();
            await docRef.set({ id: docRef.id, ...issue });
            console.log(`Added Issue: ${issue.title}`);
        }
        console.log('Database seeding complete!');
    }
    catch (err) {
        console.error('Error during seeding:', err);
    }
}
seed().then(() => process.exit());
