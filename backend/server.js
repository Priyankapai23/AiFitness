import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- AI-Powered Fitness Plan Generator ---
app.post("/generate-plan", async (req, res) => {
  const { name, age, gender, height, weight, goal, level, location, diet } = req.body;

  // Advanced fitness calculations
  const heightM = height / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(1);
  const bmr = gender === 'male' 
    ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  
  const activityFactors = {
    'beginner': 1.375,
    'intermediate': 1.55,
    'advanced': 1.725
  };
  
  const goalAdjustments = {
    'weight loss': -500,
    'muscle gain': +300,
    'maintenance': 0,
    'strength': +200,
    'endurance': +100
  };
  
  const baseCals = Math.round(bmr * (activityFactors[level] || 1.4));
  const dailyCalories = baseCals + (goalAdjustments[goal.toLowerCase()] || 0);

  const systemPrompt = `You are an elite AI fitness coach with expertise in:
- Exercise physiology and biomechanics
- Sports nutrition and meal planning
- Behavioral psychology and motivation
- Injury prevention and recovery

Your responses are NEVER generic. Every plan is uniquely crafted based on the individual's profile, goals, and circumstances.`;

  const userPrompt = `
🤖 ADVANCED AI FITNESS COACH - PERSONALIZED PLAN GENERATION

👤 CLIENT PROFILE ANALYSIS:
• Name: ${name} (${age} years old, ${gender})
• Physical Stats: ${height}cm, ${weight}kg (BMI: ${bmi})
• Primary Goal: ${goal}
• Experience Level: ${level}
• Training Location: ${location}
• Dietary Preference: ${diet}
• Calculated Daily Calories: ${dailyCalories}

🎯 ADVANCED PROMPT ENGINEERING REQUIREMENTS:

1. 📅 MANDATORY 7-DAY WORKOUT SCHEDULE (EXACTLY 7 DAYS REQUIRED):
   - MUST include all 7 days (Day 1 through Day 7)
   - Day 7 can be rest/recovery but MUST be included
   - Each day must have specific exercises and duration
   - Include warm-up and cool-down for each day
   - Specify exact exercises with sets, reps, rest periods

2. 🍽️ COMPREHENSIVE MEAL PLAN WITH TIMING:
   - Exact meal timing (e.g., "7:30 AM Breakfast")
   - Precise portions with macronutrient breakdown
   - Pre/post workout nutrition timing
   - Hydration schedule throughout the day
   - Weekly meal prep suggestions

3. 🧠 PERSONALIZED LIFESTYLE INTEGRATION:
   - Work schedule considerations
   - Sleep optimization based on workout timing
   - Stress management techniques
   - Posture corrections for their lifestyle

4. 💪 MOTIVATIONAL PSYCHOLOGY:
   - Goal-specific affirmations
   - Progress tracking methods
   - Habit formation strategies

📋 ENHANCED JSON RESPONSE FORMAT:
{
  "meta": {
    "estimatedCalories": ${dailyCalories},
    "bmi": "${bmi}",
    "fitnessLevel": "${level}",
    "primaryGoal": "${goal}",
    "planDuration": "4 weeks",
    "weeklyProgression": "Increase intensity by 10% each week"
  },
  "workoutDays": [
    {
      "day": "Day 1 - Upper Body Power",
      "timeSlot": "6:00 AM - 7:15 AM",
      "focus": "Chest, Shoulders, Triceps",
      "warmUp": "5 min dynamic stretching + arm circles",
      "exercises": [
        "Push-ups - 3 sets x 12 reps (60s rest) - Week 1: bodyweight, Week 2: add 5kg vest",
        "Dumbbell Chest Press - 4 sets x 8-10 reps (90s rest) - Start 15kg, progress +2.5kg weekly",
        "Pike Push-ups - 3 sets x 8 reps (45s rest) - Focus on shoulder engagement",
        "Tricep Dips - 3 sets x 10 reps (60s rest) - Use chair/bench"
      ],
      "coolDown": "10 min upper body stretching + deep breathing",
      "duration": "75 minutes",
      "intensity": "High (RPE 7-8)",
      "notes": "Focus on controlled movements. If no dumbbells, use water bottles or resistance bands",
      "alternatives": ["Resistance band chest press", "Wall push-ups for beginners"]
    }
  ],
  "mealPlan": {
    "schedule": {
      "6:00 AM": "Wake up + 500ml water with lemon",
      "7:30 AM": "Post-workout breakfast",
      "10:30 AM": "Mid-morning snack",
      "1:00 PM": "Lunch",
      "4:00 PM": "Pre-workout snack (if evening workout)",
      "7:30 PM": "Dinner",
      "9:30 PM": "Optional light snack"
    },
    "breakfast": {
      "time": "7:30 AM (Post-workout)",
      "meals": [
        "Oatmeal (80g dry) with banana (1 medium) and almonds (15g) - 420 cal, 15g protein",
        "Greek yogurt (150g) with mixed berries (100g) - 180 cal, 15g protein",
        "Green tea or black coffee (no sugar) - 0 cal"
      ],
      "macros": "600 cal | 30g protein | 75g carbs | 18g fat",
      "timing": "Within 30 minutes post-workout for optimal recovery"
    },
    "lunch": {
      "time": "1:00 PM",
      "meals": [
        "Grilled chicken breast (150g) seasoned with herbs - 250 cal, 45g protein",
        "Brown rice (100g cooked) or quinoa - 220 cal, 5g protein",
        "Mixed vegetables (200g) steamed with olive oil (1 tsp) - 120 cal, 3g protein"
      ],
      "macros": "590 cal | 53g protein | 45g carbs | 12g fat"
    },
    "dinner": {
      "time": "7:30 PM",
      "meals": [
        "Baked salmon (120g) with lemon and dill - 280 cal, 35g protein",
        "Sweet potato (150g) roasted - 130 cal, 2g protein",
        "Steamed broccoli (150g) with garlic - 50 cal, 4g protein"
      ],
      "macros": "460 cal | 41g protein | 35g carbs | 15g fat"
    },
    "snacks": [
      "10:30 AM: Apple (1 medium) with almond butter (1 tbsp) - 190 cal",
      "4:00 PM: Protein shake (30g whey + 250ml water) - 120 cal, 25g protein",
      "9:30 PM: Greek yogurt (100g) with honey (1 tsp) - 120 cal"
    ],
    "hydration": "3-4 liters water daily. 500ml upon waking, 250ml every hour, 500ml pre/post workout",
    "mealPrep": "Sunday: Cook chicken, rice, and roast vegetables for 3 days. Prepare overnight oats."
  },
  "tips": [
    "🕐 Schedule workouts at the same time daily to build habit consistency",
    "💻 Set hourly posture reminders: shoulders back, core engaged, feet flat on floor",
    "💧 Drink 500ml water immediately upon waking to boost metabolism by 30%",
    "😴 Sleep 7-9 hours with room temperature at 65-68°F for optimal recovery",
    "📱 Use the 20-20-20 rule: Every 20 min, look at something 20 feet away for 20 seconds"
  ],
  "motivation": [
    "${name}, your ${goal} journey starts with today's choices - make them count! 💪",
    "At ${level} level, you're already ahead of 80% of people - time to join the top 10%! 🚀",
    "Every workout is a deposit in your future self's health bank account 💰",
    "Consistency beats perfection - show up even when motivation is low 🔥",
    "Your body can do it. It's your mind you need to convince! 🧠"
  ],
  "progressTracking": {
    "weekly": "Take progress photos, measure weight, track workout performance",
    "daily": "Rate energy levels 1-10, track sleep hours, note mood changes",
    "monthly": "Reassess goals, adjust calorie intake, update workout intensity"
  }
}

🎯 CRITICAL INSTRUCTIONS:
- Make every detail specific to ${name}'s profile (${age}yo ${gender}, ${goal}, ${level})
- Consider their ${location} for equipment availability
- Adapt to ${diet} preferences in all meal suggestions
- NO generic templates - every element must be personalized
- Include scientific reasoning for recommendations
- Provide practical alternatives for common obstacles

Generate a completely unique, science-based plan that ${name} can realistically follow.`;

  try {
    const response = await openai.chat.completions.create({
  model: "gpt-4o-mini", // ✅ updated model
  messages: [
    { role: "system", content: "You are a fitness AI assistant." },
    { role: "user", content: userPrompt },
  ],
});

    
    let planContent = response.choices[0]?.message?.content;
    
    if (!planContent) {
      throw new Error('No content received from AI');
    }
    
    // Clean JSON response
    planContent = planContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const parsedPlan = JSON.parse(planContent);
      res.json({ plan: JSON.stringify(parsedPlan) });
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      res.json({ plan: planContent });
    }
  } catch (error) {
    console.error('AI Plan Generation Error:', error);
    
    // Fallback plan when AI fails
    const fallbackPlan = {
      "meta": {
        "estimatedCalories": dailyCalories,
        "bmi": bmi,
        "fitnessLevel": level,
        "primaryGoal": goal,
        "planDuration": "4 weeks"
      },
      "workoutDays": [
        {
          "day": "Day 1 - Upper Body",
          "focus": "Chest, Shoulders, Arms",
          "exercises": [
            "Push-ups - 3 sets x 10-15 reps",
            "Shoulder Press - 3 sets x 12 reps",
            "Tricep Dips - 3 sets x 8-12 reps",
            "Plank - 3 sets x 30-60 seconds"
          ],
          "duration": "45 minutes",
          "intensity": "Moderate",
          "notes": "Focus on proper form over speed"
        },
        {
          "day": "Day 2 - Lower Body",
          "focus": "Legs, Glutes, Core",
          "exercises": [
            "Squats - 3 sets x 15-20 reps",
            "Lunges - 3 sets x 12 reps each leg",
            "Glute Bridges - 3 sets x 15 reps",
            "Calf Raises - 3 sets x 20 reps"
          ],
          "duration": "40 minutes",
          "intensity": "Moderate",
          "notes": "Keep your core engaged throughout"
        },
        {
          "day": "Day 3 - Cardio & Core",
          "focus": "Cardiovascular Health, Core Strength",
          "exercises": [
            "Jumping Jacks - 3 sets x 30 seconds",
            "Mountain Climbers - 3 sets x 20 reps",
            "Bicycle Crunches - 3 sets x 20 reps",
            "Burpees - 3 sets x 8-10 reps"
          ],
          "duration": "35 minutes",
          "intensity": "High",
          "notes": "Take 60-90 second breaks between sets"
        }
      ],
      "mealPlan": {
        "breakfast": [
          "Oatmeal with banana and almonds (350 cal)",
          "Greek yogurt with berries (200 cal)",
          "Scrambled eggs with spinach (250 cal)"
        ],
        "lunch": [
          "Grilled chicken with quinoa and vegetables (450 cal)",
          "Salmon salad with mixed greens (400 cal)",
          "Turkey wrap with whole wheat tortilla (380 cal)"
        ],
        "dinner": [
          "Baked fish with sweet potato and broccoli (420 cal)",
          "Lean beef stir-fry with brown rice (480 cal)",
          "Vegetarian chili with beans (350 cal)"
        ],
        "snacks": [
          "Apple with almond butter (180 cal)",
          "Protein smoothie (200 cal)",
          "Mixed nuts and dried fruit (150 cal)"
        ]
      },
      "tips": [
        "Stay hydrated - drink at least 8 glasses of water daily",
        "Get 7-9 hours of quality sleep for optimal recovery",
        "Take progress photos weekly to track your transformation",
        "Listen to your body and rest when needed",
        "Consistency is more important than perfection"
      ],
      "motivation": [
        `${name}, every workout brings you closer to your ${goal} goal!`,
        "Your future self will thank you for the effort you put in today",
        "Progress, not perfection - every step counts!",
        "You're stronger than you think - keep pushing forward!"
      ]
    };
    
    res.json({ plan: JSON.stringify(fallbackPlan) });
  }
});

