import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './src/models/Project.js';
import User from './src/models/User.js';

dotenv.config();

const seedProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if projects already exist to avoid duplicates
    const projectsToAdd = [
      { 
        title: 'Sindoor', 
        description: 'Sindoor project management and tasks', 
        status: 'Active', 
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) 
      },
      { 
        title: 'Geowar', 
        description: 'Geowar project management and tasks', 
        status: 'Active', 
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2)) 
      },
      { 
        title: 'Biofact', 
        description: 'Biofact project management and tasks', 
        status: 'Active', 
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)) 
      },
      { 
        title: 'Techdule', 
        description: 'Techdule project management and tasks', 
        status: 'Active', 
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 4)) 
      }
    ];

    for (const p of projectsToAdd) {
      await Project.findOneAndUpdate(
        { title: p.title }, 
        { $setOnInsert: p }, 
        { upsert: true, new: true }
      );
    }
    
    console.log('✅ Projects Sindoor, Geowar, Biofact, Techdule added to database!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding projects:', error);
    process.exit(1);
  }
};

seedProjects();
