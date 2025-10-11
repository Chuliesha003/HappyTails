const mongoose = require('mongoose');
const path = require('path');
const Vet = require('../models/Vet');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding Sri Lankan vets');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sri Lankan Veterinarians Data
const sriLankanVets = [
  {
    name: 'Dr. Kamal Perera',
    email: 'dr.kamal@happytails.lk',
    phoneNumber: '+94 11 234 5678',
    clinicName: 'Colombo Pet Hospital',
    specialization: ['General Practice', 'Surgery', 'Emergency Care'],
    licenseNumber: 'VET-LK-2024-001',
    yearsOfExperience: 15,
    qualifications: [
      {
        degree: 'Bachelor of Veterinary Science',
        institution: 'University of Peradeniya',
        year: 2009,
      },
    ],
    location: {
      type: 'Point',
      coordinates: [79.8612, 6.9271], // [longitude, latitude] - Colombo city center
      address: '123, Galle Road',
      city: 'Colombo 03',
      state: 'Western Province',
      zipCode: '00300',
      country: 'Sri Lanka',
    },
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '18:00', isAvailable: true },
      { day: 'Tuesday', startTime: '09:00', endTime: '18:00', isAvailable: true },
      { day: 'Wednesday', startTime: '09:00', endTime: '18:00', isAvailable: true },
      { day: 'Thursday', startTime: '09:00', endTime: '18:00', isAvailable: true },
      { day: 'Friday', startTime: '09:00', endTime: '18:00', isAvailable: true },
      { day: 'Saturday', startTime: '09:00', endTime: '14:00', isAvailable: true },
    ],
    consultationFee: 2500,
    bio: 'Dr. Kamal Perera is an experienced veterinarian specializing in small animal care with over 15 years of practice in Colombo.',
    languages: ['Sinhala', 'English', 'Tamil'],
    services: ['Vaccinations', 'Surgery', 'Emergency Care', 'Dental Care', 'Grooming'],
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Dr. Nisha Fernando',
    email: 'dr.nisha@petcare.lk',
    phoneNumber: '+94 11 345 6789',
    clinicName: 'VetCare Colombo',
    specialization: ['Dermatology', 'Internal Medicine', 'Preventive Care'],
    licenseNumber: 'VET-LK-2024-002',
    yearsOfExperience: 10,
    qualifications: [
      {
        degree: 'Bachelor of Veterinary Science',
        institution: 'University of Peradeniya',
        year: 2014,
      },
    ],
    location: {
      type: 'Point',
      coordinates: [79.8750, 6.9120], // Bambalapitiya
      address: '456, Duplication Road',
      city: 'Colombo 04',
      state: 'Western Province',
      zipCode: '00400',
      country: 'Sri Lanka',
    },
    availability: [
      { day: 'Monday', startTime: '10:00', endTime: '19:00', isAvailable: true },
      { day: 'Tuesday', startTime: '10:00', endTime: '19:00', isAvailable: true },
      { day: 'Wednesday', startTime: '10:00', endTime: '19:00', isAvailable: true },
      { day: 'Thursday', startTime: '10:00', endTime: '19:00', isAvailable: true },
      { day: 'Friday', startTime: '10:00', endTime: '19:00', isAvailable: true },
    ],
    consultationFee: 3000,
    bio: 'Dr. Nisha specializes in skin conditions and preventive care for pets. She has a gentle approach with nervous animals.',
    languages: ['Sinhala', 'English'],
    services: ['Dermatology', 'Vaccinations', 'Health Check-ups', 'Nutrition Counseling'],
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Dr. Rohan Silva',
    email: 'dr.rohan@animalclinic.lk',
    phoneNumber: '+94 11 456 7890',
    clinicName: 'Mount Lavinia Animal Clinic',
    specialization: ['Surgery', 'Orthopedics', 'General Practice'],
    licenseNumber: 'VET-LK-2024-003',
    yearsOfExperience: 18,
    qualifications: [
      {
        degree: 'Bachelor of Veterinary Science',
        institution: 'University of Peradeniya',
        year: 2006,
      },
    ],
    location: {
      type: 'Point',
      coordinates: [79.8630, 6.8380], // Mount Lavinia
      address: '789, Beach Road',
      city: 'Mount Lavinia',
      state: 'Western Province',
      zipCode: '10370',
      country: 'Sri Lanka',
    },
    availability: [
      { day: 'Monday', startTime: '08:00', endTime: '17:00', isAvailable: true },
      { day: 'Tuesday', startTime: '08:00', endTime: '17:00', isAvailable: true },
      { day: 'Wednesday', startTime: '08:00', endTime: '17:00', isAvailable: true },
      { day: 'Thursday', startTime: '08:00', endTime: '17:00', isAvailable: true },
      { day: 'Friday', startTime: '08:00', endTime: '17:00', isAvailable: true },
      { day: 'Saturday', startTime: '09:00', endTime: '13:00', isAvailable: true },
    ],
    consultationFee: 2800,
    bio: 'Dr. Rohan is a skilled surgeon with extensive experience in orthopedic procedures and complex surgeries.',
    languages: ['Sinhala', 'English'],
    services: ['Surgery', 'X-Ray', 'Orthopedics', 'Emergency Care', 'Vaccinations'],
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Dr. Ayesha Iqbal',
    email: 'dr.ayesha@pethospital.lk',
    phoneNumber: '+94 11 567 8901',
    clinicName: 'Dehiwala Pet Hospital',
    specialization: ['Pediatrics', 'General Practice', 'Emergency Care'],
    licenseNumber: 'VET-LK-2024-004',
    yearsOfExperience: 8,
    qualifications: [
      {
        degree: 'Bachelor of Veterinary Science',
        institution: 'University of Peradeniya',
        year: 2016,
      },
    ],
    location: {
      type: 'Point',
      coordinates: [79.8720, 6.8560], // Dehiwala
      address: '234, Galle Road',
      city: 'Dehiwala',
      state: 'Western Province',
      zipCode: '10350',
      country: 'Sri Lanka',
    },
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '18:00', isAvailable: true },
      { day: 'Tuesday', startTime: '09:00', endTime: '18:00', isAvailable: true },
      { day: 'Wednesday', startTime: '09:00', endTime: '18:00', isAvailable: true },
      { day: 'Thursday', startTime: '09:00', endTime: '18:00', isAvailable: true },
      { day: 'Friday', startTime: '09:00', endTime: '18:00', isAvailable: true },
      { day: 'Saturday', startTime: '09:00', endTime: '15:00', isAvailable: true },
      { day: 'Sunday', startTime: '10:00', endTime: '14:00', isAvailable: true },
    ],
    consultationFee: 2200,
    bio: 'Dr. Ayesha specializes in young animals and has a compassionate approach with puppies and kittens.',
    languages: ['Sinhala', 'English', 'Tamil'],
    services: ['Pediatric Care', 'Vaccinations', 'Deworming', 'Health Check-ups'],
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Dr. Lasantha Rajapaksa',
    email: 'dr.lasantha@vetcenter.lk',
    phoneNumber: '+94 11 678 9012',
    clinicName: 'Nugegoda Veterinary Center',
    specialization: ['Cardiology', 'Internal Medicine', 'Diagnostic Imaging'],
    licenseNumber: 'VET-LK-2024-005',
    yearsOfExperience: 12,
    qualifications: [
      {
        degree: 'Bachelor of Veterinary Science',
        institution: 'University of Peradeniya',
        year: 2012,
      },
    ],
    location: {
      type: 'Point',
      coordinates: [79.8990, 6.8650], // Nugegoda
      address: '567, High Level Road',
      city: 'Nugegoda',
      state: 'Western Province',
      zipCode: '10250',
      country: 'Sri Lanka',
    },
    availability: [
      { day: 'Monday', startTime: '08:30', endTime: '17:30', isAvailable: true },
      { day: 'Tuesday', startTime: '08:30', endTime: '17:30', isAvailable: true },
      { day: 'Wednesday', startTime: '08:30', endTime: '17:30', isAvailable: true },
      { day: 'Thursday', startTime: '08:30', endTime: '17:30', isAvailable: true },
      { day: 'Friday', startTime: '08:30', endTime: '17:30', isAvailable: true },
    ],
    consultationFee: 3500,
    bio: 'Dr. Lasantha specializes in veterinary cardiology and advanced diagnostic imaging techniques.',
    languages: ['Sinhala', 'English'],
    services: ['Cardiology', 'Ultrasound', 'X-Ray', 'ECG', 'Blood Tests'],
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Dr. Chaminda Wickramasinghe',
    email: 'dr.chaminda@maharagamapet.lk',
    phoneNumber: '+94 11 789 0123',
    clinicName: 'Maharagama Pet Care',
    specialization: ['General Practice', 'Dentistry', 'Preventive Care'],
    licenseNumber: 'VET-LK-2024-006',
    yearsOfExperience: 7,
    qualifications: [
      {
        degree: 'Bachelor of Veterinary Science',
        institution: 'University of Peradeniya',
        year: 2017,
      },
    ],
    location: {
      type: 'Point',
      coordinates: [79.9260, 6.8480], // Maharagama
      address: '890, Maharagama Road',
      city: 'Maharagama',
      state: 'Western Province',
      zipCode: '10280',
      country: 'Sri Lanka',
    },
    availability: [
      { day: 'Tuesday', startTime: '10:00', endTime: '19:00', isAvailable: true },
      { day: 'Wednesday', startTime: '10:00', endTime: '19:00', isAvailable: true },
      { day: 'Thursday', startTime: '10:00', endTime: '19:00', isAvailable: true },
      { day: 'Friday', startTime: '10:00', endTime: '19:00', isAvailable: true },
      { day: 'Saturday', startTime: '09:00', endTime: '16:00', isAvailable: true },
    ],
    consultationFee: 2000,
    bio: 'Dr. Chaminda provides comprehensive pet care with a focus on dental health and preventive medicine.',
    languages: ['Sinhala', 'English'],
    services: ['Dental Care', 'Vaccinations', 'Grooming', 'Health Check-ups'],
    isVerified: true,
    isActive: true,
  },
];

// Seed function
const seedSriLankanVets = async () => {
  try {
    await connectDB();

    // Check if vets already exist
    const existingVets = await Vet.find({
      email: { $in: sriLankanVets.map(v => v.email) }
    });

    if (existingVets.length > 0) {
      console.log(`ℹ️  Found ${existingVets.length} existing Sri Lankan vets`);
      console.log('🗑️  Removing existing vets to re-seed...');
      await Vet.deleteMany({
        email: { $in: sriLankanVets.map(v => v.email) }
      });
    }

    // Insert new vets
    const inserted = await Vet.insertMany(sriLankanVets);
    console.log(`✅ Successfully added ${inserted.length} Sri Lankan veterinarians!`);

    inserted.forEach(vet => {
      console.log(`   - ${vet.name} at ${vet.clinicName} (${vet.location.city})`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding
seedSriLankanVets();