// --- AI Image Endpoint ---
app.post("/generate-image", async (req, res) => {
  const { text } = req.body;

  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      // Fallback to placeholder image
      const cleanText = text.replace(/[^a-zA-Z]/g, '').toLowerCase();
      const fallbackUrl = `https://picsum.photos/400/300?random=${cleanText}`;
      res.json({ url: fallbackUrl });
      return;
    }

    const image = await openai.images.generate({
      model: "dall-e-2",
      prompt: `High-quality realistic photo of ${text}`,
      size: "512x512",
    });

    res.json({ url: image.data[0].url });
  } catch (err) {
    // Fallback on any error
    const cleanText = text.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const fallbackUrl = `https://picsum.photos/400/300?random=${cleanText}`;
    res.json({ url: fallbackUrl });
  }
});

// --- Exercise and Meal Image Endpoints (Fallback only) ---
app.post("/generate-exercise-image", async (req, res) => {
  const { exerciseName } = req.body;
  // Direct fallback to Unsplash
  const fallbackUrl = `https://source.unsplash.com/512x512/?${encodeURIComponent(exerciseName + ' exercise fitness')}`;
  res.json({ image: fallbackUrl });
});

app.post("/generate-meal-image", async (req, res) => {
  const { mealName } = req.body;
  // Direct fallback to Unsplash
  const fallbackUrl = `https://source.unsplash.com/512x512/?${encodeURIComponent(mealName + ' food healthy')}`;
  res.json({ image: fallbackUrl });
});

