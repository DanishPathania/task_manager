import mongoose from 'mongoose';
import Project from '../models/Project.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Seed requested projects
    const projectsToAdd = [
      { title: 'Sindoor', description: 'Sindoor project management', status: 'Active', dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) },
      { title: 'Geowar', description: 'Geowar project management', status: 'Active', dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2)) },
      { title: 'Biofact', description: 'Biofact project management', status: 'Active', dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)) },
      { title: 'Techdule', description: 'Techdule project management', status: 'Active', dueDate: new Date(new Date().setMonth(new Date().getMonth() + 4)) }
    ];

    for (const p of projectsToAdd) {
      await Project.findOneAndUpdate(
        { title: p.title }, 
        { $setOnInsert: p }, 
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
