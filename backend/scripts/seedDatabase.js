const mongoose = require('mongoose');
const path = require('path');
const Vet = require('../models/Vet');
const Article = require('../models/Article');
const User = require('../models/User');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample Veterinarians Data
const veterinarians = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'dr.sarah@happytails.com',
    phoneNumber: '+1 (555) 123-4567',
    clinicName: 'Happy Paws Veterinary Clinic',
    specialization: ['General Practice', 'Emergency Care', 'Surgery'],
    licenseNumber: 'VET-2024-001',
    yearsOfExperience: 12,
    qualifications: [
      {
        degree: 'Doctor of Veterinary Medicine',
        institution: 'Cornell University',
        year: 2012,
      },
    ],
    location: {
      address: '123 Pet Care Lane',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    },
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Friday', startTime: '09:00', endTime: '15:00', isAvailable: true },
    ],
    bio: 'Dr. Sarah Johnson is a passionate veterinarian with over 12 years of experience in small animal care. She specializes in emergency care and has a gentle approach with anxious pets.',
    languages: ['English', 'Spanish'],
    emergencyService: true,
    houseCallService: false,
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Dr. Michael Chen',
    email: 'dr.chen@vetcare.com',
    phoneNumber: '+1 (555) 234-5678',
    clinicName: 'Pet Wellness Center',
    specialization: ['Cardiology', 'Internal Medicine', 'Diagnostic Imaging'],
    licenseNumber: 'VET-2024-002',
    yearsOfExperience: 15,
    qualifications: [
      {
        degree: 'Doctor of Veterinary Medicine',
        institution: 'UC Davis',
        year: 2009,
      },
      {
        degree: 'Board Certified in Cardiology',
        institution: 'ACVIM',
        year: 2014,
      },
    ],
    location: {
      address: '456 Animal Way',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      coordinates: {
        latitude: 34.0522,
        longitude: -118.2437,
      },
    },
    availability: [
      { day: 'Monday', startTime: '08:00', endTime: '16:00', isAvailable: true },
      { day: 'Tuesday', startTime: '08:00', endTime: '16:00', isAvailable: true },
      { day: 'Wednesday', startTime: '08:00', endTime: '16:00', isAvailable: true },
      { day: 'Thursday', startTime: '08:00', endTime: '16:00', isAvailable: true },
      { day: 'Friday', startTime: '08:00', endTime: '16:00', isAvailable: true },
    ],
    bio: 'Dr. Chen specializes in veterinary cardiology and has helped countless pets with heart conditions live longer, healthier lives.',
    languages: ['English', 'Mandarin'],
    emergencyService: true,
    houseCallService: true,
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Dr. Emily Rodriguez',
    email: 'dr.rodriguez@petcare.com',
    phoneNumber: '+1 (555) 345-6789',
    clinicName: 'Companion Animal Hospital',
    specialization: ['Dentistry', 'Dermatology', 'Preventive Care'],
    licenseNumber: 'VET-2024-003',
    yearsOfExperience: 8,
    qualifications: [
      {
        degree: 'Doctor of Veterinary Medicine',
        institution: 'University of Florida',
        year: 2016,
      },
    ],
    location: {
      address: '789 Veterinary Blvd',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA',
      coordinates: {
        latitude: 25.7617,
        longitude: -80.1918,
      },
    },
    availability: [
      { day: 'Tuesday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { day: 'Wednesday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { day: 'Thursday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { day: 'Friday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { day: 'Saturday', startTime: '09:00', endTime: '13:00', isAvailable: true },
    ],
    bio: 'Dr. Rodriguez has a special interest in dental health and skin conditions. She believes prevention is the best medicine.',
    languages: ['English', 'Spanish'],
    emergencyService: false,
    houseCallService: true,
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Dr. James Wilson',
    email: 'dr.wilson@animalclinic.com',
    phoneNumber: '+1 (555) 456-7890',
    clinicName: 'City Animal Clinic',
    specialization: ['Surgery', 'Orthopedics', 'Pain Management'],
    licenseNumber: 'VET-2024-004',
    yearsOfExperience: 20,
    qualifications: [
      {
        degree: 'Doctor of Veterinary Medicine',
        institution: 'Texas A&M University',
        year: 2004,
      },
      {
        degree: 'Board Certified in Surgery',
        institution: 'ACVS',
        year: 2009,
      },
    ],
    location: {
      address: '321 Surgery St',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA',
      coordinates: {
        latitude: 29.7604,
        longitude: -95.3698,
      },
    },
    availability: [
      { day: 'Monday', startTime: '07:00', endTime: '15:00', isAvailable: true },
      { day: 'Tuesday', startTime: '07:00', endTime: '15:00', isAvailable: true },
      { day: 'Wednesday', startTime: '07:00', endTime: '15:00', isAvailable: true },
      { day: 'Thursday', startTime: '07:00', endTime: '15:00', isAvailable: true },
    ],
    bio: 'Dr. Wilson is a board-certified surgeon with extensive experience in complex orthopedic procedures.',
    languages: ['English'],
    emergencyService: true,
    houseCallService: false,
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Dr. Amanda Lee',
    email: 'dr.lee@petmedic.com',
    phoneNumber: '+1 (555) 567-8901',
    clinicName: 'Pet Medic Veterinary Services',
    specialization: ['Exotic Animals', 'Avian Medicine', 'Reptile Care'],
    licenseNumber: 'VET-2024-005',
    yearsOfExperience: 10,
    qualifications: [
      {
        degree: 'Doctor of Veterinary Medicine',
        institution: 'University of Pennsylvania',
        year: 2014,
      },
      {
        degree: 'Exotic Animal Specialist',
        institution: 'AEMV',
        year: 2017,
      },
    ],
    location: {
      address: '555 Exotic Lane',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
      coordinates: {
        latitude: 47.6062,
        longitude: -122.3321,
      },
    },
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Saturday', startTime: '10:00', endTime: '14:00', isAvailable: true },
    ],
    bio: 'Dr. Lee specializes in exotic pets including birds, reptiles, and small mammals. She is passionate about educating owners on proper exotic pet care.',
    languages: ['English', 'Korean'],
    emergencyService: false,
    houseCallService: true,
    isVerified: true,
    isActive: true,
  },
];