// --- Advanced Text-to-Speech with ElevenLabs Integration ---
app.post("/generate-speech", async (req, res) => {
  const { text, voice = 'alloy', section = 'all', speed = 1.0 } = req.body;
  
  try {
    // Enhanced TTS with better voice quality
    const mp3 = await openai.audio.speech.create({
      model: "tts-1-hd", // Higher quality model
      voice: voice,
      input: text,
      speed: speed
    });
    
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length,
      'Cache-Control': 'no-cache'
    });
    
    res.send(buffer);
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ error: 'Speech generation failed' });
  }
});

// --- Section-Specific Speech Generation ---
app.post("/read-section", async (req, res) => {
  const { plan, section, voice = 'alloy' } = req.body;
  
  let parsedPlan;
  try {
    parsedPlan = JSON.parse(plan);
  } catch {
    return res.status(400).json({ error: 'Invalid plan format' });
  }
  
  let textToSpeak = '';
  
  switch(section) {
    case 'workout':
      textToSpeak = `Here's your personalized workout plan. `;
      parsedPlan.workoutDays?.forEach((day, index) => {
        textToSpeak += `${day.day}: ${day.focus || ''}. `;
        textToSpeak += `Exercises include: ${day.exercises?.slice(0, 3).join(', ')}. `;
        textToSpeak += `Duration: ${day.duration}. Intensity: ${day.intensity}. `;
        if (day.notes) textToSpeak += `Note: ${day.notes}. `;
      });
      break;
      
    case 'diet':
      textToSpeak = `Here's your personalized nutrition plan. `;
      Object.entries(parsedPlan.mealPlan || {}).forEach(([meal, items]) => {
        textToSpeak += `For ${meal}: ${items.join(', ')}. `;
      });
      textToSpeak += `Your daily calorie target is ${parsedPlan.meta?.estimatedCalories} calories. `;
      break;
      
    case 'tips':
      textToSpeak = `Here are your personalized lifestyle and posture tips: `;
      textToSpeak += parsedPlan.tips?.join('. ') + '. ';
      break;
      
    case 'motivation':
      textToSpeak = `Here's your daily motivation: `;
      textToSpeak += parsedPlan.motivation?.join('. ') + '. ';
      break;
      
    default:
      textToSpeak = `Here's your complete AI-generated fitness plan. `;
      textToSpeak += `Workout: ${parsedPlan.workoutDays?.length} days of training. `;
      textToSpeak += `Nutrition: Balanced meals totaling ${parsedPlan.meta?.estimatedCalories} calories daily. `;
      textToSpeak += `Plus personalized tips and motivation for your ${parsedPlan.meta?.primaryGoal} goal.`;
  }
  
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1-hd",
      voice: voice,
      input: textToSpeak,
      speed: 0.9
    });
    
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length
    });
    
    res.send(buffer);
  } catch (error) {
    console.error('Section TTS Error:', error);
    res.status(500).json({ error: 'Failed to generate speech for section' });
  }
});

