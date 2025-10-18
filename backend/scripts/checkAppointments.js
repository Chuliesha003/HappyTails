require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Vet = require('../models/Vet');
const Pet = require('../models/Pet');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const count = await Appointment.countDocuments();
    console.log(`\n📊 Total appointments in database: ${count}`);
    
    if (count > 0) {
      const appointments = await Appointment.find()
        .populate('user', 'fullName email')
        .populate('vet', 'name clinicName')
        .populate('pet', 'name species breed')
        .sort({ dateTime: -1 })
        .limit(5);
      
      console.log('\n📋 Recent appointments:');
      appointments.forEach((apt, idx) => {
        console.log(`\n${idx + 1}. Appointment ID: ${apt._id}`);
        console.log(`   User: ${apt.user?.fullName || apt.user}`);
        console.log(`   Pet: ${apt.pet?.name || apt.pet} (${apt.pet?.species || 'N/A'})`);
        console.log(`   Vet: ${apt.vet?.name || apt.vet}`);
        console.log(`   Clinic: ${apt.vet?.clinicName || 'N/A'}`);
        console.log(`   Date/Time: ${apt.dateTime}`);
        console.log(`   Status: ${apt.status}`);
        console.log(`   Reason: ${apt.reason}`);
      });
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
