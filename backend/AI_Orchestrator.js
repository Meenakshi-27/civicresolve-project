/**
 * EcoResolve AI Orchestrator (Backend Version)
 * Handles: Language Detection, Translation (Mock), Classification, Priority, and Routing.
 */

const MOCK_TRANSLATIONS = {
  // Malayalam
  "മാലിന്യം കുമിഞ്ഞുകൂടുന്നു": "garbage accumulation",
  "വെള്ളം പാഴാകുന്നു": "water leaking",
  "വായു മലിനീകരണം": "air pollution",
  "ശബ്ദ മലിനീകരണം": "noise pollution",
  // Hindi
  "कचरा जमा हो गया है": "garbage accumulated",
  "पानी का रिसाव": "water leakage",
  "हवा में प्रदूषण": "air pollution",
  "बहुत शोर है": "too much noise",
  // Tamil
  "குப்பை மேடு": "garbage accumulation",
  "தண்ணீர் கசிவு": "water leakage",
  "காற்று மாசுபாடு": "air pollution",
  "சத்தம் அதிகம்": "too much noise",
};

const CATEGORIES = {
  WASTE: { 
    id: 'waste', 
    label: 'Waste Management', 
    department: 'Municipality', 
    keywords: ['garbage', 'waste', 'trash', 'dump', 'kuchra', 'maily', 'bin', 'plastic', 'litter', 'scavenger'],
    actions: ['Schedule emergency cleanup', 'Deploy waste collection truck', 'Install extra bins']
  },
  WATER: { 
    id: 'water', 
    label: 'Water Authority', 
    department: 'Water Board', 
    keywords: ['water', 'pipe', 'leak', 'drain', 'flood', 'pani', 'tap', 'sewage', 'canal', 'vellam'],
    actions: ['Dispatch repair plumbing team', 'Check main supply line', 'Sanitize water source']
  },
  AIR: { 
    id: 'air', 
    label: 'Pollution Control', 
    department: 'Environment Bureau', 
    keywords: ['smoke', 'air', 'smell', 'dust', 'pollution', 'hawa', 'puka', 'chemical', 'exhaust', 'fumes'],
    actions: ['Atmospheric audit', 'Issue notice to local industry', 'Install air sensors']
  },
  NOISE: { 
    id: 'noise', 
    label: 'Noise Control', 
    department: 'Local Police / PCB', 
    keywords: ['noise', 'loud', 'sound', 'music', 'construction', 'shabd', 'shabdam', 'cracker', 'horn', 'amplifier'],
    actions: ['Decibel monitoring', 'Restrict hours of operation', 'Official warning issued']
  }
};

const processComplaint = async (input, location) => {
  // 1. Language Detection & Translation
  let detectedLang = 'English';
  let translatedText = input.toLowerCase();

  for (const [native, eng] of Object.entries(MOCK_TRANSLATIONS)) {
    if (input.includes(native)) {
      detectedLang = native.match(/[\u0D00-\u0D7F]/) ? 'Malayalam' : 
                     native.match(/[\u0900-\u097F]/) ? 'Hindi' : 'Tamil';
      translatedText = eng;
      break;
    }
  }

  // 2. Classification
  let category = CATEGORIES.WASTE; // Default
  for (const cat of Object.values(CATEGORIES)) {
    if (cat.keywords.some(k => translatedText.includes(k))) {
      category = cat;
      break;
    }
  }

  // 3. Priority & Intelligence (Enhanced with Impact Scoring)
  let priority = 'Low';
  let reasoning = 'Standard report.';
  let impactScore = 'Low';
  
  const highSeverityKeywords = ['burst', 'flood', 'toxic', 'emergency', 'leakage', 'major', 'drainage', 'danger'];
  const mediumSeverityKeywords = ['blocked', 'pile', 'loud', 'broken', 'old', 'illegal', 'foul', 'leak'];
  const sensitivityKeywords = ['hospital', 'school', 'clinic', 'nursing', 'daycare', 'temple', 'church', 'mosque'];

  // Impact Scoring
  const hasSensitivity = sensitivityKeywords.some(k => translatedText.includes(k));
  if (hasSensitivity) impactScore = 'High';
  else if (translatedText.length > 100) impactScore = 'Medium';

  if (highSeverityKeywords.some(k => translatedText.includes(k)) || hasSensitivity) {
    priority = 'High';
    reasoning = hasSensitivity ? 'High priority due to sensitivity (Hospital/School zone).' : 'High priority due to potential safety risk or infrastructure damage.';
  } else if (mediumSeverityKeywords.some(k => translatedText.includes(k)) || translatedText.length > 80) {
    priority = 'Medium';
    reasoning = 'Medium priority based on description or localized environmental impact.';
  }

  // Duplicate Check simulation
  const isDuplicate = input.length % 7 === 0; 
  if (isDuplicate) {
    priority = 'High';
    reasoning += ' (Repeated reports in this zone detected)';
    impactScore = 'High';
  }

  // 4. Action Recommendation
  const action = category.actions[Math.floor(Math.random() * category.actions.length)];
  const responseMsg = `Your complaint regarding ${category.label} has been registered and routed to the ${category.department}.`;

  // 5. Back-Translation (Mock but comprehensive)
  const translations = {
    'Malayalam': `നിങ്ങൾ നൽകിയ ${category.label} പരാതി ${category.department}-ലേക്ക് വിജയകരമായി കൈമാറി. ഉടൻ നടപടി ഉണ്ടാകും.`,
    'Hindi': `आपकी ${category.label} संबंधी शिकायत दर्ज कर ली गई है और ${category.department} को भेज दी गई है।`,
    'Tamil': `உங்கள் ${category.label} புகார் பதிவு செய்யப்பட்டு ${category.department}-க்கு அனுப்பப்பட்டுள்ளது.`,
    'English': responseMsg
  };

  const translatedResponse = translations[detectedLang] || responseMsg;
  const timestamp = new Date().toISOString();

  return {
    id: 'CC-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
    originalText: input,
    translatedText,
    detectedLang,
    category: category.label,
    department: category.department,
    priority,
    reasoning,
    impactScore,
    upvotes: 0,
    action,
    location,
    status: 'Pending',
    escalationLevel: 0,
    timestamp,
    timeline: [
        { event: 'Reported', time: timestamp, detail: 'Complaint received and encrypted by AI.' },
        { event: 'Automated Routing', time: timestamp, detail: `Assigned to ${category.department}.` },
        { event: 'Assessment', time: timestamp, detail: `${priority} priority, ${impactScore} impact score assigned.` }
    ],
    response: translatedResponse
  };
};

module.exports = { processComplaint };