// --- Dynamic AI Motivation Generator ---
app.post("/generate-motivation", async (req, res) => {
  const { goal, name, currentDay, level, mood = 'neutral' } = req.body;
  
  const motivationPrompts = {
    morning: `Generate an energizing morning motivation for ${name} starting their ${goal} journey. Day ${currentDay}. Make it powerful and action-oriented. 30 words max.`,
    workout: `Create a pre-workout pump-up message for ${name} (${level} level) focused on ${goal}. Make it intense and confidence-building. 25 words max.`,
    rest: `Write a recovery day motivation for ${name} working towards ${goal}. Emphasize the importance of rest. Calm but encouraging. 30 words max.`,
    progress: `Celebrate ${name}'s progress on day ${currentDay} of their ${goal} journey. Acknowledge their dedication and future potential. 35 words max.`
  };
  
  const promptType = req.body.type || 'morning';
  const selectedPrompt = motivationPrompts[promptType] || motivationPrompts.morning;
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are a world-class motivational fitness coach. Your words ignite passion, build confidence, and drive action. Every message is unique and personally crafted." 
        },
        { role: "user", content: selectedPrompt }
      ],
      temperature: 0.9,
      max_tokens: 80,
      presence_penalty: 0.8
    });
    
    res.json({ 
      motivation: response.choices[0].message.content.replace(/"/g, ''),
      type: promptType,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Motivation Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate motivation' });
  }
});

