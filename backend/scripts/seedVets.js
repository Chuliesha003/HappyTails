/* eslint-disable no-console */
const mongoose = require("mongoose");
require("dotenv").config();

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI in .env");
  process.exit(1);
}

const VetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    clinicName: String,
    licenseNumber: String,
    email: String,
    specialization: [String],
    yearsExperience: Number,
    yearsOfExperience: Number,
    address: String,
    phoneNumber: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" }, // [lng, lat]
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Vet = mongoose.models.Vet || mongoose.model("Vet", VetSchema);

// 🇱🇰 10 vets — public-facing clinic-style data, tuned to your UI fields.
// Coords are [lng, lat]. Feel free to tweak them.
const SEED_VETS = [
  {
    name: "Dr. Chamara Perera",
    licenseNumber: 'LK-2001',
    email: 'chamara.perera@petsvcare.lk',
    clinicName: "PetsVCare Animal Hospital",
    specialization: ["General Practice", "Emergency Care"],
    yearsExperience: 12,
    yearsOfExperience: 12,
    address: "No. 45, Havelock Road, Colombo 05",
    phoneNumber: "+94 11 258 3211",
    location: { type: "Point", coordinates: [79.8576, 6.8876] },
    isActive: true,
  },
  {
    name: "Dr. Malithi Fernando",
    licenseNumber: 'LK-2002',
    email: 'malithi.fernando@bestcare.lk',
    clinicName: "Best Care Pet Hospital",
    specialization: ["Dermatology", "Preventive Care"],
    yearsExperience: 9,
    yearsOfExperience: 9,
    address: "No. 22, Baseline Road, Colombo 09",
    phoneNumber: "+94 11 269 7788",
    location: { type: "Point", coordinates: [79.8698, 6.9366] },
    isActive: true,
  },
  {
    name: "Dr. Tharindu Jayasinghe",
    licenseNumber: 'LK-2003',
    email: 'tharindu.j@kandypet.lk',
    clinicName: "Kandy Pet Clinic",
    specialization: ["General Practice", "Surgery"],
    yearsExperience: 11,
    yearsOfExperience: 11,
    address: "86, Katugastota Road, Kandy",
    phoneNumber: "+94 81 222 4455",
    location: { type: "Point", coordinates: [80.6280, 7.2916] },
    isActive: true,
  },
  {
    name: "Dr. Dinara Weerasekara",
    licenseNumber: 'LK-2004',
    email: 'dinara.weerasekara@gallevet.lk',
    clinicName: "Galle Animal Care",
    specialization: ["Internal Medicine", "Emergency Care"],
    yearsExperience: 10,
    yearsOfExperience: 10,
    address: "11, Wakwella Road, Galle",
    phoneNumber: "+94 91 224 5566",
    location: { type: "Point", coordinates: [80.2170, 6.0535] },
    isActive: true,
  },
  {
    name: "Dr. Pasindu Ranasinghe",
    licenseNumber: 'LK-2005',
    email: 'pasindu.ranasinghe@negombovet.lk',
    clinicName: "Negombo Vet Center",
    specialization: ["General Practice"],
    yearsExperience: 8,
    yearsOfExperience: 8,
    address: "321, Chilaw Road, Negombo",
    phoneNumber: "+94 31 223 8899",
    location: { type: "Point", coordinates: [79.8417, 7.2090] },
    isActive: true,
  },
  {
    name: "Dr. Ishara Abeywickrama",
    licenseNumber: 'LK-2006',
    email: 'ishara.abeywickrama@ruhunu.lk',
    clinicName: "Ruhunu Pet Hospital",
    specialization: ["Surgery", "Orthopedics"],
    yearsExperience: 13,
    yearsOfExperience: 13,
    address: "24, Matara Road, Matara",
    phoneNumber: "+94 41 222 1122",
    location: { type: "Point", coordinates: [80.5469, 5.9485] },
    isActive: true,
  },
  {
    name: "Dr. Lahiru Madushanka",
    licenseNumber: 'LK-2007',
    email: 'lahiru.m@petsfirst.lk',
    clinicName: "Pets First – Kurunegala",
    specialization: ["General Practice", "Preventive Care"],
    yearsExperience: 7,
    yearsOfExperience: 7,
    address: "87, Dambulla Road, Kurunegala",
    phoneNumber: "+94 37 222 5566",
    location: { type: "Point", coordinates: [80.3657, 7.4863] },
    isActive: true,
  },
  {
    name: "Dr. Nadeesha Karunaratne",
    licenseNumber: 'LK-2008',
    email: 'nadeesha.k@anuradhapclinic.lk',
    clinicName: "Anuradhapura Pet Clinic",
    specialization: ["Internal Medicine"],
    yearsExperience: 10,
    yearsOfExperience: 10,
    address: "15, Harischandra Mawatha, Anuradhapura",
    phoneNumber: "+94 25 222 3344",
    location: { type: "Point", coordinates: [80.4020, 8.3114] },
    isActive: true,
  },
  {
    name: "Dr. Sachini de Silva",
    licenseNumber: 'LK-2009',
    email: 'sachini.desilva@jaffnavet.lk',
    clinicName: "Jaffna Vet Care",
    specialization: ["General Practice"],
    yearsExperience: 6,
    yearsOfExperience: 6,
    address: "92, Hospital Road, Jaffna",
    phoneNumber: "+94 21 222 7788",
    location: { type: "Point", coordinates: [80.0220, 9.6615] },
    isActive: true,
  },
  {
    name: "Dr. Viraj Peiris",
    licenseNumber: 'LK-2010',
    email: 'viraj.peiris@batticaloavet.lk',
    clinicName: "Batticaloa Animal Hospital",
    specialization: ["Surgery", "Emergency Care"],
    yearsExperience: 14,
    yearsOfExperience: 14,
    address: "64, Trincomalee Road, Batticaloa",
    phoneNumber: "+94 65 222 8899",
    location: { type: "Point", coordinates: [81.6932, 7.7292] },
    isActive: true,
  },
];

async function main() {
  const RESET = process.argv.includes("--reset");

  console.log("🔌 Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected");

  // ensure 2dsphere index
  await Vet.collection.createIndex({ location: "2dsphere" });
  console.log("🧭 2dsphere index ensured");

  if (RESET) {
    const result = await Vet.deleteMany({});
    console.log(`🧹 Cleared vets collection (${result.deletedCount} removed)`);
  }

  for (const v of SEED_VETS) {
    const filter = v.licenseNumber ? { licenseNumber: v.licenseNumber } : { name: v.name, "location.coordinates": v.location.coordinates };
    const res = await Vet.updateOne(filter, { $set: v }, { upsert: true });
    const op = res.upsertedCount ? "➕ Inserted" : res.modifiedCount ? "✏️ Updated" : "✔️ Exists";
    console.log(`${op}: ${v.name} (${v.clinicName})`);
  }

  console.log("🎉 Done seeding vets");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  console.error("❌ Seed failed:", err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
