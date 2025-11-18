export interface ECMHealthProfile {
  constitutionType: string;
  element: string;
  polarity: string;
  description: string;
  characteristics: string[];
  dietRecommendations: {
    recommended: string[];
    avoid: string[];
    beneficialFoods: string[];
    cookingMethods: string[];
  };
  lifestyleRecommendations: {
    exercise: string[];
    sleep: string[];
    environment: string[];
    activities: string[];
  };
  wellness: {
    strengths: string[];
    vulnerabilities: string[];
    preventiveCare: string[];
    seasonalAdvice: string[];
  };
  emotionalWellness: {
    tendencies: string[];
    balancingPractices: string[];
  };
}

export const ECM_HEALTH_PROFILES: Record<string, ECMHealthProfile> = {
  'Yang Wood': {
    constitutionType: 'Yang Wood',
    element: 'Wood',
    polarity: 'Yang',
    description: 'Yang Wood types are like strong trees - assertive, growth-oriented, and expansive. You have strong liver and gallbladder energy.',
    characteristics: [
      'Natural leadership qualities',
      'Strong willpower and determination',
      'Tendency towards physical activity',
      'Quick decision-making',
      'May experience tension and stress',
    ],
    dietRecommendations: {
      recommended: [
        'Sour flavors to support liver function',
        'Green leafy vegetables (kale, spinach, chard)',
        'Sprouts and young vegetables',
        'Fermented foods (sauerkraut, kimchi)',
        'Light, fresh foods',
      ],
      avoid: [
        'Excessive fatty and greasy foods',
        'Too much alcohol',
        'Heavy red meats',
        'Overly spicy foods',
        'Late-night eating',
      ],
      beneficialFoods: [
        'Lemon water in the morning',
        'Green tea',
        'Mung beans',
        'Celery',
        'Cucumber',
        'Wheat grass',
        'Artichokes',
      ],
      cookingMethods: [
        'Steaming',
        'Light sautéing',
        'Raw salads',
        'Blanching',
        'Avoid deep frying',
      ],
    },
    lifestyleRecommendations: {
      exercise: [
        'Regular vigorous exercise to release tension',
        'Martial arts or competitive sports',
        'Running or cycling',
        'Yoga for flexibility (especially hip openers)',
        'Tai Chi for balance',
      ],
      sleep: [
        'Aim for 7-8 hours',
        'Sleep before 11 PM to support liver detox',
        'Keep bedroom cool and dark',
        'Avoid screens 1 hour before bed',
      ],
      environment: [
        'Spend time in nature, especially forests',
        'Keep plants in living spaces',
        'Ensure good air circulation',
        'Morning sunlight exposure',
      ],
      activities: [
        'Creative pursuits and planning',
        'Goal-setting and achievement',
        'Outdoor activities',
        'Strategic games',
      ],
    },
    wellness: {
      strengths: [
        'Strong immune system',
        'Good recovery ability',
        'High energy levels',
        'Strong digestive fire',
      ],
      vulnerabilities: [
        'Liver and gallbladder issues',
        'Eye problems',
        'Muscle tension and headaches',
        'Stress-related conditions',
        'High blood pressure',
      ],
      preventiveCare: [
        'Regular liver detoxification',
        'Stress management techniques',
        'Eye exercises and rest',
        'Stretching and flexibility work',
        'Annual liver function tests',
      ],
      seasonalAdvice: [
        'Spring is your power season - harness this energy',
        'Be cautious of overheating in summer',
        'Support liver in autumn transitions',
        'Rest more in winter',
      ],
    },
    emotionalWellness: {
      tendencies: [
        'Quick to anger when stressed',
        'Frustration with obstacles',
        'Impatience',
        'Strong opinions',
      ],
      balancingPractices: [
        'Deep breathing exercises',
        'Meditation focused on patience',
        'Journaling to process emotions',
        'Forgiveness practices',
        'Creative expression',
      ],
    },
  },
  'Yin Wood': {
    constitutionType: 'Yin Wood',
    element: 'Wood',
    polarity: 'Yin',
    description: 'Yin Wood types are like flexible bamboo - adaptable, gentle, and persistent. You have refined liver and gallbladder sensitivity.',
    characteristics: [
      'Gentle and diplomatic nature',
      'Adaptable to circumstances',
      'Detail-oriented and careful',
      'Strong sense of justice',
      'May be sensitive to stress',
    ],
    dietRecommendations: {
      recommended: [
        'Mild sour flavors',
        'Tender greens and sprouts',
        'Light, easily digestible foods',
        'Herbal teas (mint, chamomile)',
        'Small, frequent meals',
      ],
      avoid: [
        'Heavy, dense foods',
        'Excessive raw foods',
        'Very spicy foods',
        'Alcohol',
        'Caffeine in excess',
      ],
      beneficialFoods: [
        'Steamed vegetables',
        'White fish',
        'Quinoa and millet',
        'Berries',
        'Goji berries',
        'Chrysanthemum tea',
        'Rice porridge',
      ],
      cookingMethods: [
        'Gentle steaming',
        'Light boiling',
        'Slow cooking',
        'Avoid heavy frying',
      ],
    },
    lifestyleRecommendations: {
      exercise: [
        'Gentle yoga and stretching',
        'Walking in nature',
        'Swimming',
        'Pilates',
        'Avoid over-exertion',
      ],
      sleep: [
        '8-9 hours recommended',
        'Regular sleep schedule',
        'Calming bedtime routine',
        'Avoid stimulation before bed',
      ],
      environment: [
        'Peaceful, organized spaces',
        'Natural light and fresh air',
        'Gardens and green spaces',
        'Avoid chaotic environments',
      ],
      activities: [
        'Reading and learning',
        'Artistic pursuits',
        'Gardening',
        'Gentle social interactions',
      ],
    },
    wellness: {
      strengths: [
        'Strong adaptability',
        'Good nervous system sensitivity',
        'Natural healing response',
      ],
      vulnerabilities: [
        'Digestive sensitivity',
        'Nervous system fragility',
        'Eye strain',
        'Allergies and sensitivities',
        'Stress-related disorders',
      ],
      preventiveCare: [
        'Regular rest and relaxation',
        'Gentle detoxification',
        'Stress reduction practices',
        'Eye care and protection',
        'Digestive support',
      ],
      seasonalAdvice: [
        'Gentle spring renewal',
        'Stay cool in summer',
        'Extra nourishment in autumn',
        'Deep rest in winter',
      ],
    },
    emotionalWellness: {
      tendencies: [
        'Worry and overthinking',
        'Difficulty with confrontation',
        'Perfectionism',
        'Emotional sensitivity',
      ],
      balancingPractices: [
        'Mindfulness meditation',
        'Grounding exercises',
        'Setting healthy boundaries',
        'Nature therapy',
        'Gentle self-compassion practice',
      ],
    },
  },
  'Yang Fire': {
    constitutionType: 'Yang Fire',
    element: 'Fire',
    polarity: 'Yang',
    description: 'Yang Fire types are like the sun - radiant, passionate, and energizing. You have strong heart and small intestine energy.',
    characteristics: [
      'Vibrant and charismatic',
      'Natural enthusiasm',
      'Strong social presence',
      'Generous spirit',
      'May burn out easily',
    ],
    dietRecommendations: {
      recommended: [
        'Bitter flavors to clear heat',
        'Cooling foods',
        'Red foods in moderation',
        'Hydrating vegetables',
        'Light, fresh meals',
      ],
      avoid: [
        'Excessive spicy foods',
        'Too much caffeine',
        'Alcohol',
        'Heavy, greasy foods',
        'Late-night eating',
      ],
      beneficialFoods: [
        'Watermelon',
        'Cucumber',
        'Tomatoes',
        'Bitter greens',
        'Green tea',
        'Lotus root',
        'White mushrooms',
      ],
      cookingMethods: [
        'Steaming',
        'Light boiling',
        'Raw salads',
        'Avoid deep frying',
      ],
    },
    lifestyleRecommendations: {
      exercise: [
        'Moderate cardio exercise',
        'Swimming to cool down',
        'Yoga for balance',
        'Social sports and activities',
        'Avoid overheating',
      ],
      sleep: [
        '7-8 hours essential',
        'Sleep before 11 PM to support heart',
        'Cool bedroom temperature',
        'Wind-down routine crucial',
      ],
      environment: [
        'Cool, well-ventilated spaces',
        'Natural shade and trees',
        'Water features',
        'Avoid excessive sun exposure',
      ],
      activities: [
        'Social gatherings',
        'Creative expression',
        'Public speaking',
        'Performance arts',
      ],
    },
    wellness: {
      strengths: [
        'Strong circulation',
        'Natural vitality',
        'Quick recovery',
        'Social resilience',
      ],
      vulnerabilities: [
        'Heart and cardiovascular issues',
        'Blood pressure concerns',
        'Insomnia and restlessness',
        'Burnout and exhaustion',
        'Skin inflammation',
      ],
      preventiveCare: [
        'Heart health monitoring',
        'Stress management',
        'Regular cooling practices',
        'Adequate rest and sleep',
        'Emotional balance',
      ],
      seasonalAdvice: [
        'Summer is your season but stay cool',
        'Rest more in winter',
        'Gentle renewal in spring',
        'Balance energy in autumn',
      ],
    },
    emotionalWellness: {
      tendencies: [
        'Anxiety when unbalanced',
        'Restlessness',
        'Impulsiveness',
        'Emotional intensity',
      ],
      balancingPractices: [
        'Cooling meditation',
        'Heart-centered practices',
        'Calming breathwork',
        'Journaling emotions',
        'Nature time',
      ],
    },
  },
  'Yin Fire': {
    constitutionType: 'Yin Fire',
    element: 'Fire',
    polarity: 'Yin',
    description: 'Yin Fire types are like candlelight - warm, gentle, and illuminating. You have refined heart and small intestine sensitivity.',
    characteristics: [
      'Warm and nurturing',
      'Intuitive understanding',
      'Artistic sensitivity',
      'Gentle charisma',
      'May be emotionally sensitive',
    ],
    dietRecommendations: {
      recommended: [
        'Mild cooling foods',
        'Nourishing broths',
        'Heart-supporting foods',
        'Gentle, warm meals',
        'Easy-to-digest foods',
      ],
      avoid: [
        'Excessive spicy foods',
        'Too much stimulation',
        'Very cold foods',
        'Heavy meals',
        'Caffeine',
      ],
      beneficialFoods: [
        'Red dates',
        'Longan fruit',
        'Goji berries',
        'Lean proteins',
        'Leafy greens',
        'Rose tea',
        'Oats',
      ],
      cookingMethods: [
        'Gentle steaming',
        'Light sautéing',
        'Warm soups',
        'Moderate cooking',
      ],
    },
    lifestyleRecommendations: {
      exercise: [
        'Gentle yoga',
        'Dancing',
        'Walking',
        'Tai Chi',
        'Avoid intense heat',
      ],
      sleep: [
        '8-9 hours recommended',
        'Regular sleep schedule',
        'Calming bedtime routine',
        'Cool, comfortable room',
      ],
      environment: [
        'Peaceful, beautiful spaces',
        'Soft lighting',
        'Natural beauty',
        'Avoid harsh environments',
      ],
      activities: [
        'Creative arts',
        'Music and performance',
        'Gentle social connection',
        'Spiritual practices',
      ],
    },
    wellness: {
      strengths: [
        'Emotional intelligence',
        'Natural warmth',
        'Healing presence',
      ],
      vulnerabilities: [
        'Heart palpitations',
        'Anxiety and nervousness',
        'Sleep disturbances',
        'Emotional overwhelm',
        'Low blood pressure',
      ],
      preventiveCare: [
        'Heart nourishment',
        'Emotional support',
        'Stress reduction',
        'Gentle exercise',
        'Regular rest',
      ],
      seasonalAdvice: [
        'Gentle warmth in summer',
        'Extra nourishment in winter',
        'Blooming in spring',
        'Grounding in autumn',
      ],
    },
    emotionalWellness: {
      tendencies: [
        'Emotional sensitivity',
        'Difficulty with criticism',
        'Mood fluctuations',
        'Overthinking relationships',
      ],
      balancingPractices: [
        'Heart meditation',
        'Creative expression',
        'Supportive relationships',
        'Self-compassion',
        'Gentle boundaries',
      ],
    },
  },
  'Yang Water': {
    constitutionType: 'Yang Water',
    element: 'Water',
    polarity: 'Yang',
    description: 'Yang Water types are like the ocean - powerful, deep, and flowing. You have strong kidney and bladder energy with great reserves.',
    characteristics: [
      'Deep wisdom and intuition',
      'Strong willpower',
      'Ambitious and determined',
      'Natural authority',
      'May push too hard',
    ],
    dietRecommendations: {
      recommended: [
        'Salty flavors in moderation',
        'Seafood and sea vegetables',
        'Black and dark blue foods',
        'Bone broths',
        'Warming foods',
      ],
      avoid: [
        'Excessive salt',
        'Very cold and raw foods',
        'Excessive caffeine',
        'Dehydrating foods',
        'Too many diuretics',
      ],
      beneficialFoods: [
        'Black beans',
        'Seaweed and kelp',
        'Wild fish',
        'Walnuts',
        'Black sesame seeds',
        'Kidney beans',
        'Dark berries',
      ],
      cookingMethods: [
        'Slow cooking',
        'Stewing',
        'Roasting',
        'Warming soups',
      ],
    },
    lifestyleRecommendations: {
      exercise: [
        'Swimming and water sports',
        'Intense cardio for stamina',
        'Martial arts',
        'Cold water immersion (gradually)',
        'Balance intensity with rest',
      ],
      sleep: [
        '7-8 hours minimum',
        'Protect sleep quality',
        'Dark, quiet environment',
        'Consistent schedule',
      ],
      environment: [
        'Near water when possible',
        'Cool, calm spaces',
        'Good humidity levels',
        'Minimal electromagnetic exposure',
      ],
      activities: [
        'Deep study and research',
        'Strategic planning',
        'Meditation and contemplation',
        'Water-based activities',
      ],
    },
    wellness: {
      strengths: [
        'Strong vitality and endurance',
        'Good stress resilience',
        'Strong bones and teeth',
        'Reproductive health',
      ],
      vulnerabilities: [
        'Kidney and bladder issues',
        'Lower back problems',
        'Bone and joint concerns',
        'Hearing issues',
        'Overwork and burnout',
      ],
      preventiveCare: [
        'Kidney health maintenance',
        'Lower back strengthening',
        'Adequate hydration',
        'Mineral supplementation',
        'Regular health checkups',
      ],
      seasonalAdvice: [
        'Winter is your power season',
        'Conserve energy in hot weather',
        'Support kidneys in autumn',
        'Balance activity in spring',
      ],
    },
    emotionalWellness: {
      tendencies: [
        'Fear when unbalanced',
        'Excessive caution',
        'Isolation tendencies',
        'Stubbornness',
      ],
      balancingPractices: [
        'Face fears gradually',
        'Build trust in others',
        'Social connection',
        'Courage-building activities',
        'Therapy or counseling',
      ],
    },
  },
  'Yin Water': {
    constitutionType: 'Yin Water',
    element: 'Water',
    polarity: 'Yin',
    description: 'Yin Water types are like morning dew - subtle, nourishing, and adaptive. You have refined kidney and bladder sensitivity.',
    characteristics: [
      'Intuitive and perceptive',
      'Adaptable and flexible',
      'Gentle wisdom',
      'Diplomatic nature',
      'May lack boundaries',
    ],
    dietRecommendations: {
      recommended: [
        'Nourishing soups and broths',
        'Gentle seafood',
        'Root vegetables',
        'Warm, hydrating foods',
        'Easy-to-digest proteins',
      ],
      avoid: [
        'Excessive salt',
        'Very cold beverages',
        'Raw foods in excess',
        'Drying foods',
        'Stimulants',
      ],
      beneficialFoods: [
        'Congee and rice porridge',
        'Sweet potato',
        'White fish',
        'Mushrooms',
        'Lotus seeds',
        'Warm milk alternatives',
        'Gentle herbal teas',
      ],
      cookingMethods: [
        'Slow cooking',
        'Steaming',
        'Gentle simmering',
        'Warm preparations',
      ],
    },
    lifestyleRecommendations: {
      exercise: [
        'Gentle swimming',
        'Tai Chi',
        'Walking',
        'Restorative yoga',
        'Avoid overexertion',
      ],
      sleep: [
        '8-9 hours recommended',
        'Regular schedule crucial',
        'Warm, comfortable bedding',
        'Quiet environment',
      ],
      environment: [
        'Calm, peaceful spaces',
        'Moderate humidity',
        'Avoid extreme temperatures',
        'Natural settings',
      ],
      activities: [
        'Contemplative practices',
        'Gentle creative work',
        'Reading and reflection',
        'Spiritual practices',
      ],
    },
    wellness: {
      strengths: [
        'Natural healing ability',
        'Intuitive health awareness',
        'Adaptability',
      ],
      vulnerabilities: [
        'Kidney deficiency',
        'Low energy and fatigue',
        'Reproductive sensitivities',
        'Fluid imbalances',
        'Weak immunity',
      ],
      preventiveCare: [
        'Nourish kidney essence',
        'Avoid energy depletion',
        'Regular gentle exercise',
        'Adequate rest',
        'Immune system support',
      ],
      seasonalAdvice: [
        'Extra care in winter',
        'Gentle activity in spring',
        'Stay hydrated in summer',
        'Build reserves in autumn',
      ],
    },
    emotionalWellness: {
      tendencies: [
        'Anxiety and worry',
        'Difficulty with change',
        'Oversensitivity',
        'Self-doubt',
      ],
      balancingPractices: [
        'Grounding meditation',
        'Building confidence',
        'Setting boundaries',
        'Self-care routines',
        'Supportive community',
      ],
    },
  },
  'Yang Metal': {
    constitutionType: 'Yang Metal',
    element: 'Metal',
    polarity: 'Yang',
    description: 'Yang Metal types are like refined steel - strong, clear, and disciplined. You have powerful lung and large intestine energy.',
    characteristics: [
      'Strong sense of justice',
      'Natural leadership',
      'Clear communication',
      'High standards',
      'May be rigid',
    ],
    dietRecommendations: {
      recommended: [
        'Pungent flavors (in moderation)',
        'White foods',
        'High-quality proteins',
        'Moistening foods',
        'Respiratory-supporting foods',
      ],
      avoid: [
        'Excessive dairy',
        'Too many cold drinks',
        'Heavy mucus-forming foods',
        'Processed foods',
        'Excessive sugar',
      ],
      beneficialFoods: [
        'Pears',
        'White radish (daikon)',
        'Almonds',
        'White fish',
        'Oats',
        'Cauliflower',
        'Ginger tea',
      ],
      cookingMethods: [
        'Steaming',
        'Baking',
        'Light roasting',
        'Clear soups',
      ],
    },
    lifestyleRecommendations: {
      exercise: [
        'Cardiovascular exercise',
        'Breathing exercises',
        'Swimming',
        'Martial arts',
        'Focus on lung capacity',
      ],
      sleep: [
        '7-8 hours',
        'Good air quality in bedroom',
        'Sleep before midnight',
        'Fresh linens',
      ],
      environment: [
        'Clean, organized spaces',
        'Good air quality',
        'Mountains and high altitude',
        'Minimal clutter',
      ],
      activities: [
        'Structured routines',
        'Public speaking',
        'Leadership roles',
        'Precision activities',
      ],
    },
    wellness: {
      strengths: [
        'Strong respiratory system',
        'Good posture',
        'Clear skin',
        'Strong immune defense',
      ],
      vulnerabilities: [
        'Respiratory issues',
        'Skin conditions',
        'Large intestine problems',
        'Grief affecting lungs',
        'Autoimmune tendencies',
      ],
      preventiveCare: [
        'Lung health maintenance',
        'Breathwork practice',
        'Skin care routine',
        'Digestive health',
        'Air quality awareness',
      ],
      seasonalAdvice: [
        'Autumn is your season',
        'Protect lungs in winter',
        'Release in spring',
        'Stay cool in summer',
      ],
    },
    emotionalWellness: {
      tendencies: [
        'Grief and sadness when imbalanced',
        'Perfectionism',
        'Difficulty with imperfection',
        'Rigidity',
      ],
      balancingPractices: [
        'Grief processing',
        'Flexibility exercises',
        'Letting go practices',
        'Laughter therapy',
        'Creative expression',
      ],
    },
  },
  'Yin Metal': {
    constitutionType: 'Yin Metal',
    element: 'Metal',
    polarity: 'Yin',
    description: 'Yin Metal types are like precious gems - refined, pure, and valuable. You have sensitive lung and large intestine energy.',
    characteristics: [
      'Refined and elegant',
      'Attention to detail',
      'Strong values',
      'Aesthetic sensitivity',
      'May be overly critical',
    ],
    dietRecommendations: {
      recommended: [
        'Light, pure foods',
        'White and light-colored foods',
        'Lung-moistening foods',
        'Easy-to-digest meals',
        'Clean, organic choices',
      ],
      avoid: [
        'Heavy, greasy foods',
        'Dairy products',
        'Excessive mucus-forming foods',
        'Processed ingredients',
        'Strong flavors',
      ],
      beneficialFoods: [
        'White mushrooms',
        'Lily bulbs',
        'Pears',
        'Almonds',
        'White tea',
        'Rice',
        'Light fish',
      ],
      cookingMethods: [
        'Gentle steaming',
        'Light sautéing',
        'Poaching',
        'Simple preparations',
      ],
    },
    lifestyleRecommendations: {
      exercise: [
        'Gentle yoga',
        'Walking',
        'Qi Gong',
        'Breathing exercises',
        'Pilates',
      ],
      sleep: [
        '8-9 hours',
        'High-quality sleep environment',
        'Fresh air circulation',
        'Calming routine',
      ],
      environment: [
        'Clean, minimal spaces',
        'Good ventilation',
        'Beautiful surroundings',
        'Natural materials',
      ],
      activities: [
        'Artistic pursuits',
        'Refinement practices',
        'Music and culture',
        'Quality over quantity',
      ],
    },
    wellness: {
      strengths: [
        'Refined sensitivity',
        'Natural elegance',
        'Good aesthetic sense',
      ],
      vulnerabilities: [
        'Respiratory sensitivities',
        'Allergies',
        'Skin sensitivities',
        'Digestive weakness',
        'Low immunity',
      ],
      preventiveCare: [
        'Protect respiratory health',
        'Avoid allergens',
        'Gentle immune support',
        'Skin protection',
        'Regular health monitoring',
      ],
      seasonalAdvice: [
        'Extra care in autumn',
        'Build strength in spring',
        'Stay cool in summer',
        'Rest in winter',
      ],
    },
    emotionalWellness: {
      tendencies: [
        'Sensitivity to criticism',
        'Perfectionism',
        'Melancholy',
        'Overthinking',
      ],
      balancingPractices: [
        'Self-acceptance',
        'Appreciation practices',
        'Gentleness with self',
        'Beauty and art therapy',
        'Supportive relationships',
      ],
    },
  },
  'Yang Earth': {
    constitutionType: 'Yang Earth',
    element: 'Earth',
    polarity: 'Yang',
    description: 'Yang Earth types are like mountains - stable, supportive, and grounded. You have strong spleen and stomach energy.',
    characteristics: [
      'Stable and reliable',
      'Nurturing nature',
      'Strong physical presence',
      'Practical and grounded',
      'May be stubborn',
    ],
    dietRecommendations: {
      recommended: [
        'Sweet flavors (natural)',
        'Yellow and orange foods',
        'Root vegetables',
        'Whole grains',
        'Warm, cooked meals',
      ],
      avoid: [
        'Excessive refined sugar',
        'Very cold and raw foods',
        'Too much dairy',
        'Processed foods',
        'Irregular eating',
      ],
      beneficialFoods: [
        'Sweet potato',
        'Carrots',
        'Pumpkin',
        'Millet',
        'Oats',
        'Dates',
        'Cooked vegetables',
      ],
      cookingMethods: [
        'Roasting',
        'Baking',
        'Stewing',
        'Warm preparations',
      ],
    },
    lifestyleRecommendations: {
      exercise: [
        'Weight training',
        'Hiking',
        'Team sports',
        'Regular physical activity',
        'Grounding practices',
      ],
      sleep: [
        '7-8 hours',
        'Consistent schedule',
        'Comfortable, supportive bed',
        'Regular routine',
      ],
      environment: [
        'Stable home base',
        'Natural settings',
        'Gardens and earth',
        'Comfortable spaces',
      ],
      activities: [
        'Caregiving roles',
        'Building and creating',
        'Community service',
        'Practical projects',
      ],
    },
    wellness: {
      strengths: [
        'Strong digestion',
        'Good stamina',
        'Stable health',
        'Physical strength',
      ],
      vulnerabilities: [
        'Digestive issues',
        'Weight management',
        'Dampness conditions',
        'Metabolic concerns',
        'Overthinking affecting stomach',
      ],
      preventiveCare: [
        'Maintain digestive health',
        'Regular physical activity',
        'Balanced diet',
        'Stress management',
        'Regular checkups',
      ],
      seasonalAdvice: [
        'Late summer is your season',
        'Build in spring',
        'Protect digestion in winter',
        'Light in summer',
      ],
    },
    emotionalWellness: {
      tendencies: [
        'Worry and overthinking',
        'Need for stability',
        'Difficulty with change',
        'Taking on others\' burdens',
      ],
      balancingPractices: [
        'Mindfulness',
        'Boundary setting',
        'Self-care priority',
        'Trust building',
        'Meditation',
      ],
    },
  },
  'Yin Earth': {
    constitutionType: 'Yin Earth',
    element: 'Earth',
    polarity: 'Yin',
    description: 'Yin Earth types are like fertile soil - nurturing, receptive, and supportive. You have gentle spleen and stomach energy.',
    characteristics: [
      'Caring and empathetic',
      'Supportive nature',
      'Good listener',
      'Practical wisdom',
      'May absorb others\' problems',
    ],
    dietRecommendations: {
      recommended: [
        'Naturally sweet foods',
        'Easy-to-digest meals',
        'Small, frequent portions',
        'Warm, nourishing foods',
        'Gentle flavors',
      ],
      avoid: [
        'Heavy, greasy foods',
        'Excessive raw foods',
        'Cold drinks',
        'Irregular eating',
        'Too much sugar',
      ],
      beneficialFoods: [
        'Rice porridge',
        'Yam',
        'Pumpkin',
        'Carrot',
        'Dates',
        'Gentle grains',
        'Warm soups',
      ],
      cookingMethods: [
        'Gentle steaming',
        'Slow cooking',
        'Warm soups',
        'Easy digestion focus',
      ],
    },
    lifestyleRecommendations: {
      exercise: [
        'Gentle walking',
        'Yoga',
        'Tai Chi',
        'Light stretching',
        'Avoid overexertion',
      ],
      sleep: [
        '8-9 hours',
        'Regular schedule important',
        'Comfortable environment',
        'Evening routine',
      ],
      environment: [
        'Calm, nurturing spaces',
        'Gardens',
        'Home comfort',
        'Stable surroundings',
      ],
      activities: [
        'Nurturing hobbies',
        'Gentle creativity',
        'Supportive relationships',
        'Self-care practices',
      ],
    },
    wellness: {
      strengths: [
        'Natural healing response',
        'Adaptability',
        'Emotional attunement',
      ],
      vulnerabilities: [
        'Digestive sensitivity',
        'Worry affecting appetite',
        'Fatigue',
        'Dampness accumulation',
        'Weak boundaries',
      ],
      preventiveCare: [
        'Digestive support',
        'Regular gentle exercise',
        'Emotional boundaries',
        'Adequate rest',
        'Nourishing diet',
      ],
      seasonalAdvice: [
        'Gentle transitions',
        'Extra care in damp weather',
        'Build strength in spring',
        'Rest in winter',
      ],
    },
    emotionalWellness: {
      tendencies: [
        'Excessive worry',
        'Taking on others\' emotions',
        'Self-sacrifice',
        'Difficulty saying no',
      ],
      balancingPractices: [
        'Boundary work',
        'Self-nurturing',
        'Worry management',
        'Grounding practices',
        'Therapeutic support',
      ],
    },
  },
};

