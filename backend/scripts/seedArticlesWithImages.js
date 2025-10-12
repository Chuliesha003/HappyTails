const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Article = require('../models/Article');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding articles');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// --- Data Pool for High-Quality Articles ---

const vetNames = [
  'Dr. Kamal Perera', 'Dr. Nisha Fernando', 'Dr. Lasantha Rajapaksa', 'Dr. Chaminda Wickramasinghe',
  'Dr. Ayesha Iqbal', 'Dr. Rohan Silva', 'Dr. Priya Jayawardena', 'Dr. Sanjeewa Fernando',
  'Dr. Kasun Wijeratne', 'Dr. Anjali de Silva', 'Dr. Malik Fernando', 'Dr. Samanthi Perera',
  'Dr. Pradeep Kumar', 'Dr. Rukshan Silva', 'Dr. Ishani Rodrigo', 'Dr. Nimal Fernando',
  'Dr. Sachintha Perera', 'Dr. Harsha Jayasinghe', 'Dr. Niluka Karunaratne', 'Dr. Vishantha Silva'
];

const categories = ['nutrition', 'diseases', 'training', 'grooming', 'behavior', 'general'];

const articleDataPool = {
  nutrition: [
    {
      title: 'Decoding Dog Food Labels: A Comprehensive Guide',
      image: 'backend/public/uploads/articles/nutrition-1.jpg',
      content: `Navigating the world of dog food can be confusing. This guide breaks down how to read labels, understand ingredient lists, and choose a diet that meets your dog's specific needs, from puppyhood to their senior years. We'll cover the importance of protein, fats, and carbohydrates, and explain what "grain-free" really means for your pet's health.`
    },
    {
      title: 'The Benefits of a Raw Food Diet for Cats',
      image: 'backend/public/uploads/articles/nutrition-2.jpg',
      content: `A raw food diet, often called BARF (Biologically Appropriate Raw Food), is gaining popularity among cat owners. This article explores the potential benefits, including improved digestion, a healthier coat, and increased energy. We also discuss the risks and necessary precautions to ensure a balanced and safe raw diet for your feline friend.`
    },
    {
      title: 'Hydration for Pets: How Much Water Do They Really Need?',
      image: 'backend/public/uploads/articles/nutrition-3.jpg',
      content: `Water is vital for your pet's health, but how much is enough? Learn how to monitor your pet's water intake, recognize signs of dehydration, and encourage them to drink more. We'll cover factors like age, activity level, and diet that influence their hydration needs.`
    },
    {
      title: 'Homemade vs. Store-Bought: A Look at Pet Treats',
      image: 'backend/public/uploads/articles/nutrition-4.jpg',
      content: `Treats are a great tool for training and bonding, but not all treats are created equal. This article compares the pros and cons of homemade and store-bought treats, offering simple recipes for healthy, homemade snacks and tips for choosing the best commercial options.`
    },
    {
      title: 'Understanding Feline Nutritional Needs',
      image: 'backend/public/uploads/articles/nutrition-5.jpg',
      content: `Cats are obligate carnivores with unique dietary requirements. This guide covers the essentials of feline nutrition, including the critical role of taurine, why cats need high-protein diets, and the debate between wet vs. dry food. Ensure your cat is getting the right nutrients to thrive.`
    },
    {
      title: 'Weight Management for Dogs: Tips for a Healthy Life',
      image: 'backend/public/uploads/articles/nutrition-6.jpg',
      content: `Obesity is a common but preventable problem in dogs. Learn how to assess your dog's body condition, calculate their ideal daily calorie intake, and implement a safe and effective weight loss plan. We provide tips on exercise, portion control, and choosing the right low-calorie food.`
    },
    {
      title: 'The Importance of Omega Fatty Acids for Pets',
      image: 'backend/public/uploads/articles/nutrition-7.jpg',
      content: `Omega-3 and Omega-6 fatty acids are crucial for your pet's skin, coat, joint health, and cognitive function. This article explains the benefits of these essential fats, the best food sources (like fish oil), and how to choose the right supplement for your dog or cat.`
    },
    {
      title: 'Toxic Foods: What Not to Feed Your Pet',
      image: 'backend/public/uploads/articles/nutrition-8.jpg',
      content: `Many common human foods can be dangerous for pets. This essential guide lists the most toxic foods for dogs and cats, including chocolate, grapes, onions, and xylitol. Learn to recognize the signs of poisoning and what to do in an emergency.`
    }
  ],
  diseases: [
    {
      title: 'Recognizing the Early Signs of Kidney Disease in Cats',
      image: 'backend/public/uploads/articles/diseases-1.jpg',
      content: `Chronic kidney disease is a common ailment in older cats. Early detection is key to managing the condition and improving your cat's quality of life. This article details the subtle early signs, such as increased thirst and urination, weight loss, and decreased appetite, and explains the importance of regular vet check-ups.`
    },
    {
      title: 'Canine Arthritis: Management and Pain Relief',
      image: 'backend/public/uploads/articles/diseases-2.jpg',
      content: `Arthritis can significantly impact a dog's mobility and comfort. Learn to spot the signs of joint pain and explore the various management options available, from weight management and physical therapy to medications and supplements like glucosamine. Help your senior dog stay active and comfortable.`
    },
    {
      title: 'Understanding and Preventing Pet Diabetes',
      image: 'backend/public/uploads/articles/diseases-3.jpg',
      content: `Diabetes is becoming more common in both dogs and cats. This guide explains the causes, symptoms, and treatment of pet diabetes. Learn about the role of diet, exercise, and insulin therapy in managing the disease and how you can help prevent it in your pet.`
    },
    {
      title: 'Dealing with Fleas and Ticks: A Pet Owner’s Guide',
      image: 'backend/public/uploads/articles/diseases-4.jpg',
      content: `Fleas and ticks are more than just a nuisance; they can transmit serious diseases. This article covers the best methods for prevention and treatment, comparing spot-on treatments, oral medications, and collars. Learn how to check your pet for parasites and keep your home pest-free.`
    },
    {
      title: 'Common Skin Problems in Dogs and How to Treat Them',
      image: 'backend/public/uploads/articles/diseases-5.jpg',
      content: `From allergies and hot spots to infections and parasites, skin issues are a frequent reason for vet visits. This guide helps you identify common skin problems in dogs, understand their underlying causes, and learn about effective treatments to provide your pet with much-needed relief.`
    },
    {
      title: 'Feline Lower Urinary Tract Disease (FLUTD)',
      image: 'backend/public/uploads/articles/diseases-6.jpg',
      content: `FLUTD is a term for a range of problems affecting a cat's bladder and urethra. Symptoms can include straining to urinate, blood in the urine, and urinating outside the litter box. This article explores the causes, diagnosis, and management strategies, emphasizing the importance of diet and stress reduction.`
    },
    {
      title: 'Dental Health for Pets: More Than Just Bad Breath',
      image: 'backend/public/uploads/articles/diseases-7.jpg',
      content: `Dental disease is incredibly common in pets and can lead to serious health issues. Learn why professional cleanings are important, how to brush your pet's teeth at home, and what dental chews and toys can help maintain good oral hygiene between vet visits.`
    },
    {
      title: 'Kennel Cough in Dogs: Symptoms, Treatment, and Prevention',
      image: 'backend/public/uploads/articles/diseases-8.jpg',
      content: `Kennel cough is a highly contagious respiratory infection. This guide covers its characteristic hacking cough, other symptoms, and typical treatment protocols. We also discuss the Bordetella vaccine and how you can protect your dog, especially if they frequent social settings like dog parks or boarding kennels.`
    }
  ],
  training: [
    {
      title: 'Puppy Socialization: The Key to a Well-Adjusted Dog',
      image: 'backend/public/uploads/articles/training-1.jpg',
      content: `Proper socialization during the critical window of 3 to 16 weeks of age is crucial for raising a confident, well-behaved dog. Learn how to safely expose your puppy to new sights, sounds, people, and other dogs to prevent fear and aggression later in life.`
    },
    {
      title: 'Positive Reinforcement: The Science of Dog Training',
      image: 'backend/public/uploads/articles/training-2.jpg',
      content: `Positive reinforcement is a humane and effective training method based on rewarding good behavior. This article explains the science behind it and provides practical tips for using treats, praise, and toys to teach your dog basic commands and complex tricks.`
    },
    {
      title: 'Crate Training Your Dog: A Step-by-Step Guide',
      image: 'backend/public/uploads/articles/training-3.jpg',
      content: `Crate training can provide your dog with a safe, personal space and assist with house training. This guide offers a step-by-step approach to introducing the crate positively, helping your dog see it as a den rather than a punishment.`
    },
    {
      title: 'Solving the Top 5 Cat Behavior Problems',
      image: 'backend/public/uploads/articles/training-4.jpg',
      content: `From scratching furniture to avoiding the litter box, cat behavior can be baffling. This article tackles the five most common issues, explaining the feline motivations behind them and offering practical, humane solutions to restore harmony in your home.`
    },
    {
      title: 'Leash Training: How to Enjoy Walks with Your Dog',
      image: 'backend/public/uploads/articles/training-5.jpg',
      content: `Is your dog pulling on the leash? This guide provides techniques for teaching loose-leash walking, making your daily walks more enjoyable for both of you. We cover equipment choices, training exercises, and how to handle distractions.`
    },
    {
      title: 'Clicker Training for Cats: Is It Possible?',
      image: 'backend/public/uploads/articles/training-6.jpg',
      content: `Yes, you can train a cat! Clicker training is a fun and engaging way to teach your cat tricks, from 'sit' and 'high-five' to more complex behaviors. Learn the basics of this positive reinforcement method and strengthen your bond with your feline friend.`
    },
    {
      title: 'House Training Your New Puppy: A Survival Guide',
      image: 'backend/public/uploads/articles/training-7.jpg',
      content: `Bringing a new puppy home is exciting, but house training can be a challenge. This survival guide offers a consistent and positive approach, covering crate training, establishing a routine, and handling accidents gracefully. Set your puppy up for success from day one.`
    },
    {
      title: 'The Importance of Mental Stimulation for Dogs',
      image: 'backend/public/uploads/articles/training-8.jpg',
      content: `A tired dog is a happy dog, but physical exercise is only half the story. Mental stimulation is vital for preventing boredom and destructive behaviors. Discover fun ways to challenge your dog's brain with puzzle toys, nose work, and learning new tricks.`
    }
  ],
  grooming: [
    {
      title: 'Brushing Your Dog: Tools and Techniques for a Healthy Coat',
      image: 'backend/public/uploads/articles/grooming-1.jpg',
      content: `Regular brushing is essential for removing loose hair, preventing mats, and distributing natural oils. This guide helps you choose the right brush for your dog's coat type and provides techniques for making grooming a positive experience for your pet.`
    },
    {
      title: 'A Guide to Cat Grooming: Do They Really Need Our Help?',
      image: 'backend/public/uploads/articles/grooming-2.jpg',
      content: `While cats are meticulous groomers, they can sometimes use a helping hand, especially long-haired breeds. Learn when and how to brush your cat, trim their nails, and even bathe them (if necessary), all while minimizing stress.`
    },
    {
      title: 'Nail Trimming for Pets: A How-To Guide',
      image: 'backend/public/uploads/articles/grooming-3.jpg',
      content: `Nail trimming is a dreaded task for many pet owners, but it's crucial for your pet's comfort and health. This guide provides step-by-step instructions for trimming your dog's or cat's nails safely, including how to avoid the quick and what to do if you accidentally cut it.`
    },
    {
      title: 'Bathing Your Dog: How Often and With What?',
      image: 'backend/public/uploads/articles/grooming-4.jpg',
      content: `How often should you bathe your dog? The answer depends on their breed, lifestyle, and skin condition. This article covers bathing frequency, choosing the right pet-safe shampoo, and tips for making bath time a less stressful event for everyone involved.`
    },
    {
      title: 'Dealing with Shedding: Tips for a Cleaner Home',
      image: 'backend/public/uploads/articles/grooming-5.jpg',
      content: `Shedding is a natural process, but it can be a major headache for pet owners. Learn effective strategies for managing shedding, including diet improvements, regular grooming, and the best tools for removing pet hair from your home and clothes.`
    },
    {
      title: 'The Professional Groomer: When and Why to Go',
      image: 'backend/public/uploads/articles/grooming-6.jpg',
      content: `While basic grooming can be done at home, some breeds and situations require a professional touch. This article explains the benefits of professional grooming, what services to expect, and how to choose a qualified and reputable groomer for your pet.`
    },
    {
      title: 'Ear Cleaning for Dogs: A Step-by-Step Guide',
      image: 'backend/public/uploads/articles/grooming-7.jpg',
      content: `Regular ear cleaning is vital for preventing infections, especially in dogs with floppy ears. This guide provides safe, step-by-step instructions on how to clean your dog's ears, what solutions to use, and how to recognize signs of an ear infection that requires a vet visit.`
    },
    {
      title: 'Winter Grooming: Protecting Your Pet from the Cold',
      image: 'backend/public/uploads/articles/grooming-8.jpg',
      content: `Cold weather brings unique grooming challenges. Learn how to protect your pet's paws from ice and salt, manage a winter coat, and adjust their bathing schedule to prevent dry, itchy skin during the colder months.`
    }
  ],
  behavior: [
    {
      title: 'Understanding and Managing Separation Anxiety in Dogs',
      image: 'backend/public/uploads/articles/behavior-1.jpg',
      content: `Separation anxiety can be distressing for both dogs and their owners. This article helps you identify the signs of true separation anxiety versus boredom, and outlines strategies for managing the behavior, including desensitization exercises and creating a safe space.`
    },
    {
      title: 'Why Do Cats Purr? The Surprising Science',
      image: 'backend/public/uploads/articles/behavior-2.jpg',
      content: `Purring is most often associated with contentment, but cats also purr when they are stressed or in pain. This article delves into the fascinating science of the feline purr, exploring its role in communication, self-soothing, and even healing.`
    },
    {
      title: 'Decoding Dog Body Language: What Is Your Dog Saying?',
      image: 'backend/public/uploads/articles/behavior-3.jpg',
      content: `From tail wags to ear position, your dog is constantly communicating with you. This guide to canine body language will help you understand what your dog is feeling, whether it's happiness, fear, or anxiety, leading to a stronger bond and safer interactions.`
    },
    {
      title: 'Destructive Chewing in Dogs: How to Stop It',
      image: 'backend/public/uploads/articles/behavior-4.jpg',
      content: `Destructive chewing is a common and frustrating behavior. This article explores the reasons behind it, from puppy teething to adult boredom, and provides effective solutions, including management, providing appropriate chew toys, and increasing exercise.`
    },
    {
      title: 'Litter Box Issues: Thinking Outside the Box',
      image: 'backend/public/uploads/articles/behavior-5.jpg',
      content: `When a cat stops using the litter box, it's a sign that something is wrong. This guide helps you troubleshoot the problem, covering potential medical issues, stress-related causes, and problems with the litter box setup itself. Get your cat back to good habits.`
    },
    {
      title: 'Aggression in Dogs: Types, Causes, and Management',
      image: 'backend/public/uploads/articles/behavior-6.jpg',
      content: `Dealing with an aggressive dog can be frightening. This article provides an overview of the different types of aggression (such as fear-based, territorial, and resource guarding), their common triggers, and the first steps in managing and seeking professional help for this serious issue.`
    },
    {
      title: 'The Reasons Behind Your Cat’s Kneading Behavior',
      image: 'backend/public/uploads/articles/behavior-7.jpg',
      content: `Often called "making biscuits," kneading is an instinctive cat behavior. This article explores the origins of this comforting action, from kittenhood instincts to marking territory. Understand why your cat kneads and what it means about your relationship.`
    },
    {
      title: 'How to Introduce a New Pet to Your Resident Pet',
      image: 'backend/public/uploads/articles/behavior-8.jpg',
      content: `A slow, gradual introduction is key to fostering a peaceful multi-pet household. This guide provides step-by-step instructions for introducing a new dog or cat to your existing pets, helping to prevent conflict and build positive associations from the start.`
    }
  ],
  general: [
    {
      title: 'Choosing the Right Pet for Your Lifestyle',
      image: 'backend/public/uploads/articles/general-1.jpg',
      content: `Bringing a pet into your life is a major commitment. This article guides you through the process of choosing a pet that fits your lifestyle, considering factors like your living space, activity level, budget, and the amount of time you can dedicate to a new companion.`
    },
    {
      title: 'Pet-Proofing Your Home: A Checklist',
      image: 'backend/public/uploads/articles/general-2.jpg',
      content: `Keep your new dog or cat safe by pet-proofing your home. This checklist covers common household hazards, from toxic plants and cleaning supplies to electrical cords and small objects that could be swallowed. Create a safe environment for your curious companion.`
    },
    {
      title: 'The Cost of Owning a Pet: A Financial Guide',
      image: 'backend/public/uploads/articles/general-3.jpg',
      content: `Beyond the adoption fee, owning a pet involves ongoing costs. This guide breaks down the expected expenses of pet ownership, including food, vet care, grooming, training, and emergency funds, helping you budget responsibly for your furry family member.`
    },
    {
      title: 'Traveling with Your Pet: Tips for a Safe Journey',
      image: 'backend/public/uploads/articles/general-4.jpg',
      content: `Whether you're traveling by car or plane, preparation is key to a smooth journey with your pet. This article provides tips on everything from choosing the right carrier and managing anxiety to packing essentials and understanding airline regulations.`
    },
    {
      title: 'Adopting a Senior Pet: Why It’s a Great Idea',
      image: 'backend/public/uploads/articles/general-5.jpg',
      content: `Puppies and kittens are cute, but senior pets have so much to offer. This article highlights the many benefits of adopting an older animal, such as their calmer demeanor, established personalities, and the profound gratitude they show for a second chance at a loving home.`
    },
    {
      title: 'Pet Insurance: Is It Worth It?',
      image: 'backend/public/uploads/articles/general-6.jpg',
      content: `Veterinary bills can be expensive and unexpected. Pet insurance can provide peace of mind, but is it the right choice for you? This guide explains how pet insurance works, what it typically covers, and the factors to consider when choosing a plan.`
    },
    {
      title: 'How to Help Your Pet in a Natural Disaster',
      image: 'backend/public/uploads/articles/general-7.jpg',
      content: `When preparing for an emergency, don't forget your pets. This guide outlines how to create a pet emergency kit, what to do if you need to evacuate, and how to keep your pet safe and calm during a natural disaster.`
    },
    {
      title: 'Saying Goodbye: Coping with the Loss of a Pet',
      image: 'backend/public/uploads/articles/general-8.jpg',
      content: `The loss of a beloved pet is a heartbreaking experience. This article offers guidance on navigating the grieving process, honoring your pet's memory, and finding support during this difficult time. It's okay to grieve, and you are not alone.`
    }
  ]
};

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seed = async () => {
  try {
    await connectDB();

    console.log('Creating vet users (authors)...');
    const createdAuthors = [];
    for (const name of vetNames) {
      const emailSafe = name.toLowerCase().replace(/[^a-z0-9]+/g, '.') + '@happytails.lk';
      const user = await User.findOneAndUpdate(
        { email: emailSafe },
        { firebaseUid: `seed-${emailSafe}`, email: emailSafe, fullName: name, role: 'vet' },
        { upsert: true, new: true }
      );
      createdAuthors.push(user);
    }
    console.log(`✅ ${createdAuthors.length} author users are ready.`);

    console.log('\n--- Starting Article Seeding ---');
    console.log('🔥 Deleting all existing articles...');
    const deleteResult = await Article.deleteMany({});
    console.log(`🔥 ${deleteResult.deletedCount} articles deleted.`);

    let totalCreated = 0;
    for (const category of categories) {
      const articlesToCreate = articleDataPool[category];
      console.log(`\nProcessing category: ${category.toUpperCase()}`);

      if (!articlesToCreate || articlesToCreate.length === 0) {
        console.log(`- No articles defined for ${category}. Skipping.`);
        continue;
      }

      for (let i = 0; i < 8; i++) {
        const articleDetail = articlesToCreate[i];
        if (!articleDetail) {
          console.warn(`- Warning: Missing article definition for ${category} at index ${i}.`);
          continue;
        }

        const author = randomItem(createdAuthors);
        const { title, content } = articleDetail;
        // Normalize image path: allow absolute web paths, http(s) URLs, or filesystem paths
        let image = articleDetail.image || '';
        if (image && !/^https?:\/\//i.test(image) && !image.startsWith('/')) {
          // Convert backslashes to forward slashes, strip leading backend/public if present
          image = image.replace(/\\\\/g, '/').replace(/\\/g, '/');
          image = image.replace(/^\.?\/*backend\/public/, '');
          if (!image.startsWith('/')) image = '/' + image;
        }

        const newArticle = new Article({
          title,
          content,
          category,
          author: author._id,
          authorName: author.fullName,
          imageUrl: image,
          images: [image], // Using the same image for both fields for simplicity
          isPublished: true,
          tags: [category, 'pet care', 'sri lanka'],
          metaDescription: content.substring(0, 156) + '...',
        });

        await newArticle.save();
        console.log(`✅ Created: "${title}"`);
        totalCreated++;
      }
    }

    console.log(`\n--- Seeding Complete ---`);
    console.log(`✅ Successfully created ${totalCreated} new articles.`);
    process.exit(0);
  } catch (err) {
    console.error('\n❌ An error occurred during seeding:', err);
    process.exit(1);
  }
};

seed();
