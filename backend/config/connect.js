import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if MONGO_URI is provided
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined. Please check your .env file.');
    }

    console.log('🔄 Connecting to MongoDB...');
    
    // Connect with additional options for better error handling
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Optional: List available collections (helpful for debugging)
    const collections = await conn.connection.db.listCollections().toArray();
    if (collections.length > 0) {
      console.log(`📁 Available Collections: ${collections.map(c => c.name).join(', ')}`);
    } else {
      console.log('📁 No collections found (fresh database)');
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Provide helpful error messages for common issues
    if (error.message.includes('MONGO_URI')) {
      console.error('💡 Solution: Copy env.example to .env and update MONGO_URI');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('💡 Solution: Check if MongoDB is running or verify your connection string');
    } else if (error.message.includes('authentication')) {
      console.error('💡 Solution: Verify your MongoDB username and password');
    }
    
    process.exit(1);
  }
};

// Optional: Added a test function for team members
// const testConnection = async () => {
//   try {
//     await connectDB();
//     console.log('\n🧪 Testing database operations...');
    
//     // Simple ping test
//     await mongoose.connection.db.admin().ping();
//     console.log('✅ Database ping successful');
    
//     // Check if we can perform basic operations
//     const stats = await mongoose.connection.db.stats();
//     console.log(`📈 Database Stats: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB data`);
    
//     console.log('\n🎉 Database connection test completed successfully!');
//     console.log('💡 Tip: Run "node test-db.js" to test all schemas and relationships');
    
//   } catch (error) {
//     console.error('❌ Connection test failed:', error.message);
//   } finally {
//     await mongoose.disconnect();
//     console.log('🔌 Disconnected from database');
//   }
// };

export default connectDB;
// export { testConnection };