// Fallback for any missing constitution types
export const getHealthProfile = (constitutionType: string): ECMHealthProfile => {
  return ECM_HEALTH_PROFILES[constitutionType] || {
    constitutionType,
    element: constitutionType.split(' ')[1] || 'Unknown',
    polarity: constitutionType.split(' ')[0] || 'Unknown',
    description: 'Your unique constitutional type.',
    characteristics: ['Balanced constitution', 'Individual traits'],
    dietRecommendations: {
      recommended: ['Balanced, whole foods', 'Listen to your body'],
      avoid: ['Processed foods', 'Excessive consumption'],
      beneficialFoods: ['Variety of fresh foods'],
      cookingMethods: ['Varied cooking methods'],
    },
    lifestyleRecommendations: {
      exercise: ['Regular balanced exercise'],
      sleep: ['7-9 hours quality sleep'],
      environment: ['Clean, comfortable spaces'],
      activities: ['Activities you enjoy'],
    },
    wellness: {
      strengths: ['Individual strengths'],
      vulnerabilities: ['Individual sensitivities'],
      preventiveCare: ['Regular health checkups'],
      seasonalAdvice: ['Adapt to seasonal changes'],
    },
    emotionalWellness: {
      tendencies: ['Individual patterns'],
      balancingPractices: ['Self-awareness and balance'],
    },
  };
};