// Sample Educational Articles
const articles = [
  {
    title: 'Essential Nutrition Guide for Your Dog',
    slug: 'essential-nutrition-guide-for-your-dog',
    content: `
# Essential Nutrition Guide for Your Dog

Proper nutrition is the cornerstone of your dog's health and wellbeing. Understanding what to feed your furry friend can be overwhelming with so many options available. This comprehensive guide will help you make informed decisions about your dog's diet.

## Understanding Dog Nutrition Basics

Dogs require a balanced diet that includes:
- **Proteins**: Essential for muscle development and repair
- **Fats**: Provide energy and support skin and coat health
- **Carbohydrates**: Supply energy and fiber for digestive health
- **Vitamins and Minerals**: Support various bodily functions
- **Water**: The most important nutrient of all

## Choosing the Right Food

### Commercial Dog Food
Most commercial dog foods are formulated to meet AAFCO (Association of American Feed Control Officials) standards. Look for:
- Real meat as the first ingredient
- Whole grains or vegetables
- No artificial preservatives
- Age-appropriate formulations (puppy, adult, senior)

### Homemade Diets
If you prefer preparing your dog's food at home:
- Consult with a veterinary nutritionist
- Ensure balanced meals with proper supplements
- Follow safe food handling practices
- Monitor your dog's weight and condition

## Foods to Avoid

Never feed your dog:
- Chocolate, coffee, or caffeine
- Grapes and raisins
- Onions and garlic
- Xylitol (artificial sweetener)
- Alcohol
- Raw dough
- Macadamia nuts
- Avocado

## Feeding Guidelines

### Portion Control
- Follow package recommendations as a starting point
- Adjust based on your dog's activity level
- Monitor body condition regularly
- Treats should not exceed 10% of daily calories

### Feeding Schedule
- Puppies: 3-4 meals per day
- Adults: 2 meals per day
- Seniors: 2 meals per day (may need adjusted portions)

## Special Dietary Needs

Some dogs require special diets due to:
- Allergies or food sensitivities
- Medical conditions (kidney disease, diabetes)
- Weight management
- Life stage changes

Always consult your veterinarian before making significant dietary changes.

## Conclusion

A well-balanced diet tailored to your dog's individual needs is essential for a long, healthy life. Regular veterinary check-ups can help ensure your dog's nutritional needs are being met.
    `,
    excerpt: 'Learn everything you need to know about proper dog nutrition, from choosing the right food to understanding portion control and special dietary needs.',
    category: 'nutrition',
    tags: ['nutrition', 'dog food', 'diet', 'health', 'feeding'],
    authorName: 'Dr. Sarah Johnson',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    isPublished: true,
    isFeatured: true,
    readTime: 8,
  },
  {
    title: 'Understanding Common Cat Diseases',
    slug: 'understanding-common-cat-diseases',
    content: `
# Understanding Common Cat Diseases

As a cat owner, being aware of common feline diseases helps you recognize symptoms early and seek prompt veterinary care. This guide covers the most prevalent conditions affecting cats.

## Upper Respiratory Infections (URIs)

### Symptoms
- Sneezing
- Nasal discharge
- Watery eyes
- Decreased appetite
- Lethargy

### Prevention
- Keep vaccinations current
- Minimize stress
- Maintain good hygiene
- Isolate sick cats from healthy ones

## Feline Lower Urinary Tract Disease (FLUTD)

FLUTD encompasses various conditions affecting the bladder and urethra.

### Warning Signs
- Straining to urinate
- Blood in urine
- Frequent trips to litter box
- Urinating outside litter box
- Excessive licking of genital area

### Prevention
- Provide fresh water at all times
- Feed quality food
- Maintain healthy weight
- Keep litter boxes clean

## Chronic Kidney Disease (CKD)

CKD is common in older cats and requires ongoing management.

### Symptoms
- Increased thirst and urination
- Weight loss
- Decreased appetite
- Vomiting
- Bad breath

### Management
- Special renal diet
- Subcutaneous fluids
- Regular monitoring
- Blood pressure management

## Diabetes Mellitus

Diabetes in cats can be managed with proper treatment.

### Symptoms
- Increased thirst and urination
- Weight loss despite good appetite
- Lethargy
- Poor coat condition

### Treatment
- Insulin injections
- Dietary management
- Weight control
- Regular monitoring

## Hyperthyroidism

Common in older cats, this condition affects metabolism.

### Symptoms
- Weight loss with increased appetite
- Hyperactivity
- Increased vocalization
- Vomiting and diarrhea

### Treatment Options
- Medication
- Radioactive iodine therapy
- Surgery
- Dietary management

## Dental Disease

Dental problems affect most cats over age 3.

### Prevention
- Regular dental check-ups
- Teeth brushing
- Dental treats and toys
- Professional cleanings

## Parasites

### External Parasites
- Fleas
- Ticks
- Ear mites

### Internal Parasites
- Roundworms
- Hookworms
- Tapeworms
- Giardia

### Prevention
- Regular preventive medications
- Keep indoor environment clean
- Regular veterinary check-ups

## When to See a Veterinarian

Seek immediate care if your cat shows:
- Difficulty breathing
- Inability to urinate
- Severe lethargy
- Seizures
- Trauma or injury
- Toxin ingestion

## Regular Health Care

Preventive care is essential:
- Annual wellness exams (biannual for seniors)
- Keep vaccinations current
- Maintain parasite prevention
- Monitor for changes in behavior or habits

## Conclusion

Understanding common cat diseases helps you provide better care for your feline friend. Early detection and treatment significantly improve outcomes for most conditions.
    `,
    excerpt: 'A comprehensive guide to recognizing and understanding common diseases that affect cats, including symptoms, prevention, and treatment options.',
    category: 'diseases',
    tags: ['cat health', 'diseases', 'symptoms', 'prevention', 'veterinary care'],
    authorName: 'Dr. Michael Chen',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
    isPublished: true,
    isFeatured: true,
    readTime: 10,
  },
  {
    title: 'Puppy Training Basics: A Complete Guide',
    slug: 'puppy-training-basics-complete-guide',
    content: `
# Puppy Training Basics: A Complete Guide

Training your puppy is one of the most important investments you'll make in your relationship. This guide covers essential training techniques to help your puppy grow into a well-behaved adult dog.

## Start Early

Begin training as soon as your puppy comes home (usually around 8 weeks old). Puppies are like sponges and learn quickly when training is positive and consistent.

## House Training

### Establish a Routine
- Take puppy out first thing in morning
- After meals and naps
- Before bedtime
- Every 2-3 hours during the day

### Success Tips
- Use the same spot each time
- Reward immediately after elimination
- Never punish accidents
- Clean accidents thoroughly
- Be patient and consistent

## Basic Commands

### Sit
1. Hold treat close to nose
2. Move hand up, causing head to follow
3. Bottom naturally goes down
4. Say "Sit" and give treat
5. Practice daily

### Stay
1. Ask puppy to sit
2. Open palm in front
3. Say "Stay"
4. Take a few steps back
5. Return and reward
6. Gradually increase distance and duration

### Come
1. Put puppy on leash
2. Get down to their level
3. Say "Come" enthusiastically
4. Gently pull leash if needed
5. Reward when they arrive
6. Never call to punish

### Down
1. Start with puppy sitting
2. Hold treat in closed fist
3. Move hand to floor
4. Slide along floor in front of puppy
5. Say "Down" when they follow
6. Release treat and praise

### Leave It
1. Place treat in both hands
2. Show closed fist with treat
3. Say "Leave it"
4. Ignore pawing/licking
5. When they stop, give treat from other hand
6. Gradually increase difficulty

## Socialization

Critical period is 3-14 weeks old.

### Expose Puppy To:
- Different people (ages, appearances)
- Other dogs (friendly and vaccinated)
- Various environments
- Different sounds
- Car rides
- Grooming handling

### Socialization Tips
- Keep experiences positive
- Don't force interactions
- Watch for stress signals
- Progress at puppy's pace
- Reward calm behavior

## Crate Training

Benefits include:
- Potty training aid
- Safe space for puppy
- Travel ease
- Preventing destructive behavior

### Steps
1. Make crate comfortable with bedding
2. Feed meals near/in crate
3. Gradually increase time inside
4. Never use as punishment
5. Don't leave too long (max 3-4 hours for puppies)

## Leash Training

### Walking Nicely
1. Start indoors
2. Reward staying near you
3. Change direction when they pull
4. Keep sessions short initially
5. Gradually move to outdoor practice

## Bite Inhibition

Puppies explore with mouths.

### Teaching Gentle Mouth
1. When bitten, say "Ouch!" loudly
2. Stop play immediately
3. Turn away or leave room briefly
4. Resume play when calm
5. Provide appropriate chew toys

## Common Mistakes to Avoid

- Inconsistency in rules
- Using punishment-based methods
- Expecting too much too soon
- Not enough exercise
- Inadequate socialization
- Skipping training sessions

## Training Tips for Success

### Positive Reinforcement
- Reward desired behaviors immediately
- Use treats, toys, and praise
- Keep training sessions short (5-10 minutes)
- End on positive note
- Be patient and consistent

### Timing is Everything
- Reward within 2 seconds
- Consistent cues
- Everyone uses same commands
- Practice in different locations

### Professional Help

Consider professional training if:
- Puppy shows aggression
- Excessive fear or anxiety
- Not responding to basic training
- You feel overwhelmed

## Training Schedule

### Daily Routine
- 3-4 short training sessions
- Morning: house training focus
- Midday: socialization
- Evening: command practice
- Before bed: calm activities

## Conclusion

Puppy training requires patience, consistency, and positive reinforcement. The time you invest now will pay dividends throughout your dog's life. Remember, every puppy learns at their own pace, so celebrate small victories and enjoy the journey.
    `,
    excerpt: 'Master the fundamentals of puppy training with this comprehensive guide covering house training, basic commands, socialization, and more.',
    category: 'training',
    tags: ['puppy training', 'dog training', 'obedience', 'socialization', 'behavior'],
    authorName: 'Dr. Emily Rodriguez',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
    isPublished: true,
    isFeatured: true,
    readTime: 12,
  },
  {
    title: 'Pet Dental Care: Why It Matters',
    slug: 'pet-dental-care-why-it-matters',
    content: `
# Pet Dental Care: Why It Matters

Dental health is often overlooked in pet care, yet it's crucial for your pet's overall health and quality of life. This guide explains why dental care matters and how to maintain your pet's oral health.

## The Importance of Dental Health

Dental disease is one of the most common health problems in pets. By age 3, most pets show signs of periodontal disease.

### Consequences of Poor Dental Health
- Pain and discomfort
- Difficulty eating
- Tooth loss
- Infection spreading to vital organs
- Bad breath
- Behavioral changes

## Understanding Dental Disease

### Stages of Periodontal Disease

**Stage 1: Gingivitis**
- Mild gum inflammation
- Reversible with treatment
- Bad breath present

**Stage 2: Early Periodontitis**
- Gum recession begins
- Up to 25% bone loss
- Treatment can prevent progression

**Stage 3: Moderate Periodontitis**
- Significant bone loss (25-50%)
- Exposed tooth roots
- Professional treatment required

**Stage 4: Advanced Periodontitis**
- Severe bone loss (over 50%)
- Tooth mobility
- Extraction often necessary

## Signs Your Pet Needs Dental Care

Watch for:
- Bad breath
- Yellow or brown teeth
- Red, swollen gums
- Bleeding gums
- Loose or missing teeth
- Difficulty eating
- Pawing at mouth
- Excessive drooling
- Behavior changes

## Home Dental Care

### Tooth Brushing

**Getting Started**
1. Choose pet-specific toothpaste (never human toothpaste)
2. Use finger brush or soft-bristled brush
3. Start slowly, make it positive
4. Focus on outer surfaces
5. Aim for daily brushing

**Step-by-Step**
1. Let pet taste toothpaste
2. Touch teeth and gums with finger
3. Introduce brush gradually
4. Start with a few teeth
5. Gradually increase duration
6. Reward cooperation

### Dental Treats and Chews

Benefits:
- Mechanical cleaning action
- Freshen breath
- Provide enjoyment

Look for:
- VOHC (Veterinary Oral Health Council) seal
- Appropriate size for your pet
- Digestible ingredients
- Pet's chewing style compatibility

### Dental Toys

Effective options:
- Rubber toys with textured surfaces
- Rope toys
- Dental chew toys
- Water additives (for some pets)

## Professional Dental Care

### When Needed
- Annual dental check-ups
- Professional cleanings as recommended
- Treatment for existing disease

### What to Expect

**Pre-Anesthetic Exam**
- Physical examination
- Blood work
- Discussion of any concerns

**The Procedure**
1. General anesthesia
2. Thorough examination
3. Scaling (removing plaque and tartar)
4. Polishing
5. Fluoride treatment
6. Extractions if necessary

**Recovery**
- Usually same-day discharge
- Soft food for a few days
- Pain medication if needed
- Follow-up as recommended

## Breed-Specific Considerations

### Small Dogs
- More prone to dental disease
- Crowded teeth
- May need more frequent cleanings

### Brachycephalic Breeds
- Misaligned teeth common
- Requires special attention

### Large Dogs
- Different chewing patterns
- May need different dental products

## Diet and Dental Health

### Dental Diets
- Specially formulated kibble
- Larger pieces encourage chewing
- Texture helps clean teeth
- May reduce plaque and tartar

### Foods to Avoid
- Excessive treats
- Hard objects that can break teeth
- Bones (cooked or small)
- Human food with sugar

## Cost of Dental Care

### Investment in Health
- Prevention is more affordable than treatment
- Regular care prevents serious disease
- Home care reduces professional cleaning frequency

### What Affects Cost
- Pet's size
- Extent of disease
- Number of extractions needed
- Geographic location
- Veterinary facility

## Creating a Dental Care Routine

### Daily
- Brush teeth
- Provide dental chew or toy

### Weekly
- Check teeth and gums
- Note any changes

### Annually
- Professional dental examination
- Cleaning if recommended

## Special Situations

### Senior Pets
- More prone to dental disease
- May have underlying health issues
- Regular monitoring essential

### Pets with Health Conditions
- Dental care still important
- Work with veterinarian on safe approach
- May need modified anesthesia protocol

## Conclusion

Good dental care is an essential part of pet ownership. With regular home care and professional attention, you can help your pet maintain healthy teeth and gums throughout their life, preventing pain and serious health problems.

Remember: Your veterinarian is your best resource for developing a dental care plan tailored to your pet's specific needs.
    `,
    excerpt: 'Discover why dental care is crucial for your pet\'s health and learn effective strategies for maintaining optimal oral hygiene at home and with professional care.',
    category: 'grooming',
    tags: ['dental care', 'pet health', 'grooming', 'prevention', 'teeth'],
    authorName: 'Dr. Emily Rodriguez',
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
    isPublished: true,
    isFeatured: false,
    readTime: 9,
  },
  {
    title: 'Emergency Pet Care: When to Act Fast',
    slug: 'emergency-pet-care-when-to-act-fast',
    content: `
# Emergency Pet Care: When to Act Fast

Knowing how to recognize and respond to pet emergencies can save your pet's life. This guide helps you identify true emergencies and provides guidance on immediate actions.

## True Emergencies - Seek Immediate Care

### Difficulty Breathing
- Labored breathing
- Blue gums or tongue
- Choking
- Excessive panting

**What to Do:**
1. Check airway for obstructions
2. Keep pet calm
3. Transport immediately to emergency vet

### Unconsciousness or Collapse
- Not responding to stimuli
- Unable to stand
- Seizures lasting over 3 minutes

**What to Do:**
1. Ensure airway is clear
2. Keep warm
3. Transport immediately

### Severe Bleeding
- Continuous bleeding for 5+ minutes
- Arterial bleeding (spurting blood)
- Blood from nose, mouth, or rectum

**What to Do:**
1. Apply direct pressure with clean cloth
2. Don't remove cloth if soaked; add more layers
3. Elevate wounded area if possible
4. Seek immediate care

### Toxin Ingestion
- Chocolate, xylitol, rat poison
- Human medications
- Household chemicals
- Toxic plants

**What to Do:**
1. Note what was ingested and how much
2. Don't induce vomiting unless instructed
3. Bring packaging/sample if safe
4. Call poison control or emergency vet

### Inability to Urinate
- Straining without producing urine
- Crying when trying to urinate
- Distended abdomen

**What to Do:**
- Emergency situation, especially in male cats
- Seek immediate veterinary care

### Eye Injuries
- Bulging eye
- Squinting
- Bloody eye
- Sudden blindness

**What to Do:**
1. Don't touch or apply anything to eye
2. Prevent pet from pawing at eye
3. Seek immediate care

### Severe Trauma
- Hit by car
- Falls from height
- Dog fights with puncture wounds
- Burns

**What to Do:**
1. Approach carefully (injured pets may bite)
2. Move carefully using board if possible
3. Keep warm
4. Transport immediately

### Heatstroke
- Heavy panting
- Drooling
- Rapid pulse
- Bright red gums
- Vomiting
- Collapse

**What to Do:**
1. Move to cool area
2. Apply cool (not cold) water to body
3. Offer small amounts of water
4. Seek immediate care

## Serious Situations - Contact Vet Promptly

### Vomiting or Diarrhea
Seek care if:
- Multiple episodes
- Blood present
- Accompanied by lethargy
- Lasting more than 24 hours
- Puppy or kitten affected

### Not Eating
Contact vet if:
- More than 24 hours without eating
- Accompanied by other symptoms
- Behavioral changes

### Limping or Lameness
Seek care if:
- Sudden onset
- Severe pain
- Inability to bear weight
- Visible injury

### Swollen Abdomen
Can indicate:
- Bloat (life-threatening in dogs)
- Fluid accumulation
- Internal bleeding

**What to Do:**
- Don't wait, especially in large breed dogs
- Seek immediate evaluation

## Creating an Emergency Plan

### Know Your Resources

**Primary Veterinarian**
- Name:
- Phone:
- Address:
- Hours:

**Emergency Vet**
- Name:
- Phone:
- Address:
- Hours: (usually 24/7)

**Poison Control**
- ASPCA Poison Control: (888) 426-4435
- Pet Poison Helpline: (855) 764-7661
- Note: May charge consultation fee

### Emergency Kit

Assemble and maintain:
- First aid supplies (gauze, bandages, tape)
- Hydrogen peroxide (for vomiting if instructed)
- Digital thermometer
- Muzzle or towel (even friendly pets bite when in pain)
- Leash and carrier
- Flashlight
- Emergency contact numbers
- Current photo of pet
- Medical records
- Current medications

### Transportation Plan
- Know route to emergency vet
- Have carrier ready
- Keep phone charged
- Have someone to help if possible

## First Aid Basics

### CPR for Pets

**Before Starting:**
- Check responsiveness
- Check breathing
- Check pulse

**For Dogs:**
1. Lay on right side
2. Extend head and neck
3. Close mouth, breathe into nose
4. 30 compressions, 2 breaths
5. 100-120 compressions per minute

**For Cats:**
1. Same position
2. Gentler compressions
3. Wrap hand around chest

**Note:** Learn proper CPR in class; this is basic overview

### Choking
1. Open mouth carefully
2. Remove visible object if possible
3. If not visible, perform Heimlich:
   - Stand behind dog
   - Make fist below ribs
   - Quick upward thrusts

### Wounds
1. Apply pressure to stop bleeding
2. Clean with saline if available
3. Cover with clean bandage
4. Seek veterinary care

## What Not to Do

- Don't give human medications without veterinary approval
- Don't induce vomiting unless instructed
- Don't apply heat to potential heatstroke victim
- Don't pull embedded objects
- Don't attempt to splint fractures yourself
- Don't feed or give water before surgery

## After the Emergency

### Follow-Up Care
- Follow all veterinary instructions
- Administer medications as directed
- Monitor for changes
- Attend follow-up appointments
- Keep activity restricted as advised

### Recovery Environment
- Quiet, comfortable space
- Easy access to water
- Easily digestible food
- Limited stairs or jumping
- Supervised outdoor time

## Prevention

### Regular Care
- Annual wellness exams
- Keep vaccinations current
- Maintain parasite prevention
- Dental care
- Proper nutrition

### Safety Measures
- Pet-proof home
- Secure fencing
- Supervise interactions
- Proper restraint in vehicles
- Identification (tags, microchip)

### Know Your Pet
- Normal behavior
- Normal vital signs
- Medical history
- Current medications
- Allergies

## Conclusion

While we hope you never face a pet emergency, being prepared and knowing how to respond can make a critical difference. Don't hesitate to seek help when concerned – it's always better to err on the side of caution when it comes to your pet's health.

Keep emergency numbers readily accessible and review your emergency plan regularly. Your quick action and preparation could save your pet's life.
    `,
    excerpt: 'Learn to recognize true pet emergencies and know exactly what to do in critical situations. This guide could save your pet\'s life.',
    category: 'general',
    tags: ['emergency', 'first aid', 'pet safety', 'health crisis', 'urgent care'],
    authorName: 'Dr. James Wilson',
    imageUrl: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800',
    isPublished: true,
    isFeatured: true,
    readTime: 11,
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    await Vet.deleteMany({});
    await Article.deleteMany({});
    
    console.log('✅ Existing data cleared');

    // Insert Veterinarians
    console.log('📝 Seeding veterinarians...');
    const createdVets = await Vet.insertMany(veterinarians);
    console.log(`✅ ${createdVets.length} veterinarians created`);

    // Create a dummy admin user for articles
    let adminUser;
    try {
      adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) {
        // Create a system admin user for articles
        adminUser = await User.create({
          firebaseUid: 'system-admin-' + Date.now(),
          email: 'system@happytails.com',
          fullName: 'HappyTails System',
          role: 'admin',
        });
        console.log('✅ System admin user created for articles');
      }
    } catch (error) {
      console.log('ℹ️  Could not create admin user, will use articles without author reference');
    }

    // Insert Articles with author reference if available
    console.log('📝 Seeding articles...');
    const articlesWithAuthor = articles.map((article) => ({
      ...article,
      author: adminUser ? adminUser._id : undefined,
    }));
    
    const createdArticles = await Article.insertMany(articlesWithAuthor);
    console.log(`✅ ${createdArticles.length} articles created`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${createdVets.length} Veterinarians`);
    console.log(`   - ${createdArticles.length} Educational Articles`);
    console.log('\n✅ Your HappyTails database is ready!');
    console.log('\n📝 Next steps:');
    console.log('   1. Register a new user at http://localhost:8080/register');
    console.log('   2. Login and explore the application');
    console.log('   3. Add your first pet');
    console.log('   4. Book an appointment with a vet');
    console.log('   5. Read educational articles');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