// --- AI Tips Generator ---
app.post("/generate-tips", async (req, res) => {
  const { goal, level, focus = 'lifestyle' } = req.body;
  
  const tipPrompts = {
    posture: `Generate 3 specific posture tips for someone with ${goal} goal at ${level} level. Focus on daily habits and workplace ergonomics.`,
    nutrition: `Create 3 advanced nutrition tips for ${goal} at ${level} level. Include timing, portions, and specific foods.`,
    recovery: `Provide 3 recovery and sleep optimization tips for ${goal} goal. Include specific techniques and timing.`,
    lifestyle: `Generate 3 lifestyle integration tips for busy people pursuing ${goal}. Practical and time-efficient.`
  };
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an expert in exercise science, nutrition, and behavioral psychology. Provide evidence-based, actionable advice." 
        },
        { role: "user", content: tipPrompts[focus] || tipPrompts.lifestyle }
      ],
      temperature: 0.7,
      max_tokens: 200
    });
    
    const tipsText = response.choices[0].message.content;
    const tipsArray = tipsText.split('\n').filter(tip => tip.trim().length > 0);
    
    res.json({ 
      tips: tipsArray,
      focus: focus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Tips Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate tips' });
  }
});

app.listen(process.env.PORT || 5000, () => console.log("AI Fitness Coach Server running on port 5000"));
