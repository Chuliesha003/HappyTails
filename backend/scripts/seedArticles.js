const mongoose = require('mongoose');
const Article = require('../models/Article');
const User = require('../models/User');
require('dotenv').config();

// Sample articles data
const sampleArticles = [
  {
    title: "Understanding Common Dog Diseases: A Complete Guide for Pet Owners",
    content: `In today's world, dogs have become more than just pets—they're beloved family members. As responsible pet owners, understanding the health challenges our canine companions face is not just important, it's essential. This comprehensive guide explores the most common dog diseases, their symptoms, prevention strategies, and what you can do to keep your furry friend healthy and happy.

## The Silent Epidemic: Infectious Diseases That Threaten Our Dogs

### Parvovirus (Parvo): The Puppy Killer
Parvovirus, commonly known as "parvo," remains one of the most devastating diseases affecting dogs worldwide. This highly contagious virus attacks rapidly dividing cells, particularly in the intestines and bone marrow of puppies and young dogs.

**The Science Behind Parvo**
Parvo spreads through contact with infected feces, contaminated environments, or even on shoes and clothing. The virus can survive in the environment for months, making prevention crucial in areas with high dog populations.

**Recognizing the Warning Signs**
Early symptoms often appear 3-7 days after exposure and include:
- Sudden lethargy and depression
- Loss of appetite and refusal to eat
- High fever (often 104°F or higher)
- Severe vomiting, sometimes projectile
- Bloody diarrhea that can quickly lead to dehydration
- Abdominal pain and tenderness

**Treatment and Recovery**
Immediate veterinary intervention is critical. Treatment typically involves:
- Intravenous fluids to combat dehydration
- Anti-nausea medications
- Antibiotics to prevent secondary infections
- Nutritional support through feeding tubes if necessary
- Strict isolation to prevent spread

**Prevention: Your Best Defense**
- Vaccinate puppies starting at 6-8 weeks of age
- Complete the full vaccination series
- Keep puppies away from public areas until fully vaccinated
- Practice excellent hygiene and sanitation
- Avoid contact with unvaccinated dogs

### Distemper: The Multi-System Menace
Canine distemper virus affects multiple body systems and can be fatal. This highly contagious disease spreads through airborne droplets and direct contact.

**How Distemper Attacks**
The virus targets the respiratory system first, then spreads to the gastrointestinal and nervous systems. In its neurological form, distemper can cause permanent brain damage.

**Symptoms Across Stages**
- **Early Stage (Respiratory):** Coughing, nasal discharge, fever, lethargy
- **Gastrointestinal Stage:** Vomiting, diarrhea, dehydration
- **Neurological Stage:** Seizures, paralysis, behavioral changes, twitching

**Long-Term Consequences**
Surviving dogs may develop chronic neurological issues including:
- Recurrent seizures
- Circling behavior
- Muscle tremors
- Dental enamel defects
- Chronic eye problems

**Vaccination: The Cornerstone of Prevention**
Distemper vaccines are typically given as part of combination shots (DHPP) starting at 6-8 weeks of age, with boosters every 3-4 weeks until 16 weeks, then annually.

## Parasitic Predators: Hidden Threats to Canine Health

### Heartworm Disease: The Silent Heart Attack
Heartworm disease, caused by Dirofilaria immitis, affects over 1 million dogs in the United States annually. This parasitic infection can be fatal if left untreated.

**The Life Cycle of Destruction**
- Mosquitoes transmit microscopic larvae through bites
- Larvae mature into adult worms in the heart and lungs
- Adult worms can grow up to 12 inches long
- Female worms produce microfilariae that circulate in the blood

**Progressive Symptoms**
- **Early Stage:** Mild cough, fatigue
- **Moderate Stage:** Persistent cough, exercise intolerance, weight loss
- **Severe Stage:** Heart failure, caval syndrome, sudden death

**Treatment Challenges**
Heartworm treatment is complex and risky:
- Requires strict cage rest for 4-6 weeks
- Multiple injections of melarsomine (adulticide)
- Supportive care for heart and lung function
- Prevention of exercise to avoid lung damage

**Monthly Prevention: A Must**
- Heartworm preventatives are given monthly year-round
- Testing required before starting prevention
- Annual heartworm testing recommended
- Some preventatives also protect against fleas, ticks, and intestinal parasites

### Fleas and Ticks: More Than Just a Nuisance
External parasites not only cause discomfort but can transmit serious diseases.

**Flea-Borne Diseases**
- **Bartonellosis (Cat Scratch Disease):** Can affect dogs too
- **Tapeworm Infection:** From ingesting fleas
- **Flea Allergy Dermatitis:** Severe allergic reactions

**Tick-Borne Threats**
- **Lyme Disease:** Joint pain, fever, lethargy
- **Anaplasmosis:** Similar to Lyme but affects blood cells
- **Ehrlichiosis:** Can cause severe bleeding disorders
- **Rocky Mountain Spotted Fever:** Potentially fatal

**Integrated Parasite Control**
- Year-round flea/tick prevention
- Regular bathing and grooming
- Environmental control (yard treatment)
- Tick checks after outdoor time

## Age-Related Challenges: Chronic Conditions in Senior Dogs

### Arthritis: The Painful Reality of Aging
Osteoarthritis affects up to 20% of dogs over age 1, with prevalence increasing with age. This degenerative joint disease causes pain and reduced mobility.

**Understanding Joint Degeneration**
- Cartilage breakdown between bones
- Inflammation of surrounding tissues
- Bone spur formation
- Reduced joint fluid

**Behavioral Indicators of Pain**
- Limping or stiffness after rest
- Difficulty rising or lying down
- Reluctance to climb stairs or jump
- Decreased interest in walks or play
- Irritability when touched

**Management Strategies**
- **Weight Control:** Reduces stress on joints
- **Exercise:** Low-impact activities like swimming
- **Supplements:** Glucosamine, chondroitin, omega-3 fatty acids
- **Medications:** NSAIDs, pain relievers prescribed by vets
- **Physical Therapy:** Professional rehabilitation
- **Joint Injections:** Corticosteroids or hyaluronic acid

### Diabetes Mellitus: When Blood Sugar Goes Wrong
Canine diabetes affects approximately 1 in 300 dogs, with certain breeds more predisposed.

**The Insulin Imbalance**
Diabetes occurs when the pancreas doesn't produce enough insulin or the body doesn't respond properly to insulin, leading to elevated blood glucose levels.

**Classic Symptoms**
- **Polydipsia:** Excessive thirst
- **Polyuria:** Frequent urination
- **Polyphagia:** Increased appetite despite weight loss
- **Weight Loss:** Despite eating more
- **Lethargy:** Low energy levels
- **Cataracts:** Clouding of the lens

**Daily Management Challenges**
- Twice-daily insulin injections
- Blood glucose monitoring
- Strict feeding schedules
- Weight management
- Regular veterinary check-ups
- Emergency preparedness for hypo/hyperglycemia

**Prevention Through Early Detection**
- Annual wellness exams with bloodwork
- Monitor for early symptoms
- Maintain healthy weight
- Regular exercise routine

## Cancer: The Growing Concern in Veterinary Medicine

### Common Canine Cancers
- **Lymphoma:** Most common cancer in dogs
- **Mast Cell Tumors:** Skin cancer affecting mast cells
- **Osteosarcoma:** Aggressive bone cancer
- **Hemangiosarcoma:** Cancer of blood vessel cells

**Early Warning Signs**
- Unusual lumps or bumps
- Persistent sores that don't heal
- Weight loss without diet changes
- Loss of appetite
- Lethargy and depression
- Difficulty breathing or coughing

**Diagnostic Approaches**
- Physical examination and palpation
- Blood tests and urinalysis
- X-rays and ultrasound
- Biopsy and histopathology
- Advanced imaging (CT, MRI)

**Treatment Options**
- Surgery for localized tumors
- Chemotherapy protocols
- Radiation therapy
- Immunotherapy and targeted therapies
- Palliative care for comfort

## Prevention: The Foundation of Canine Health

### Vaccination Schedules
- **Core Vaccines:** Distemper, parvovirus, rabies, adenovirus
- **Non-Core Vaccines:** Based on lifestyle and risk factors
- **Titer Testing:** Antibody level testing as alternative to boosters

### Parasite Prevention Programs
- Monthly heartworm preventatives
- Year-round flea/tick control
- Intestinal parasite screening
- Environmental parasite control

### Nutritional Excellence
- Age-appropriate commercial diets
- Portion control and weight management
- Fresh water availability
- Treats used for training, not as meal replacements

### Regular Health Monitoring
- Monthly home health checks
- Annual veterinary wellness exams
- Age-appropriate bloodwork
- Dental care and oral hygiene

### Environmental Enrichment
- Regular exercise appropriate for age and breed
- Mental stimulation through toys and training
- Safe outdoor environments
- Social interaction with other dogs and people

## Emergency Preparedness: When Seconds Count

### Creating an Emergency Plan
- Identify your regular veterinarian and emergency clinic
- Keep emergency contact numbers readily available
- Prepare a pet first aid kit
- Know basic pet CPR and first aid

### Common Emergency Situations
- **Toxicity:** Chocolate, grapes, onions, xylitol
- **Trauma:** Hit by car, falls, fights
- **Gastrointestinal:** Bloat, foreign body ingestion
- **Respiratory:** Choking, severe allergic reactions
- **Neurological:** Seizures, head injuries

### Pet Poison Control Resources
- ASPCA Animal Poison Control Center: (888) 426-4435
- Pet Poison Helpline: (855) 764-7661
- Local emergency veterinary hospitals

## The Future of Canine Health

### Advances in Veterinary Medicine
- Genetic testing for disease predisposition
- Personalized medicine approaches
- Advanced imaging and minimally invasive procedures
- Stem cell therapy and regenerative medicine
- Immunotherapy for cancer treatment

### The Role of Technology
- Wearable health monitors for dogs
- AI-powered symptom checkers
- Telemedicine consultations
- Automated medication dispensers

## Conclusion: Partnership in Health

The relationship between dogs and their owners is built on trust, love, and responsibility. By understanding common dog diseases and committing to preventive care, we can significantly improve our canine companions' quality and length of life.

Remember, while this guide provides comprehensive information about common dog diseases, it's not a substitute for professional veterinary care. Regular check-ups, prompt attention to symptoms, and open communication with your veterinarian are essential for maintaining your dog's health.

Your dog's health is a journey you take together. With knowledge, prevention, and professional care, you can ensure your furry friend enjoys a long, healthy, and happy life by your side.`,
    category: "diseases",
    tags: ["dogs", "health", "prevention", "vaccination", "parasites", "cancer", "arthritis", "diabetes", "heartworm", "emergency"],
    authorName: "Vinuki Omalshara",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1516972810927-80185027ca84?w=1200&h=700&fit=crop"
    ],
    isPublished: true,
    isFeatured: true,
    metaDescription: "Comprehensive guide to common dog diseases, symptoms, prevention, and treatment. Essential knowledge for every dog owner.",
    metaKeywords: ["dog diseases", "canine health", "pet care", "veterinary", "dog illness", "pet prevention"]
  },
  {
    title: "Cat Health 101: The Complete Guide to Understanding Your Feline Friend's Well-being",
    content: `Cats have captured our hearts for thousands of years, evolving from wild predators to beloved household companions. Yet beneath their independent exterior lies a complex creature whose health requires attentive care. This comprehensive guide explores the intricate world of feline health, helping you become the guardian your cat deserves.

## Decoding the Feline Mystery: Why Cats Hide Illness

Cats, descendants of solitary desert hunters, have evolved to conceal signs of weakness. In the wild, showing vulnerability could mean death. This instinct persists in our domesticated cats, making early disease detection challenging but not impossible.

**The Art of Feline Communication**
Cats communicate through subtle cues that require careful observation:
- **Body Language:** Ears flattened back, tail twitching, or hunched posture
- **Vocalizations:** Changes from normal meowing to unusual sounds
- **Social Behavior:** Hiding more than usual or becoming unusually clingy
- **Routine Changes:** Sleeping in different locations or altered litter box habits

## The Behavioral Red Flags: Early Warning Signals

### Appetite Abnormalities: The First Clue
Your cat's eating habits provide crucial health insights. Any deviation from normal patterns warrants attention.

**Loss of Appetite (Anorexia)**
- Complete refusal of favorite foods
- Leaving food untouched for 24+ hours
- Weight loss over days or weeks
- May indicate serious conditions like kidney disease, cancer, or dental problems

**Increased Hunger (Polyphagia)**
- Constant begging for food
- Eating everything in sight
- Often linked to diabetes or hyperthyroidism
- Can lead to obesity if not addressed

**Selective Eating or Picky Behavior**
- Refusing certain textures or flavors
- May signal dental pain or gastrointestinal issues
- Could indicate nutritional deficiencies

### Litter Box Secrets: What Your Cat Won't Say
The litter box serves as a health diary, revealing problems you might otherwise miss.

**Urinary Tract Issues**
- **Frequent Urination:** Small amounts, multiple times per hour
- **Straining to Urinate:** Crouching and straining without producing urine
- **Blood in Urine:** Pink or red-tinged urine
- **Urinating Outside Box:** Often indicates pain or urinary tract infection

**Fecal Abnormalities**
- **Diarrhea:** Loose, watery stools that may contain blood or mucus
- **Constipation:** Hard, dry stools or absence of defecation
- **Straining:** Similar to urinary issues but during defecation
- **Abnormal Odor:** Foul-smelling stools indicating digestive problems

### Grooming: The Mirror of Internal Health
Cats are meticulous groomers, and changes in grooming habits often signal health issues.

**Over-Grooming (Excessive Grooming)**
- Bald patches from compulsive licking
- Often caused by stress, allergies, or parasites
- Can lead to skin infections from self-trauma

**Neglecting Grooming**
- Dull, matted coat
- Dandruff or excessive shedding
- May indicate arthritis, depression, or systemic illness

**Changes in Coat Quality**
- Oily or greasy fur
- Brittle hair that breaks easily
- Loss of undercoat
- Often linked to nutritional deficiencies or hormonal imbalances

## Physical Symptoms: What to Look For

### Gastrointestinal Distress Signals
The digestive system provides clear indicators of feline health status.

**Vomiting Episodes**
- **Acute Vomiting:** Sudden onset, may be due to hairballs or dietary indiscretion
- **Chronic Vomiting:** Persistent episodes requiring veterinary attention
- **Bilious Vomiting:** Yellow fluid indicating bile reflux
- **Hematemesis:** Blood in vomit - emergency situation

**Abdominal Abnormalities**
- **Distension:** Swollen belly from fluid accumulation or organ enlargement
- **Pain Response:** Hissing, growling, or aggression when abdomen is touched
- **Palpable Masses:** Unusual lumps or bumps requiring immediate evaluation

### Respiratory Health Indicators
Cats can develop breathing problems that require prompt attention.

**Upper Respiratory Signs**
- **Sneezing:** Can be allergic, infectious, or dental-related
- **Nasal Discharge:** Clear, colored, or bloody
- **Reverse Sneezing:** Sudden, rapid inhalations common in some breeds

**Lower Respiratory Issues**
- **Coughing:** Rare in cats, always concerning
- **Wheezing:** Noisy breathing indicating airway obstruction
- **Rapid Breathing:** Rate over 30 breaths per minute at rest
- **Open-Mouth Breathing:** Severe respiratory distress

### Skin and Coat: External Reflections of Internal Health
The skin serves as a window to overall health status.

**Dermatological Problems**
- **Alopecia:** Hair loss in patches or generalized
- **Pruritus:** Intense itching leading to self-trauma
- **Erythema:** Red, inflamed skin
- **Papules/Pustules:** Bumps and pimples

**Parasitic Infestations**
- **Fleas:** Visible insects or flea dirt (black specks)
- **Mites:** Intense itching, especially around ears and neck
- **Lice:** Rare but possible, causing hair loss
- **Ringworm:** Fungal infection causing circular bald patches

## The Major Feline Health Challenges

### Urinary System Disorders: A Growing Concern
Feline urinary tract issues affect millions of cats annually.

**Feline Lower Urinary Tract Disease (FLUTD)**
- **Idiopathic Cystitis:** Stress-related bladder inflammation
- **Urolithiasis:** Bladder stones causing obstruction
- **Urinary Tract Infections:** Bacterial infections
- **Anatomical Defects:** Congenital abnormalities

**Risk Factors for FLUTD**
- Obesity and sedentary lifestyle
- Inadequate water intake
- Stress and environmental changes
- Multi-cat households
- Dry food diets exclusively

**Prevention Strategies**
- Encourage water consumption with fountains
- Maintain healthy weight
- Reduce stress through environmental enrichment
- Regular veterinary check-ups
- Consider wet food options

### Endocrine Disorders: Hormonal Imbalances
Hormonal problems become more common as cats age.

**Hyperthyroidism: The Overactive Thyroid**
- **Prevalence:** Affects 10% of cats over age 10
- **Symptoms:** Weight loss, increased appetite, hyperactivity, vomiting
- **Diagnosis:** Blood tests measuring thyroid hormone levels
- **Treatment:** Medication, radioactive iodine, or surgery

**Diabetes Mellitus in Cats**
- **Risk Factors:** Obesity, sedentary lifestyle, certain medications
- **Symptoms:** Increased thirst/urination, weight loss, increased appetite
- **Management:** Insulin injections, dietary changes, weight control
- **Prognosis:** Most cats can live normal lives with proper management

### Dental Disease: The Hidden Epidemic
Dental problems affect 70% of cats over age 3, yet often go unnoticed.

**Periodontal Disease Progression**
- **Stage 1:** Gingivitis (reversible inflammation)
- **Stage 2:** Early periodontitis with bone loss
- **Stage 3:** Advanced bone loss and tooth mobility
- **Stage 4:** Complete tooth loss and systemic effects

**Consequences of Untreated Dental Disease**
- **Oral Pain:** Chronic discomfort affecting eating and grooming
- **Systemic Infections:** Bacteria entering bloodstream
- **Organ Damage:** Heart, kidney, and liver complications
- **Behavioral Changes:** Irritability and depression

**Dental Care Essentials**
- Daily tooth brushing with cat-safe toothpaste
- Professional cleanings under anesthesia
- Dental diets and water additives
- Regular oral examinations

### Cancer in Cats: Understanding the Risks
Cancer affects approximately 1 in 5 cats during their lifetime.

**Common Feline Cancers**
- **Lymphoma:** Most common cancer, affects lymphatic system
- **Squamous Cell Carcinoma:** Skin cancer, especially in white cats
- **Mammary Gland Tumors:** Common in unspayed females
- **Oral Tumors:** Often malignant and aggressive

**Early Detection Signs**
- Unusual lumps or bumps
- Persistent sores that don't heal
- Weight loss and appetite changes
- Lethargy and behavioral changes
- Difficulty eating or swallowing

## Age-Related Health Considerations

### Kitten Health: The Foundation Years
The first year of life sets the stage for lifelong health.

**Critical Development Stages**
- **Neonatal Period (0-2 weeks):** Focus on maternal care and warmth
- **Socialization Period (2-7 weeks):** Critical for behavioral development
- **Juvenile Period (7-16 weeks):** Vaccination and training
- **Adolescent Period (4-12 months):** Growth spurts and sexual maturity

**Kitten Health Priorities**
- Proper vaccination schedules
- Parasite prevention
- Nutritional support for growth
- Socialization and training
- Spaying/neutering at appropriate age

### Senior Cat Care: The Golden Years
Cats age gracefully but require special attention as they mature.

**Geriatric Health Screening**
- Annual comprehensive physical exams
- Blood work every 6-12 months
- Blood pressure monitoring
- Dental assessments twice yearly
- Weight and body condition scoring

**Common Age-Related Issues**
- **Arthritis:** Joint pain and mobility issues
- **Kidney Disease:** Chronic renal failure
- **Thyroid Problems:** Hyperthyroidism
- **Dental Disease:** Periodontal problems
- **Vision/Hearing Loss:** Sensory decline

## Emergency Situations: When to Act Immediately

### True Veterinary Emergencies
- **Difficulty Breathing:** Open-mouth breathing, blue gums
- **Seizures or Collapse:** Unconsciousness or convulsions
- **Severe Bleeding:** Uncontrolled hemorrhage
- **Toxicity:** Known ingestion of toxic substances
- **Trauma:** Hit by car, falls from height
- **Severe Pain:** Screaming, hiding, aggression

### Urgent Care Situations
- **Not Eating for 48 Hours:** Potential dehydration
- **Bloody Diarrhea/Vomiting:** Gastrointestinal bleeding
- **Straining to Urinate:** Potential urinary obstruction
- **Sudden Blindness:** Retinal detachment or hypertension
- **Broken Bones:** Obvious limping or deformity

### Poison Control Resources
- **ASPCA Animal Poison Control:** (888) 426-4435
- **Pet Poison Helpline:** (855) 764-7661
- **Emergency Veterinary Clinics:** 24/7 availability

## Preventive Healthcare: The Foundation of Wellness

### Vaccination Guidelines
- **Core Vaccines:** Required for all cats
  - Feline Panleukopenia (Distemper)
  - Feline Calicivirus
  - Feline Herpesvirus
  - Rabies
- **Lifestyle Vaccines:** Based on risk factors
  - Feline Leukemia Virus (FeLV)
  - Feline Immunodeficiency Virus (FIV)
  - Bordetella (for multi-cat households)

### Parasite Prevention
- **Internal Parasites:** Monthly heartworm prevention
- **External Parasites:** Year-round flea/tick control
- **Regular Testing:** Fecal examinations annually

### Nutritional Excellence
- **Age-Appropriate Diets:** Kitten, adult, and senior formulations
- **High-Quality Ingredients:** Named protein sources
- **Balanced Nutrition:** Complete and balanced diets
- **Portion Control:** Prevent obesity

### Environmental Enrichment
- **Vertical Space:** Cat trees and shelves
- **Scratching Posts:** Natural scratching outlets
- **Interactive Toys:** Mental stimulation
- **Litter Box Management:** Clean, accessible facilities

## The Human-Animal Bond: Your Role in Feline Health

### Daily Health Monitoring
- **Morning Routine:** Check eating, drinking, elimination
- **Evening Assessment:** Monitor activity and behavior
- **Weekly Weigh-Ins:** Track weight changes
- **Monthly Body Checks:** Feel for lumps, check teeth

### Building Trust for Veterinary Care
- **Positive Associations:** Make vet visits rewarding
- **Carrier Training:** Get cats comfortable with carriers
- **Home Examinations:** Practice gentle handling
- **Stress Reduction:** Pheromone diffusers and calming aids

### Financial Planning for Health Care
- **Pet Insurance:** Consider coverage for unexpected costs
- **Emergency Fund:** Set aside money for urgent care
- **Payment Plans:** Discuss options with your veterinarian
- **Preventive Care Budget:** Plan for routine wellness costs

## The Future of Feline Healthcare

### Technological Advancements
- **Telemedicine:** Remote consultations for minor issues
- **Wearable Monitors:** Activity and health tracking devices
- **AI Diagnostics:** Symptom checkers and early detection tools
- **Genetic Testing:** Breed-specific health risk assessment

### Research Breakthroughs
- **Stem Cell Therapy:** Regenerative medicine applications
- **Immunotherapy:** Advanced cancer treatment options
- **Nutrigenomics:** Personalized nutrition based on genetics
- **Microbiome Research:** Gut health and immune function

## Conclusion: A Lifetime Commitment to Feline Wellness

Caring for a cat means embracing a lifetime commitment to their health and happiness. By understanding feline behavior, recognizing early warning signs, and providing comprehensive preventive care, you can ensure your cat lives a long, healthy, and fulfilling life.

Remember, you are your cat's advocate, voice, and healthcare provider. Regular veterinary care, attentive observation, and prompt action when problems arise are the cornerstones of feline wellness. Your dedication today ensures countless happy tomorrows with your feline companion.

In the end, the greatest gift you can give your cat is not just food and shelter, but the attentive care that comes from truly understanding their unique health needs. Your cat may never say "thank you" in words, but their purrs, head bumps, and unwavering companionship speak volumes about the difference you make in their life.`,
    category: "diseases",
    tags: ["cats", "health", "symptoms", "prevention", "veterinary", "feline", "illness", "wellness", "dental", "urinary"],
    authorName: "Kavidhi Perera",
    images: [
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200&h=700&fit=crop"
    ],
    isPublished: true,
    isFeatured: true,
    metaDescription: "Comprehensive guide to cat health, symptoms, diseases, and preventive care. Essential knowledge for every cat owner.",
    metaKeywords: ["cat health", "feline diseases", "pet care", "veterinary", "cat illness", "cat wellness"]
  },
  {
    title: "The Ultimate Guide to Puppy Nutrition",
    content: `Proper nutrition is crucial for your puppy's growth and development. Puppies have specific nutritional needs that differ significantly from adult dogs. This guide will help you understand what to feed your puppy and why.

## Nutritional Requirements for Puppies

### Protein
Puppies need high-quality protein for muscle development and tissue repair. Look for:
- Chicken, turkey, fish, or eggs as primary protein sources
- Protein content of 22-32% for puppies
- Easily digestible proteins

### Fats
Essential for energy, brain development, and healthy skin/coat:
- 8-20% fat content in puppy food
- Omega-3 and Omega-6 fatty acids
- Sources: fish oil, flaxseed, chicken fat

### Carbohydrates
Provide energy and fiber:
- Complex carbohydrates like rice, oats, and sweet potatoes
- Avoid fillers like corn or soy as primary ingredients

### Vitamins and Minerals
Critical for bone development and immune function:
- Calcium and phosphorus for bone growth
- DHA for brain development
- Antioxidants for immune support

## Feeding Schedule by Age

### 8-12 weeks (2-3 months)
- 4 meals per day
- 1/2 to 1 cup total daily
- Small, frequent meals to prevent hypoglycemia

### 3-6 months
- 3 meals per day
- 1-2 cups total daily
- Transition to adult feeding schedule

### 6-12 months
- 2-3 meals per day
- 2-3 cups total daily
- Adjust based on breed size and activity level

## Choosing the Right Puppy Food

### Age-Appropriate Formula
- Puppy food until 12-18 months
- Higher calorie density than adult food
- Smaller kibble size for easier chewing

### Breed Size Considerations
- Large breed puppies need controlled calcium/phosphorus
- Small breed puppies may need smaller kibble
- Giant breeds have special nutritional needs

### Quality Indicators
- AAFCO certification
- Named meat sources (not "meat by-products")
- Limited fillers and artificial additives
- Clear ingredient list

## Common Nutritional Mistakes

### Overfeeding
- Leads to rapid growth and joint problems
- Obesity in puppies
- Digestive upset

### Inappropriate Treats
- Human food can cause nutritional imbalances
- Table scraps lack essential nutrients
- Excessive treats reduce appetite for balanced meals

### Skipping Meals
- Puppies need consistent feeding
- Can lead to hypoglycemia
- Affects growth and development

## Supplements for Puppies

### Joint Health
- Glucosamine and chondroitin
- Especially important for large breeds

### Digestive Health
- Probiotics for gut health
- Prebiotics for fiber

### Omega-3 Fatty Acids
- For skin, coat, and brain development
- From fish oil supplements

## Transitioning to Adult Food

### When to Switch
- Small breeds: 9-12 months
- Medium breeds: 12-18 months
- Large/giant breeds: 18-24 months

### How to Transition
- Mix old and new food over 7-10 days
- Gradually increase new food percentage
- Monitor for digestive upset

## Special Considerations

### Allergies
- Common allergens: beef, chicken, wheat, corn
- Hypoallergenic diets if needed
- Work with your vet for diagnosis

### Medical Conditions
- Special diets for puppies with health issues
- Prescription diets when necessary
- Regular veterinary monitoring

Remember, every puppy is unique. Consult your veterinarian for personalized nutritional advice based on your puppy's breed, size, and health status.`,
    category: "nutrition",
    tags: ["puppies", "nutrition", "feeding", "growth", "health"],
    authorName: "Chuliesha Perera",
    images: [
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=1200&h=700&fit=crop"
    ],
    isPublished: true,
    isFeatured: false,
    metaDescription: "Complete guide to puppy nutrition, feeding schedules, and choosing the right food for optimal growth and health.",
    metaKeywords: ["puppy nutrition", "dog food", "feeding schedule", "puppy care"]
  },
  {
    title: "How to Show Love to Your Pets: Building Strong Bonds",
    content: `The bond between pets and their owners is one of life's greatest joys. Understanding how your pet expresses and receives love can strengthen your relationship and improve their quality of life. Different pets show and receive affection in unique ways.

## Understanding Your Pet's Love Language

### Dogs: Physical Touch and Play
Dogs are social pack animals that thrive on physical contact and interactive play.

**Ways to show love:**
- Regular belly rubs and ear scratches
- Play sessions with their favorite toys
- Cuddling on the couch
- Gentle grooming and brushing
- Walking together

**Signs your dog loves you:**
- Tail wagging and excited greetings
- Leaning against you
- Following you around the house
- Sleeping in your bed
- Bringing you toys

### Cats: Independent Affection
Cats show love in subtle, independent ways that require patience to recognize.

**Ways to show love:**
- Respect their personal space
- Gentle petting (especially under the chin and behind ears)
- Playing with interactive toys
- Providing vertical spaces and scratching posts
- Quiet companionship

**Signs your cat loves you:**
- Head bunting (rubbing against you)
- Kneading with paws
- Purring when you're near
- Slow blinking
- Bringing you "gifts"

### Birds: Social Interaction
Birds form strong bonds through consistent social interaction and trust.

**Ways to show love:**
- Daily interaction and talking
- Providing foraging opportunities
- Respecting their cage boundaries
- Offering healthy treats
- Maintaining a consistent routine

### Small Mammals: Gentle Handling
Hamsters, guinea pigs, and rabbits need gentle, predictable handling.

**Ways to show love:**
- Slow, gentle movements
- Hand feeding treats
- Providing enrichment activities
- Respecting their need for rest
- Clean, comfortable housing

## Daily Love Rituals

### Morning Routine
- Greet your pet warmly
- Provide fresh food and water
- Short play session or walk
- Gentle petting or grooming

### Evening Wind-Down
- Quiet time together
- Final bathroom break
- Cuddle time before bed
- Consistent bedtime routine

### Quality Time Activities
- Training sessions (mental stimulation)
- Puzzle toys and games
- Grooming and massage
- Outdoor adventures
- Learning new tricks

## Physical Expressions of Love

### Touch and Massage
- Learn your pet's preferred touch spots
- Use gentle, consistent pressure
- Watch for body language cues
- Combine with verbal praise

### Play and Exercise
- Match activities to your pet's energy level
- Provide mental stimulation
- Include socialization opportunities
- Regular exercise prevents boredom

### Comfort and Security
- Provide a safe, comfortable environment
- Maintain consistent routines
- Offer emotional support during stress
- Create a "safe space" for your pet

## Emotional Bonding

### Trust Building
- Be consistent and reliable
- Respect boundaries
- Use positive reinforcement
- Avoid punishment-based training

### Communication
- Learn your pet's body language
- Use clear, consistent commands
- Pay attention to subtle cues
- Respond appropriately to needs

### Quality Time
- Uninterrupted attention
- Remove distractions during bonding time
- Be fully present in the moment
- Create positive associations

## Health and Wellness Love

### Preventive Care
- Regular veterinary check-ups
- Proper nutrition and exercise
- Dental care and grooming
- Parasite prevention

### Comfort During Illness
- Extra attention and care
- Follow veterinary recommendations
- Provide comfort items
- Monitor recovery progress

### End-of-Life Care
- Quality time during final days
- Comfort and pain management
- Peaceful environment
- Grief support for the family

## Recognizing Love in Return

### Behavioral Indicators
- Seeking your company
- Responding to your voice
- Showing excitement when you return
- Protecting family members
- Sharing personal space

### Physical Signs
- Relaxed body language
- Contented expressions
- Healthy appetite and energy
- Good sleep patterns
- Grooming themselves and others

## The Science of Pet Love

### Oxytocin Release
Both pets and owners experience oxytocin release during positive interactions, strengthening the bond.

### Stress Reduction
Pet ownership reduces stress hormones and increases feel-good chemicals in both species.

### Health Benefits
- Lower blood pressure
- Reduced anxiety and depression
- Increased physical activity
- Improved social connections

## Common Mistakes in Showing Love

### Overindulgence
- Too many treats leading to health issues
- Inconsistent boundaries
- Spoiling that creates behavioral problems

### Anthropomorphism
- Treating pets like humans rather than their species
- Expecting human-like responses
- Ignoring species-specific needs

### Neglecting Needs
- Assuming love means never saying no
- Ignoring training and boundaries
- Forgetting basic care requirements

## Building Lasting Bonds

The strongest pet-owner relationships are built on:
- Mutual respect and understanding
- Consistent care and attention
- Positive reinforcement
- Patience and compassion
- Lifelong commitment

Remember, showing love to your pet isn't just about what you give them—it's about understanding what they need and providing it consistently. Every pet is unique, so take time to learn what makes your companion feel most loved and secure.`,
    category: "behavior",
    tags: ["pet love", "bonding", "behavior", "care", "relationship"],
    authorName: "Vinuki Omalshara",
    images: [
      "https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1507149833265-60c372daea22?w=1200&h=700&fit=crop"
    ],
    isPublished: true,
    isFeatured: true,
    metaDescription: "Learn how to show love to your pets in ways they understand. Build stronger bonds through proper care and affection.",
    metaKeywords: ["pet love", "animal bonding", "pet care", "pet behavior", "pet-owner relationship"]
  },
  {
    title: "Essential Cat Nutrition: What Every Owner Should Know",
    content: `Cats are obligate carnivores with specific nutritional requirements that differ significantly from dogs and humans. Understanding feline nutrition is crucial for maintaining your cat's health and preventing common nutritional deficiencies.

## Understanding Feline Dietary Needs

### Protein Requirements
Cats require high levels of animal-based protein for optimal health.

**Essential amino acids:**
- Taurine (not found in plant proteins)
- Arginine
- Methionine
- Cysteine

**Protein sources:**
- Chicken, turkey, fish
- Avoid excessive plant-based proteins
- Protein should be 30-45% of diet

### Fat Content
Fats provide essential fatty acids and help with nutrient absorption.

**Requirements:**
- 9-15% fat content
- Omega-3 and Omega-6 fatty acids
- Sources: fish oil, chicken fat

### Carbohydrates
Cats have limited ability to digest carbohydrates.

**Guidelines:**
- 3-10% carbohydrate content
- Easily digestible sources
- Avoid excessive grains

## Common Nutritional Deficiencies

### Taurine Deficiency
Critical for heart and eye health.

**Symptoms:**
- Blindness (central retinal degeneration)
- Heart disease (dilated cardiomyopathy)
- Reproductive problems

**Prevention:** Feed high-quality commercial cat food with added taurine.

### Vitamin A Deficiency
Essential for vision and immune function.

**Symptoms:**
- Night blindness
- Increased susceptibility to infections
- Poor coat condition

**Prevention:** Include liver or vitamin A supplements in diet.

### Niacin Deficiency
Important for energy metabolism.

**Symptoms:**
- Weight loss
- Poor appetite
- Skin problems

**Prevention:** Balanced commercial diet or niacin supplements.

## Age-Specific Nutrition

### Kittens (0-12 months)
- Higher protein and fat content
- More frequent meals (3-4 times daily)
- Special growth formulas
- Essential for proper development

### Adult Cats (1-7 years)
- Maintenance formulas
- 2 meals per day
- Weight management focus
- Breed-specific considerations

### Senior Cats (7+ years)
- Senior formulas with joint support
- Controlled phosphorus for kidney health
- Antioxidant-rich diets
- Smaller, more frequent meals

## Special Dietary Needs

### Indoor vs. Outdoor Cats
- Indoor cats may need hairball control formulas
- Outdoor cats require more calories
- Environmental enrichment important for both

### Breed-Specific Nutrition
- Persian cats: Hairball prevention
- Maine Coon: Joint health support
- Siamese: Sensitive digestion formulas

### Medical Conditions
- Kidney disease: Phosphorus-restricted diets
- Diabetes: High-protein, low-carbohydrate diets
- Urinary tract issues: pH-balanced formulas
- Obesity: Calorie-controlled diets

## Reading Cat Food Labels

### Key Ingredients
- Named meat sources (chicken, not "meat by-products")
- Limited fillers (corn, wheat, soy)
- Added vitamins and minerals
- Preservatives (natural preferred)

### Guaranteed Analysis
- Minimum protein percentage
- Maximum moisture, ash, and fiber
- Not the most important factor

### AAFCO Certification
- Ensures nutritional adequacy
- "Complete and balanced" for life stage
- Important quality indicator

## Feeding Guidelines

### Portion Control
- Based on age, size, and activity level
- Monitor weight regularly
- Adjust portions as needed
- Free-choice vs. measured feeding

### Feeding Schedule
- 2 meals per day for adults
- Consistent timing
- Fresh water always available
- Separate food and water bowls

### Treat Guidelines
- 10% or less of daily calories
- Healthy, cat-specific treats
- Training rewards
- Dental treats for oral health

## Homemade vs. Commercial Food

### Commercial Cat Food
**Advantages:**
- Balanced nutrition
- Added vitamins and minerals
- Convenient and consistent
- AAFCO certified

**Considerations:**
- Quality varies by brand
- Read labels carefully
- Cost-effective long-term

### Homemade Diets
**Advantages:**
- Control over ingredients
- Fresh food appeal
- Address specific allergies

**Challenges:**
- Difficult to balance nutrients
- Time-consuming
- Risk of deficiencies
- Requires veterinary supervision

## Supplements for Cats

### Essential Supplements
- Taurine (if not in food)
- Omega-3 fatty acids
- Probiotics for digestive health

### Optional Supplements
- Joint supplements (glucosamine)
- Hairball remedies
- Antioxidant supplements

## Common Feeding Mistakes

### Overfeeding
- Leads to obesity
- Joint problems
- Diabetes risk

### Inappropriate Foods
- Toxic foods (onions, garlic, chocolate)
- Human foods lacking nutrients
- Excessive dairy (lactose intolerance)

### Inconsistent Feeding
- Digestive upset
- Behavioral issues
- Nutritional imbalances

## Veterinary Consultation

Always consult your veterinarian for:
- Dietary changes
- Weight management plans
- Medical condition diets
- Homemade diet formulations
- Supplement recommendations

## Monitoring Health

### Regular Check-ups
- Annual wellness exams
- Weight monitoring
- Blood work for seniors
- Dental assessments

### Home Monitoring
- Body condition scoring
- Appetite and energy levels
- Coat and skin condition
- Litter box habits

Proper nutrition is the foundation of your cat's health. By understanding their unique dietary needs and providing balanced, species-appropriate food, you'll help ensure your feline companion lives a long, healthy life.`,
    category: "nutrition",
    tags: ["cats", "nutrition", "feeding", "health", "diet"],
    authorName: "Kavidhi Perera",
    images: [
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1200&h=700&fit=crop"
    ],
    isPublished: true,
    isFeatured: false,
    metaDescription: "Complete guide to cat nutrition, dietary requirements, and feeding guidelines for optimal feline health.",
    metaKeywords: ["cat nutrition", "feline diet", "cat food", "pet nutrition"]
  },
  {
    title: "Basic Dog Training: Building Obedience and Trust",
    content: `Training your dog is one of the most important investments you can make in your relationship. A well-trained dog is happier, safer, and more enjoyable to be around. This guide covers the fundamentals of dog training for new owners.

## Understanding Dog Psychology

### Pack Mentality
Dogs are social animals with a natural pack hierarchy. They look to their owners for leadership and guidance.

### Learning Principles
- **Positive Reinforcement:** Reward desired behaviors
- **Consistency:** Use the same commands and rules
- **Timing:** Reward immediately after correct behavior
- **Patience:** Learning takes time and repetition

## Essential Commands

### Sit
**Teaching Method:**
1. Hold a treat above your dog's nose
2. Slowly move it back over their head
3. As their head follows, their rear will lower
4. Say "Sit" as they sit
5. Reward immediately

**Practice:** 5-10 minutes, 2-3 times daily

### Stay
**Teaching Method:**
1. Ask your dog to sit
2. Open your palm toward them and say "Stay"
3. Take one step back
4. If they stay, reward and praise
5. Gradually increase distance and time

**Practice:** Build up slowly to avoid frustration

### Come
**Teaching Method:**
1. Put a leash on your dog
2. Get down to their level
3. Say their name followed by "Come"
4. Gently pull the leash if needed
5. Reward enthusiastically when they reach you

**Practice:** Start in a distraction-free environment

### Down
**Teaching Method:**
1. Ask your dog to sit
2. Hold a treat near the ground in front of them
3. Slowly move it away from them
4. As they follow, they'll lie down
5. Say "Down" and reward

**Practice:** Use when you want them to settle

### Leave It
**Teaching Method:**
1. Place a treat in your closed hand
2. Say "Leave it"
3. When they stop trying to get it, open your hand and reward with a different treat
4. Practice with increasingly tempting items

**Practice:** Essential for safety

## Training Tools and Methods

### Positive Reinforcement
- Treats, praise, play
- Builds trust and enthusiasm
- Most effective long-term method

### Clicker Training
- Use a clicker to mark desired behavior
- Follow immediately with reward
- Precise timing for clear communication

### Leash Training
- Proper leash manners
- Loose-leash walking
- Emergency stops

## Common Training Challenges

### Pulling on Leash
**Solution:**
- Stop walking when they pull
- Reward when leash is loose
- Use front-clip harness
- Practice in low-distraction areas

### Jumping on People
**Solution:**
- Turn away and ignore
- Reward calm greetings
- Teach "Sit" for greetings
- Consistent boundaries

### Chewing Inappropriate Items
**Solution:**
- Provide appropriate chew toys
- Supervise when necessary
- Use bitter sprays on forbidden items
- Positive reinforcement for correct chewing

### Barking Problems
**Solution:**
- Identify triggers
- Teach "Quiet" command
- Provide mental stimulation
- Address separation anxiety

## Age-Appropriate Training

### Puppies (8-16 weeks)
- Socialization is priority
- Short, fun sessions (5-10 minutes)
- Basic commands and house training
- Positive experiences with new situations

### Adolescent Dogs (6-18 months)
- Testing boundaries
- Increased energy and independence
- Consistent reinforcement needed
- Advanced training possible

### Adult Dogs
- Can learn at any age
- May have established habits
- Patience and consistency crucial
- Focus on refinement and new skills

## Training Tips for Success

### Create a Training Plan
- Set realistic goals
- Break down complex behaviors
- Track progress
- Adjust as needed

### Training Environment
- Start in quiet, familiar areas
- Gradually add distractions
- Keep sessions short and positive
- End on a successful note

### Timing and Consistency
- Train when dog is alert and focused
- Use commands consistently
- Same rules for all family members
- Practice regularly

### Health Considerations
- Ensure dog is healthy before training
- Consider age and physical limitations
- Consult vet for medical issues affecting behavior
- Adjust training for special needs

## Advanced Training Concepts

### Shaping
- Reward successive approximations
- Build complex behaviors gradually
- Useful for tricks and problem-solving

### Targeting
- Teach dog to touch objects with nose or paw
- Foundation for many advanced behaviors
- Useful for service dog training

### Loose-Leash Walking
- Ultimate goal for enjoyable walks
- Requires patience and consistency
- Use positive reinforcement
- Practice daily

## Training for Specific Situations

### Multi-Dog Households
- Train dogs separately initially
- Teach "Wait" and "Leave it"
- Manage resources fairly
- Provide individual attention

### Families with Children
- Teach children how to interact safely
- Supervise all interactions
- Teach "Gentle" and "Easy"
- Create safe spaces for dog

### Apartment Living
- Teach quiet commands
- Practice alone time
- Use puzzle toys for mental stimulation
- Respect neighbors' space

## Professional Training Options

### Group Classes
- Socialization opportunities
- Learn from professional trainers
- Practice in group setting
- Cost-effective option

### Private Lessons
- Individualized attention
- Address specific issues
- Faster progress for problem behaviors
- More expensive

### Online Resources
- Video tutorials
- Apps and programs
- Books and articles
- Self-paced learning

## Maintaining Training

### Ongoing Practice
- Regular review of learned commands
- Practice in new situations
- Reinforce with occasional rewards
- Keep training fun

### Problem Prevention
- Address issues early
- Provide mental stimulation
- Maintain consistent routine
- Regular exercise and play

### Building Trust
- Be reliable and consistent
- Use positive methods only
- Respect your dog's limitations
- Celebrate successes together

Remember, training is a lifelong process that strengthens the bond between you and your dog. Every dog can learn, but they all learn at their own pace. Be patient, consistent, and always prioritize your dog's well-being and happiness.`,
    category: "training",
    tags: ["dogs", "training", "obedience", "behavior", "commands"],
    authorName: "Chuliesha Perera",
    images: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&h=700&fit=crop"
    ],
    isPublished: true,
    isFeatured: false,
    metaDescription: "Essential dog training guide covering basic commands, behavior modification, and building a strong bond with your canine companion.",
    metaKeywords: ["dog training", "obedience", "pet behavior", "commands", "positive reinforcement"]
  }
];

// Connect to MongoDB and seed articles
async function seedArticles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find or create an admin user for articles
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.findOne({}); // Get any user if no admin exists
      if (!adminUser) {
        // Create a default admin user
        adminUser = new User({
          firebaseUid: 'seed-admin-user',
          email: 'admin@happytails.com',
          fullName: 'HappyTails Admin',
          role: 'admin',
        });
        await adminUser.save();
        console.log('Created default admin user');
      }
    }

    // Add author and slug to all sample articles
    const articlesWithAuthor = sampleArticles.map(article => ({
      ...article,
      author: adminUser._id,
      slug: article.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    }));

    // Check if articles already exist
    const existingArticles = await Article.countDocuments();
    if (existingArticles > 0) {
      console.log(`Found ${existingArticles} existing articles. Deleting and recreating with new content.`);

      // Delete existing articles
      await Article.deleteMany({});
      console.log('Deleted existing articles');
    }

    // Create articles with new content
    const createdArticles = await Article.insertMany(articlesWithAuthor);
    console.log(`Successfully created ${createdArticles.length} articles`);

    // Log created articles
    createdArticles.forEach(article => {
      console.log(`- ${article.title} (${article.category})`);
    });

  } catch (error) {
    console.error('Error seeding articles:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedArticles();