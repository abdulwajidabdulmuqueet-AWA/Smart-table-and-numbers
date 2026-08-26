import { Language } from '../types';

export interface AppTranslation {
  appTitle: string;
  appSubtitle: string;
  tagline: string;
  
  // Navigation
  navTables: string;
  navTableGames: string;
  navNumbers: string;
  navNumberGames: string;
  navPractice: string;
  navProgress: string;
  navSettings: string;
  
  // Dashboard & Quick actions
  startTables: string;
  playGames: string;
  learnNumbers: string;
  viewProgress: string;
  selectTopic: string;
  classroomMode: string;
  classroomModeDesc: string;
  
  // Tables Module
  tablesHeading: string;
  tablesSubtitle: string;
  selectTable: string;
  tableOf: string;
  startPresentation: string;
  exitPresentation: string;
  autoRhythm: string;
  autoRhythmOn: string;
  autoRhythmOff: string;
  autoPlayNextTable: string;
  autoPlayNextDesc: string;
  tableCompletedNextIn: string;
  singleScreenMode: string;
  voiceMode: string;
  voiceModeOn: string;
  voiceModeOff: string;
  voiceListening: string;
  voicePrompt: string;
  voiceNotSupported: string;
  micPermissionDenied: string;
  readAloud: string;
  speed: string;
  speedSlow: string;
  speedNormal: string;
  speedFast: string;
  speedVeryFast: string;
  customTiming: string;
  visualMode: string;
  visualExpl: string;
  repeatedAddition: string;
  groupsOf: string;
  
  // Controls
  play: string;
  pause: string;
  next: string;
  previous: string;
  restart: string;
  fullscreen: string;
  exitFullscreen: string;
  soundOn: string;
  soundOff: string;
  
  // Tables Games
  tableGamesHeading: string;
  tableGamesSubtitle: string;
  difficulty: string;
  diffEasy: string;
  diffMedium: string;
  diffHard: string;
  customTables: string;
  
  gameFindAnswer: string;
  gameFindAnswerDesc: string;
  gameCompleteTable: string;
  gameCompleteTableDesc: string;
  gameFallingNumbers: string;
  gameFallingNumbersDesc: string;
  gameMatchPair: string;
  gameMatchPairDesc: string;
  gameTableRace: string;
  gameTableRaceDesc: string;
  gameMissingNumber: string;
  gameMissingNumberDesc: string;
  gameTrueFalse: string;
  gameTrueFalseDesc: string;
  gameMemory: string;
  gameMemoryDesc: string;
  
  // Number Learning
  numberHeading: string;
  numberSubtitle: string;
  indianSystem: string;
  placeValueBoard: string;
  explorePlaceValue: string;
  enterAnyNumber: string;
  randomNumber: string;
  placeValue: string;
  faceValue: string;
  expandedForm: string;
  inWords: string;
  clickDigitToLearn: string;
  
  // Number Games
  numberGamesHeading: string;
  numberGamesSubtitle: string;
  gameIdentifyNumber: string;
  gameIdentifyNumberDesc: string;
  gamePlaceValue: string;
  gamePlaceValueDesc: string;
  gameNumberBuilder: string;
  gameNumberBuilderDesc: string;
  gameComparison: string;
  gameComparisonDesc: string;
  gameSequence: string;
  gameSequenceDesc: string;
  gameNumberMemory: string;
  gameNumberMemoryDesc: string;
  gameChallenge: string;
  gameChallengeDesc: string;
  
  makeLargest: string;
  makeSmallest: string;
  whichIsGreater: string;
  memorizeIn: string;
  seconds: string;
  whatsTheNumber: string;
  
  // Common Game Feedback
  score: string;
  question: string;
  of: string;
  correct: string;
  wrong: string;
  excellent: string;
  tryAgain: string;
  streak: string;
  timeRemaining: string;
  gameOver: string;
  playAgain: string;
  finalScore: string;
  accuracy: string;
  bestScore: string;
  
  // Progress & Badges
  progressHeading: string;
  progressSubtitle: string;
  tablesMastered: string;
  totalCalculations: string;
  accuracyRate: string;
  trophies: string;
  exportData: string;
  importData: string;
  resetProgress: string;
  resetConfirm: string;
  dataExported: string;
  dataImported: string;
  
  // Settings
  settingsHeading: string;
  settingsSubtitle: string;
  languageSelect: string;
  audioSettings: string;
  smartBoardSettings: string;
  highContrast: string;
  reducedMotion: string;
  pwaInstall: string;
  pwaInstalled: string;
  pwaOfflineReady: string;
  installModalTitle: string;
  installModalSubtitle: string;
  installNowBtn: string;
  installHowToTitle: string;
  installAndroidStep: string;
  installIosStep: string;
  installDesktopStep: string;
  installFeatureOffline: string;
  installFeatureFast: string;
  installFeatureSafe: string;
  alreadyInstalled: string;
  close: string;
}

export const translations: Record<Language, AppTranslation> = {
  en: {
    appTitle: 'Smart Maths (Table and Numbers)',
    appSubtitle: 'Interactive Mathematics for Classrooms & Smart Boards',
    tagline: 'Visual, Engaging & Fun Maths Mastery',
    
    navTables: 'Tables 2-20',
    navTableGames: 'Tables Games',
    navNumbers: 'Learn Numbers',
    navNumberGames: 'Number Games',
    navPractice: 'Practice Test',
    navProgress: 'My Progress',
    navSettings: 'Teacher Settings',
    
    startTables: '▶ Start Tables',
    playGames: '🎮 Play Games',
    learnNumbers: '🔢 Learn Numbers',
    viewProgress: '🏆 My Progress',
    selectTopic: 'Choose an Activity',
    classroomMode: 'Classroom Smart Board Mode',
    classroomModeDesc: 'Extra large touch-friendly typography with distraction-free recitation controls.',
    
    tablesHeading: 'Multiplication Tables 2 to 20',
    tablesSubtitle: 'Learn with Auto-Rhythm Recitation, Visuals & Voice Control',
    selectTable: 'Select a Table to Learn:',
    tableOf: 'Table of',
    startPresentation: '🖥️ Start Smart Board Presentation',
    exitPresentation: 'Exit Presentation',
    autoRhythm: 'Auto Rhythm Mode',
    autoRhythmOn: 'Auto Rhythm: ON',
    autoRhythmOff: 'Auto Rhythm: OFF',
    autoPlayNextTable: 'Auto-Play Next Table',
    autoPlayNextDesc: 'Automatically advances to the next table (2 → 20) upon completion',
    tableCompletedNextIn: 'Table {table} Complete! Next Table in {sec}s...',
    singleScreenMode: 'Fit to Single Screen',
    voiceMode: 'Voice Recitation Mode',
    voiceModeOn: 'Voice Mode: ON (Listening)',
    voiceModeOff: 'Voice Mode: OFF',
    voiceListening: 'Listening for your recitation... Say the line clearly!',
    voicePrompt: 'Say: "{example}"',
    voiceNotSupported: 'Voice recognition is unavailable on this browser. Using Auto Rhythm mode.',
    micPermissionDenied: 'Microphone permission denied. Using Auto Rhythm mode instead.',
    readAloud: 'Read Aloud (TTS)',
    speed: 'Rhythm Speed',
    speedSlow: '🐢 Slow (3.0s)',
    speedNormal: '🚶 Normal (2.0s)',
    speedFast: '🏃 Fast (1.2s)',
    speedVeryFast: '⚡ Very Fast (0.6s)',
    customTiming: 'Custom Timing',
    visualMode: 'Visual Concept Mode',
    visualExpl: 'Visual Concept Representation',
    repeatedAddition: 'Repeated Addition',
    groupsOf: 'groups of',
    
    play: 'Play',
    pause: 'Pause',
    next: 'Next',
    previous: 'Previous',
    restart: 'Restart',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    soundOn: 'Sound: ON',
    soundOff: 'Sound: OFF',
    
    tableGamesHeading: 'Interactive Tables Games',
    tableGamesSubtitle: 'Reinforce multiplication through fun, animated game modes',
    difficulty: 'Difficulty Level',
    diffEasy: '🟢 Easy (Single Table)',
    diffMedium: '🟡 Medium (Selected Tables)',
    diffHard: '🔴 Hard (All Tables 2-20)',
    customTables: 'Custom Select Tables',
    
    gameFindAnswer: 'Find Correct Answer',
    gameFindAnswerDesc: 'Choose the correct product from 4 options quickly',
    gameCompleteTable: 'Complete the Table',
    gameCompleteTableDesc: 'Fill in the missing multiplier or product in sequence',
    gameFallingNumbers: 'Falling Numbers',
    gameFallingNumbersDesc: 'Tap the correct falling bubble before it reaches bottom!',
    gameMatchPair: 'Match the Pairs',
    gameMatchPairDesc: 'Connect questions with their matching answers',
    gameTableRace: 'Table Speed Race',
    gameTableRaceDesc: 'Beat the clock! Solve 10 questions as fast as possible',
    gameMissingNumber: 'Missing Factor',
    gameMissingNumberDesc: 'Find the unknown multiplier (e.g. 7 × ? = 56)',
    gameTrueFalse: 'True or False',
    gameTrueFalseDesc: 'Check whether the multiplication statement is correct',
    gameMemory: 'Table Memory Match',
    gameMemoryDesc: 'Flip card memory matching game for questions & answers',
    
    numberHeading: 'Indian Place Value & Numbers',
    numberSubtitle: 'Master Numbers from Ones to 10 Crores (1 to 10,00,00,000)',
    indianSystem: 'Indian Number System',
    placeValueBoard: 'Interactive Place Value Board',
    explorePlaceValue: 'Explore Place Value Breakdown',
    enterAnyNumber: 'Enter any number up to 10 Crores:',
    randomNumber: '🎲 Generate Random Number',
    placeValue: 'Place Value',
    faceValue: 'Face Value',
    expandedForm: 'Expanded Form',
    inWords: 'Number in Words',
    clickDigitToLearn: 'Tap on any digit box above to inspect its Place Value & Expanded Form!',
    
    numberGamesHeading: 'Number & Place Value Games',
    numberGamesSubtitle: 'Interactive challenges for place value, comparison and sequences',
    gameIdentifyNumber: 'Identify the Number',
    gameIdentifyNumberDesc: 'Match words/place descriptions with the correct number',
    gamePlaceValue: 'Place Value Quiz',
    gamePlaceValueDesc: 'Determine the exact place value of highlighted digits',
    gameNumberBuilder: 'Number Builder',
    gameNumberBuilderDesc: 'Drag & order digit cards to form largest or smallest numbers',
    gameComparison: 'Number Comparison',
    gameComparisonDesc: 'Compare two large numbers using >, <, or =',
    gameSequence: 'Number Sequence',
    gameSequenceDesc: 'Find the missing number in the counting sequence',
    gameNumberMemory: 'Number Memory',
    gameNumberMemoryDesc: 'Memorize the flashed number and select the correct match',
    gameChallenge: 'Grand Math Challenge',
    gameChallengeDesc: '10 mixed questions timed challenge across all math topics',
    
    makeLargest: 'Make the LARGEST possible number using all digits:',
    makeSmallest: 'Make the SMALLEST possible number using all digits:',
    whichIsGreater: 'Choose the correct comparison symbol:',
    memorizeIn: 'Memorize this number! Disappearing in:',
    seconds: 'seconds',
    whatsTheNumber: 'What was the number you saw?',
    
    score: 'Score',
    question: 'Question',
    of: 'of',
    correct: 'Correct!',
    wrong: 'Not quite!',
    excellent: '🎉 Excellent Job!',
    tryAgain: 'Try Again!',
    streak: 'Streak',
    timeRemaining: 'Time Left',
    gameOver: 'Challenge Completed!',
    playAgain: 'Play Again',
    finalScore: 'Final Score',
    accuracy: 'Accuracy',
    bestScore: 'Best Score',
    
    progressHeading: 'Student Progress & Achievements',
    progressSubtitle: 'Track your table masteries, high scores and trophies',
    tablesMastered: 'Tables Mastered',
    totalCalculations: 'Total Questions Answered',
    accuracyRate: 'Overall Accuracy',
    trophies: 'Unlocked Badges & Trophies',
    exportData: 'Export Progress (JSON)',
    importData: 'Import Progress',
    resetProgress: 'Reset Progress Data',
    resetConfirm: 'Are you sure you want to reset all progress and stars?',
    dataExported: 'Progress data successfully exported!',
    dataImported: 'Progress data successfully imported!',
    
    settingsHeading: 'Teacher & Classroom Settings',
    settingsSubtitle: 'Customize language, speed, classroom display, and audio preferences',
    languageSelect: 'Interface & Recitation Language',
    audioSettings: 'Sound & Speech Configuration',
    smartBoardSettings: 'Classroom & Smart Board Display',
    highContrast: 'High Contrast Mode',
    reducedMotion: 'Reduced Motion (Less Animation)',
    pwaInstall: '📱 Install App as PWA (Offline Use)',
    pwaInstalled: 'App is installed and offline ready',
    pwaOfflineReady: '100% Offline Ready. All tables, calculations and audio work without internet.',
    installModalTitle: 'Install Smart Maths App',
    installModalSubtitle: 'Install on your Phone, Tablet, Smart Board, or Computer for 100% offline access and fast full-screen teaching.',
    installNowBtn: 'Install App Now (1-Click)',
    installHowToTitle: 'How to Install on Your Device:',
    installAndroidStep: 'Android / Chrome: Tap "Install App Now" or tap menu (⋮) -> select "Install App" or "Add to Home screen".',
    installIosStep: 'iPhone / iPad (Safari): Tap the Share button (⎋ / 📤) at the bottom -> scroll down -> tap "Add to Home Screen" (+).',
    installDesktopStep: 'Computer / Smart Board: Click the install icon (⊕ / ⬇) on the right side of the browser address bar.',
    installFeatureOffline: '⚡ 100% Offline: Practice tables, numbers & games anywhere with no internet needed.',
    installFeatureFast: '🚀 Instant Launch: Opens like a native app with zero delay and saved high-scores.',
    installFeatureSafe: '🎯 Classroom Ready: Full-screen distraction-free mode for smart boards & tablets.',
    alreadyInstalled: 'Smart Maths is installed on this device!',
    close: 'Close'
  },
  
  hi: {
    appTitle: 'Smart Maths (Table and Numbers)',
    appSubtitle: 'कक्षाओं और स्मार्ट बोर्ड के लिए इंटरैक्टिव गणित',
    tagline: 'दृश्य, रोचक और आनंददायी गणितीय महारत',
    
    navTables: 'पहाड़े २ से २०',
    navTableGames: 'पहाड़ा खेल',
    navNumbers: 'संख्या ज्ञान',
    navNumberGames: 'संख्या खेल',
    navPractice: 'अभ्यास परीक्षा',
    navProgress: 'मेरी प्रगति',
    navSettings: 'शिक्षक सेटिंग्स',
    
    startTables: '▶ पहाड़े शुरू करें',
    playGames: '🎮 खेल खेलें',
    learnNumbers: '🔢 संख्या सीखें',
    viewProgress: '🏆 मेरी प्रगति',
    selectTopic: 'एक गतिविधि चुनें',
    classroomMode: 'कक्षा स्मार्ट बोर्ड मोड',
    classroomModeDesc: 'बड़े फॉन्ट और स्पर्श-अनुकूल नियंत्रणों के साथ विकर्षण-मुक्त शिक्षण।',
    
    tablesHeading: 'गुणा पहाड़े २ से २०',
    tablesSubtitle: 'स्वचालित लय (ऑटो-रिदम), दृश्य और स्वर नियंत्रण के साथ सीखें',
    selectTable: 'सीखने के लिए पहाड़ा चुनें:',
    tableOf: 'का पहाड़ा',
    startPresentation: '🖥️ स्मार्ट बोर्ड प्रस्तुति शुरू करें',
    exitPresentation: 'प्रस्तुति समाप्त करें',
    autoRhythm: 'ऑटो रिदम मोड',
    autoRhythmOn: 'ऑटो रिदम: चालू',
    autoRhythmOff: 'ऑटो रिदम: बंद',
    autoPlayNextTable: 'अगला पहाड़ा ऑटो-प्ले करें',
    autoPlayNextDesc: 'पहाड़ा समाप्त होने पर अपने आप अगले पहाड़े (२ → २०) पर जाएं',
    tableCompletedNextIn: 'पहाड़ा {table} पूरा हुआ! {sec} सेकंड में अगला पहाड़ा...',
    singleScreenMode: 'सिंगल स्क्रीन व्यू',
    voiceMode: 'स्वर उच्चारण मोड (Voice)',
    voiceModeOn: 'स्वर मोड: चालू (सुन रहा है)',
    voiceModeOff: 'स्वर मोड: बंद',
    voiceListening: 'आपके उच्चारण की प्रतीक्षा है... स्पष्ट बोलें!',
    voicePrompt: 'बोलें: "{example}"',
    voiceNotSupported: 'इस ब्राउज़र पर स्वर पहचान समर्थित नहीं है। ऑटो रिदम का उपयोग हो रहा है।',
    micPermissionDenied: 'माइक की अनुमति नहीं मिली। ऑटो रिदम मोड का उपयोग करें।',
    readAloud: 'बोलकर सुनाएं (TTS)',
    speed: 'लय की गति',
    speedSlow: '🐢 धीमा (३.० से)',
    speedNormal: '🚶 सामान्य (२.० से)',
    speedFast: '🏃 तेज़ (१.२ से)',
    speedVeryFast: '⚡ बहुत तेज़ (०.६ से)',
    customTiming: 'कस्टम समय',
    visualMode: 'दृश्य संकल्पना मोड',
    visualExpl: 'दृश्य संकल्पना प्रस्तुति',
    repeatedAddition: 'बार-बार जोड़ना',
    groupsOf: 'के समूह',
    
    play: 'शुरू',
    pause: 'रोकें',
    next: 'आगे',
    previous: 'पीछे',
    restart: 'पुनः आरंभ',
    fullscreen: 'पूर्ण स्क्रीन',
    exitFullscreen: 'पूर्ण स्क्रीन से बाहर',
    soundOn: 'ध्वनि: चालू',
    soundOff: 'ध्वनि: बंद',
    
    tableGamesHeading: 'इंटरैक्टिव पहाड़ा खेल',
    tableGamesSubtitle: 'मज़ेदार और एनिमेटेड खेलों के माध्यम से पहाड़े पक्के करें',
    difficulty: 'कठिनाई स्तर',
    diffEasy: '🟢 आसान (एक पहाड़ा)',
    diffMedium: '🟡 मध्यम (चुने हुए पहाड़े)',
    diffHard: '🔴 कठिन (सभी पहाड़े २-२०)',
    customTables: 'पहाड़े चुनें',
    
    gameFindAnswer: 'सही उत्तर चुनें',
    gameFindAnswerDesc: 'चार विकल्पों में से सही गुणनफल तुरंत चुनें',
    gameCompleteTable: 'पहाड़ा पूरा करें',
    gameCompleteTableDesc: 'क्रम में छूटी हुई संख्या या गुणनफल भरें',
    gameFallingNumbers: 'गिरते अंक (Falling Numbers)',
    gameFallingNumbersDesc: 'नीचे पहुँचने से पहले सही बुलबुले पर टैप करें!',
    gameMatchPair: 'जोड़ी मिलाएँ',
    gameMatchPairDesc: 'सवालों को उनके सही उत्तरों से मिलाएँ',
    gameTableRace: 'पहाड़ा रेस',
    gameTableRaceDesc: 'समय समाप्त होने से पहले १० सवालों के जवाब दें',
    gameMissingNumber: 'लुप्त संख्या खोजें',
    gameMissingNumberDesc: 'अज्ञात संख्या खोजें (जैसे: ७ × ? = ५६)',
    gameTrueFalse: 'सही या गलत',
    gameTrueFalseDesc: 'जांचें कि क्या गुणा का समीकरण सही है',
    gameMemory: 'पहाड़ा स्मृति खेल (Memory)',
    gameMemoryDesc: 'सवालों और उत्तरों के कार्ड पलटकर जोड़ी मिलाएँ',
    
    numberHeading: 'भारतीय स्थानीय मान और संख्याएँ',
    numberSubtitle: 'इकाई से लेकर १० करोड़ (१ से १०,००,००,०००) तक महारत हासिल करें',
    indianSystem: 'भारतीय संख्या प्रणाली',
    placeValueBoard: 'इंटरैक्टिव स्थानीय मान बोर्ड',
    explorePlaceValue: 'स्थानीय मान का विस्तृत विश्लेषण',
    enterAnyNumber: '१० करोड़ तक कोई भी संख्या दर्ज करें:',
    randomNumber: '🎲 यादृच्छिक संख्या बनाएं',
    placeValue: 'स्थानीय मान (Place Value)',
    faceValue: 'अंकित मान (Face Value)',
    expandedForm: 'विस्तारित रूप',
    inWords: 'शब्दों में संख्या',
    clickDigitToLearn: 'स्थानीय मान और विस्तारित रूप देखने के लिए किसी भी अंक पर टैप करें!',
    
    numberGamesHeading: 'संख्या और स्थानीय मान खेल',
    numberGamesSubtitle: 'स्थानीय मान, तुलना और संख्या क्रम के लिए रोचक चुनौतियाँ',
    gameIdentifyNumber: 'संख्या पहचानें',
    gameIdentifyNumberDesc: 'शब्दों या स्थानीय मान के विवरण से सही संख्या पहचानें',
    gamePlaceValue: 'स्थानीय मान प्रश्नोत्तरी',
    gamePlaceValueDesc: 'चिह्नित अंक का सटीक स्थानीय मान बताएं',
    gameNumberBuilder: 'संख्या निर्माता (Number Builder)',
    gameNumberBuilderDesc: 'अंकों के कार्ड व्यवस्थित करके सबसे बड़ी या छोटी संख्या बनाएं',
    gameComparison: 'संख्याओं की तुलना',
    gameComparisonDesc: '>, <, या = चिह्नों का उपयोग करके तुलना करें',
    gameSequence: 'संख्या क्रम',
    gameSequenceDesc: 'गिनती क्रम में अगली सही संख्या चुनें',
    gameNumberMemory: 'संख्या स्मृति खेल',
    gameNumberMemoryDesc: 'दिखाई गई संख्या याद रखें और सही उत्तर चुनें',
    gameChallenge: 'भव्य गणित चुनौती',
    gameChallengeDesc: 'सभी विषयों से १० मिश्रित प्रश्नों की समयबद्ध चुनौती',
    
    makeLargest: 'सभी अंकों का उपयोग करके सबसे बड़ी संख्या बनाएं:',
    makeSmallest: 'सभी अंकों का उपयोग करके सबसे छोटी संख्या बनाएं:',
    whichIsGreater: 'सही तुलना चिह्न चुनें:',
    memorizeIn: 'इस संख्या को याद रखें! गायब होने में शेष समय:',
    seconds: 'सेकंड',
    whatsTheNumber: 'आपने कौन सी संख्या देखी थी?',
    
    score: 'अंक',
    question: 'प्रश्न',
    of: 'का',
    correct: 'सही!',
    wrong: 'गलत प्रयास!',
    excellent: '🎉 बहुत बढ़िया!',
    tryAgain: 'पुनः प्रयास करें!',
    streak: 'लगातार सही',
    timeRemaining: 'शेष समय',
    gameOver: 'चुनौती समाप्त!',
    playAgain: 'फिर से खेलें',
    finalScore: 'अंतिम अंक',
    accuracy: 'सटीकता',
    bestScore: 'सर्वश्रेष्ठ अंक',
    
    progressHeading: 'विद्यार्थी प्रगति और उपलब्धियां',
    progressSubtitle: 'अपने पहाड़ा सितारों, उच्चतम स्कोर और पदकों को देखें',
    tablesMastered: 'पूर्ण किए गए पहाड़े',
    totalCalculations: 'कुल हल किए गए प्रश्न',
    accuracyRate: 'कुल सटीकता',
    trophies: 'प्राप्त किए गए पदक व ट्रॉफियां',
    exportData: 'प्रगति डेटा निर्यात करें (JSON)',
    importData: 'प्रगति डेटा आयात करें',
    resetProgress: 'प्रगति डेटा रीसेट करें',
    resetConfirm: 'क्या आप वाकई सारी प्रगति और सितारे रीसेट करना चाहते हैं?',
    dataExported: 'प्रगति डेटा सफलतापूर्वक निर्यात किया गया!',
    dataImported: 'प्रगति डेटा सफलतापूर्वक आयात किया गया!',
    
    settingsHeading: 'शिक्षक एवं कक्षा सेटिंग्स',
    settingsSubtitle: 'भाषा, गति, स्मार्ट बोर्ड प्रदर्शन और ऑडियो सेटिंग्स अनुकूलित करें',
    languageSelect: 'इंटरफ़ेस और पठन भाषा',
    audioSettings: 'ध्वनि एवं स्वर सेटिंग्स',
    smartBoardSettings: 'कक्षा और स्मार्ट बोर्ड प्रदर्शन',
    highContrast: 'उच्च कंट्रास्ट मोड',
    reducedMotion: 'कम एनिमेशन (Reduced Motion)',
    pwaInstall: '📱 ऐप इंस्टॉल करें (ऑफलाइन उपयोग हेतु)',
    pwaInstalled: 'ऐप इंस्टॉल हो चुका है और ऑफलाइन तैयार है',
    pwaOfflineReady: '१००% ऑफलाइन तैयार। सभी पहाड़े और खेल बिना इंटरनेट के काम करते हैं।',
    installModalTitle: 'Smart Maths ऐप इंस्टॉल करें',
    installModalSubtitle: '१००% ऑफलाइन उपयोग और फुल-स्क्रीन शिक्षण के लिए अपने फोन, टैबलेट, स्मार्ट बोर्ड या कंप्यूटर पर इंस्टॉल करें।',
    installNowBtn: 'अभी ऐप इंस्टॉल करें (1-Click)',
    installHowToTitle: 'अपने डिवाइस पर कैसे इंस्टॉल करें:',
    installAndroidStep: 'Android / Chrome: "अभी ऐप इंस्टॉल करें" पर टैप करें या मेनू (⋮) -> "App इंस्टॉल करें" / "Add to Home screen" चुनें।',
    installIosStep: 'iPhone / iPad (Safari): नीचे शेयर बटन (⎋ / 📤) दबाएं -> नीचे स्क्रॉल करें -> "Add to Home Screen" (+) चुनें।',
    installDesktopStep: 'कंप्यूटर / स्मार्ट बोर्ड: ब्राउज़र के एड्रेस बार में दाईं ओर दिए गए इंस्टॉल आइकन (⊕ / ⬇) पर क्लिक करें।',
    installFeatureOffline: '⚡ १००% ऑफलाइन: बिना इंटरनेट के कभी भी पहाड़े और खेल सीखें।',
    installFeatureFast: '🚀 तुरंत ओपन: सामान्य ऐप की तरह बिजली की गति से लोड होता है।',
    installFeatureSafe: '🎯 स्मार्ट बोर्ड तैयार: कक्षाओं के लिए बिना किसी रुकावट के फुल-स्क्रीन अनुभव।',
    alreadyInstalled: 'Smart Maths ऐप इस डिवाइस पर पहले से इंस्टॉल है!',
    close: 'बंद करें'
  },
  
  mr: {
    appTitle: 'Smart Maths (Table and Numbers)',
    appSubtitle: 'वर्गखोल्या आणि स्मार्ट बोर्डसाठी परस्परसंवादी गणित',
    tagline: 'दृश्यमान, रंजक आणि आनंददायी गणितीय शिक्षण',
    
    navTables: 'पाढे २ ते २०',
    navTableGames: 'पाढे खेळ',
    navNumbers: 'संख्या ज्ञान',
    navNumberGames: 'संख्या खेळ',
    navPractice: 'सराव परीक्षा',
    navProgress: 'माझी प्रगती',
    navSettings: 'शिक्षक सेटिंग्ज',
    
    startTables: '▶ पाढे सुरू करा',
    playGames: '🎮 खेळ खेळा',
    learnNumbers: '🔢 संख्या शिका',
    viewProgress: '🏆 माझी प्रगती',
    selectTopic: 'एक उपक्रम निवडा',
    classroomMode: 'वर्गखोली स्मार्ट बोर्ड मोड',
    classroomModeDesc: 'मोठ्या फॉन्ट आणि सुलभ स्पर्श नियंत्रणांसह लक्षवेधी सादरीकरण.',
    
    tablesHeading: 'गुणाकार पाढे २ ते २०',
    tablesSubtitle: 'स्वयंचलित ताल (ऑटो-रिदम), चित्रे आणि व्हॉईस नियंत्रणासह शिका',
    selectTable: 'शिकण्यासाठी पाढा निवडा:',
    tableOf: 'चा पाढा',
    startPresentation: '🖥️ स्मार्ट बोर्ड सादरीकरण सुरू करा',
    exitPresentation: 'सादरीकरण बंद करा',
    autoRhythm: 'ऑटो रिदम मोड',
    autoRhythmOn: 'ऑटो रिदम: चालू',
    autoRhythmOff: 'ऑटो रिदम: बंद',
    autoPlayNextTable: 'पुढील पाढा ऑटो-प्ले करा',
    autoPlayNextDesc: 'पाढा संपल्यावर आपोआप पुढील पाढ्यावर (२ → २०) जा',
    tableCompletedNextIn: 'पाढा {table} पूर्ण! {sec} सेकंदात पुढील पाढा...',
    singleScreenMode: 'सिंगल स्क्रीन मोड',
    voiceMode: 'आवाज पठण मोड (Voice)',
    voiceModeOn: 'आवाज मोड: चालू (ऐकत आहे)',
    voiceModeOff: 'आवाज मोड: बंद',
    voiceListening: 'तुमच्या पठणाची वाट पाहत आहे... स्पष्ट उच्चार करा!',
    voicePrompt: 'म्हणा: "{example}"',
    voiceNotSupported: 'या ब्राउझरवर आवाज ओळख उपलब्ध नाही. ऑटो रिदम वापरला जात आहे.',
    micPermissionDenied: 'माइकची परवानगी नाकारली गेली. ऑटो रिदम वापरा.',
    readAloud: 'मोठ्याने वाचा (TTS)',
    speed: 'तालाचा वेग',
    speedSlow: '🐢 हळू (३.० सेकंद)',
    speedNormal: '🚶 मध्यम (२.० सेकंद)',
    speedFast: '🏃 जलद (१.२ सेकंद)',
    speedVeryFast: '⚡ अति जलद (०.६ सेकंद)',
    customTiming: 'कस्टम वेळ',
    visualMode: 'दृश्य संकल्पना मोड',
    visualExpl: 'चित्रात्मक संकल्पना स्पष्टीकरण',
    repeatedAddition: 'पुन्हा पुन्हा बेरीज',
    groupsOf: 'चे गट',
    
    play: 'सुरू करा',
    pause: 'थांबवा',
    next: 'पुढे',
    previous: 'मागे',
    restart: 'पुन्हा सुरू करा',
    fullscreen: 'पूर्ण स्क्रीन',
    exitFullscreen: 'पूर्ण स्क्रीन बंद',
    soundOn: 'आवाज: चालू',
    soundOff: 'आवाज: बंद',
    
    tableGamesHeading: 'परस्परसंवादी पाढे खेळ',
    tableGamesSubtitle: 'मजेशीर खेळांमधून पाढ्यांचा सराव पक्का करा',
    difficulty: 'काठिण्य पातळी',
    diffEasy: '🟢 सोपे (एक पाढा)',
    diffMedium: '🟡 मध्यम (निवडलेले पाढे)',
    diffHard: '🔴 कठीण (सर्व पाढे २-२०)',
    customTables: 'पाढे निवडा',
    
    gameFindAnswer: 'योग्य उत्तर निवडा',
    gameFindAnswerDesc: 'चार पर्यायांमधून योग्य गुणाकार पटकन निवडा',
    gameCompleteTable: 'पाढा पूर्ण करा',
    gameCompleteTableDesc: 'ओळीतील सुटलेली संख्या किंवा गुणाकार भरा',
    gameFallingNumbers: 'पडणाऱ्या संख्या (Falling Numbers)',
    gameFallingNumbersDesc: 'खाली पोहोचण्यापूर्वी योग्य फुग्यावर स्पर्श करा!',
    gameMatchPair: 'योग्य जोड्या लावा',
    gameMatchPairDesc: 'प्रश्नांना त्यांच्या योग्य उत्तरांशी जोडा',
    gameTableRace: 'पाढा शर्यत (Speed Race)',
    gameTableRaceDesc: 'वेळ संपण्यापूर्वी १० प्रश्नांची उत्तरे द्या',
    gameMissingNumber: 'गाळलेली संख्या शोधा',
    gameMissingNumberDesc: 'अज्ञात गुणक शोधा (उदा: ८ × ? = ५६)',
    gameTrueFalse: 'खरे की खोटे',
    gameTrueFalseDesc: 'गुणाकाराचे समीकरण बरोबर आहे का ते ओळखा',
    gameMemory: 'पाढा स्मरण खेळ (Memory)',
    gameMemoryDesc: 'कार्ड उलटून प्रश्न आणि उत्तरांच्या जोड्या शोधा',
    
    numberHeading: 'भारतीय स्थानिक किंमत व संख्याज्ञान',
    numberSubtitle: 'एकक ते १० कोटी (१ ते १०,००,००,०००) संख्यांवर प्रभुत्व मिळवा',
    indianSystem: 'भारतीय संख्या पद्धती',
    placeValueBoard: 'स्थानिक किंमत बोर्ड',
    explorePlaceValue: 'स्थानिक किमतीचे सविस्तर विश्लेषण',
    enterAnyNumber: '१० कोटींपर्यंत कोणतीही संख्या टाका:',
    randomNumber: '🎲 यादृच्छिक संख्या तयार करा',
    placeValue: 'स्थानिक किंमत (Place Value)',
    faceValue: 'दर्शनी किंमत (Face Value)',
    expandedForm: 'विस्तारित रूप',
    inWords: 'अक्षरी संख्या',
    clickDigitToLearn: 'स्थानिक किंमत आणि विस्तारित रूप पाहण्यासाठी कोणत्याही अंकावर स्पर्श करा!',
    
    numberGamesHeading: 'संख्या व स्थानिक किंमत खेळ',
    numberGamesSubtitle: 'स्थानिक किंमत, तुलना आणि संख्या क्रमासाठी मनोरंजक खेळ',
    gameIdentifyNumber: 'संख्या ओळखा',
    gameIdentifyNumberDesc: 'अक्षरी किंवा स्थानिक वर्णनावरून योग्य संख्या ओळखा',
    gamePlaceValue: 'स्थानिक किंमत प्रश्नमंजुषा',
    gamePlaceValueDesc: 'ठळक केलेल्या अंकाची अचूक स्थानिक किंमत सांगा',
    gameNumberBuilder: 'संख्या निर्माता (Number Builder)',
    gameNumberBuilderDesc: 'अंकांची कार्डे योग्य क्रमाने ठेवून सर्वात मोठी किंवा लहान संख्या बनवा',
    gameComparison: 'संख्यांची तुलना',
    gameComparisonDesc: '>, <, किंवा = चिन्हांचा वापर करून तुलना करा',
    gameSequence: 'संख्या क्रम पूर्ण करा',
    gameSequenceDesc: 'क्रमबद्ध मोजणीतील पुढची योग्य संख्या निवडा',
    gameNumberMemory: 'संख्या स्मरण खेळ',
    gameNumberMemoryDesc: 'दिसलेली संख्या लक्षात ठेवा आणि योग्य पर्याय निवडा',
    gameChallenge: 'भव्य गणित आव्हान',
    gameChallengeDesc: 'सर्व विषयांमधील १० संमिश्र प्रश्नांची वेळबद्ध चाचणी',
    
    makeLargest: 'सर्व अंक वापरून सर्वात मोठी संख्या तयार करा:',
    makeSmallest: 'सर्व अंक वापरून सर्वात लहान संख्या तयार करा:',
    whichIsGreater: 'योग्य तुलना चिन्ह निवडा:',
    memorizeIn: 'ही संख्या लक्षात ठेवा! अदृश्य होण्यास वेळ:',
    seconds: 'सेकंद',
    whatsTheNumber: 'तुम्ही कोणती संख्या पाहिली होती?',
    
    score: 'गुण',
    question: 'प्रश्न',
    of: 'पैकी',
    correct: 'बरोबर!',
    wrong: 'चूक प्रयत्न!',
    excellent: '🎉 खूप छान!',
    tryAgain: 'पुन्हा प्रयत्न करा!',
    streak: 'सलग बरोबर',
    timeRemaining: 'उरलेला वेळ',
    gameOver: 'आव्हान पूर्ण!',
    playAgain: 'पुन्हा खेळा',
    finalScore: 'अंतिम गुण',
    accuracy: 'अचूकता',
    bestScore: 'सर्वोत्कृष्ट गुण',
    
    progressHeading: 'विद्यार्थी प्रगती व पदके',
    progressSubtitle: 'तुमचे पाढे तारे, उच्चांक आणि पदके पहा',
    tablesMastered: 'पूर्ण केलेले पाढे',
    totalCalculations: 'एकूण सोडवलेले प्रश्न',
    accuracyRate: 'एकूण अचूकता',
    trophies: 'मिळालेली पदके व ट्रॉफी',
    exportData: 'प्रगती डेटा निर्यात करा (JSON)',
    importData: 'प्रगती डेटा आयात करा',
    resetProgress: 'प्रगती डेटा रीसेट करा',
    resetConfirm: 'तुम्हाला नक्की सर्व प्रगती आणि तारे रीसेट करायचे आहेत का?',
    dataExported: 'प्रगती डेटा यशस्वीरित्या निर्यात झाला!',
    dataImported: 'प्रगती डेटा यशस्वीरित्या आयात झाला!',
    
    settingsHeading: 'शिक्षक आणि वर्गखोली सेटिंग्ज',
    settingsSubtitle: 'भाषा, वेग, स्मार्ट बोर्ड प्रदर्शन आणि ऑडिओ प्राधान्ये सानुकूलित करा',
    languageSelect: 'भाषा निवडा',
    audioSettings: 'आवाज आणि उच्चार सेटिंग्ज',
    smartBoardSettings: 'वर्गखोली आणि स्मार्ट बोर्ड डिस्प्ले',
    highContrast: 'हाय कॉन्ट्रास्ट मोड',
    reducedMotion: 'कमी ॲनिमेशन (Reduced Motion)',
    pwaInstall: '📱 ॲप इन्स्टॉल करा (ऑफलाइन वापरासाठी)',
    pwaInstalled: 'ॲप इन्स्टॉल झाले आहे आणि ऑफलाइन तयार आहे',
    pwaOfflineReady: '१००% ऑफलाइन तयार. सर्व पाढे आणि खेळ इंटरनेटशिवाय चालतात.',
    installModalTitle: 'Smart Maths ॲप इन्स्टॉल करा',
    installModalSubtitle: '१००% ऑफलाइन वापर आणि पूर्ण-स्क्रीन अध्यापनासाठी तुमच्या फोन, टॅब्लेट, स्मार्ट बोर्ड किंवा संगणकावर इन्स्टॉल करा.',
    installNowBtn: 'आता ॲप इन्स्टॉल करा (1-Click)',
    installHowToTitle: 'तुमच्या डिव्हाइसवर कसे इन्स्टॉल करावे:',
    installAndroidStep: 'Android / Chrome: "आता ॲप इन्स्टॉल करा" वर टॅप करा किंवा मेनू (⋮) -> "App इन्स्टॉल करा" / "Add to Home screen" निवडा.',
    installIosStep: 'iPhone / iPad (Safari): खाली शेअर बटण (⎋ / 📤) दाबा -> खाली स्क्रोल करा -> "Add to Home Screen" (+) निवडा.',
    installDesktopStep: 'संगणक / स्मार्ट बोर्ड: ब्राउझरच्या ॲड्रेस बारमध्ये उजव्या बाजूला असलेल्या इन्स्टॉल चिन्हावर (⊕ / ⬇) क्लिक करा.',
    installFeatureOffline: '⚡ १००% ऑफलाइन: इंटरनेटशिवाय कधीही पाढे आणि खेळ शिका.',
    installFeatureFast: '🚀 त्वरित सुरू: जलद गतीने सुरू होते आणि गुण जतन राहतात.',
    installFeatureSafe: '🎯 स्मार्ट बोर्ड तयार: वर्गखोल्यांसाठी अडथळा-मुक्त पूर्ण-स्क्रीन अनुभव.',
    alreadyInstalled: 'Smart Maths ॲप या डिव्हाइसवर आधीच इन्स्टॉल आहे!',
    close: 'बंद करा'
  },
  
  ur: {
    appTitle: 'Smart Maths (Table and Numbers)',
    appSubtitle: 'کلاس رومز اور سمارٹ بورڈز کے لیے انٹرایکٹو ریاضی',
    tagline: 'بصری، دلچسپ اور پرلطف ریاضی کی مہارت',
    
    navTables: 'پہاڑے ۲ تا ۲۰',
    navTableGames: 'پہاڑوں کے کھیل',
    navNumbers: 'گنتی و اعداد',
    navNumberGames: 'اعداد کے کھیل',
    navPractice: 'مشقی امتحان',
    navProgress: 'میری پیش رفت',
    navSettings: 'اساتذہ کی ترتیبات',
    
    startTables: '▶ پہاڑے شروع کریں',
    playGames: '🎮 کھیل کھیلیں',
    learnNumbers: '🔢 اعداد سیکھیں',
    viewProgress: '🏆 میری پیش رفت',
    selectTopic: 'ایک سرگرمی منتخب کریں',
    classroomMode: 'کلاس روم سمارٹ بورڈ موڈ',
    classroomModeDesc: 'بڑے فونٹس اور ٹچ فرینڈلی بٹنوں کے ساتھ آسان تدریس۔',
    
    tablesHeading: 'ضرب کے پہاڑے ۲ تا ۲۰',
    tablesSubtitle: 'خودکار لے (Auto-Rhythm)، بصری اشکال اور آواز کے ساتھ سیکھیں',
    selectTable: 'سیکھنے کے لیے پہاڑا منتخب کریں:',
    tableOf: 'کا پہاڑا',
    startPresentation: '🖥️ سمارٹ بورڈ پریزنٹیشن شروع کریں',
    exitPresentation: 'پریزنٹیشن ختم کریں',
    autoRhythm: 'آٹو رِدم موڈ',
    autoRhythmOn: 'آٹو ردم: آن',
    autoRhythmOff: 'آٹو ردم: آف',
    autoPlayNextTable: 'اگلا پہاڑہ خودکار پلے کریں',
    autoPlayNextDesc: 'پہاڑہ مکمل ہونے پر خود بخود اگلے پہاڑے (۲ تا ۲۰) پر جائیں',
    tableCompletedNextIn: 'پہاڑہ {table} مکمل! {sec} سیکنڈ میں اگلا پہاڑہ...',
    singleScreenMode: 'سنگل سکرین میں فِٹ کریں',
    voiceMode: 'صوتی تلاوت موڈ (Voice)',
    voiceModeOn: 'وائس موڈ: آن (سن رہا ہے)',
    voiceModeOff: 'وائس موڈ: آف',
    voiceListening: 'آپ کی تلاوت کا انتظار ہے... واضح طور پر بولیں!',
    voicePrompt: 'بولیں: "{example}"',
    voiceNotSupported: 'اس براؤزر پر آواز کی شناخت دستیاب نہیں ہے۔ آٹو ردم استعمال کیا جا رہا ہے۔',
    micPermissionDenied: 'مائیکروفون کی اجازت نہیں ملی۔ آٹو ردم موڈ استعمال کریں۔',
    readAloud: 'بلند آواز میں سنیں (TTS)',
    speed: 'پڑھنے کی رفتار',
    speedSlow: '🐢 آہستہ (۳.۰ سیکنڈ)',
    speedNormal: '🚶 نارمل (۲.۰ سیکنڈ)',
    speedFast: '🏃 تیز (۱.۲ سیکنڈ)',
    speedVeryFast: '⚡ بہت تیز (۰.۶ سیکنڈ)',
    customTiming: 'اپنی مرضی کا وقت',
    visualMode: 'بصری تصور کا موڈ',
    visualExpl: 'بصری تصوراتی وضاحت',
    repeatedAddition: 'بار بار جمع کرنا',
    groupsOf: 'کے گروہ',
    
    play: 'شروع',
    pause: 'روکیں',
    next: 'اگلا',
    previous: 'پچھلا',
    restart: 'دوبارہ شروع',
    fullscreen: 'پوری سکرین',
    exitFullscreen: 'پوری سکرین سے باہر',
    soundOn: 'آواز: آن',
    soundOff: 'آواز: آف',
    
    tableGamesHeading: 'پہاڑوں کے دلچسپ کھیل',
    tableGamesSubtitle: 'مزیدار اور متحرک کھیلوں کے ذریعے ضرب کے پہاڑے پکے کریں',
    difficulty: 'مشکل کی سطح',
    diffEasy: '🟢 آسان (ایک پہاڑا)',
    diffMedium: '🟡 درمیانہ (منتخب پہاڑے)',
    diffHard: '🔴 مشکل (تمام پہاڑے ۲ تا ۲۰)',
    customTables: 'پہاڑے منتخب کریں',
    
    gameFindAnswer: 'صحیح جواب چنیں',
    gameFindAnswerDesc: 'چار اختیارات میں سے صحیح حاصل ضرب فوری منتخب کریں',
    gameCompleteTable: 'پہاڑا مکمل کریں',
    gameCompleteTableDesc: 'تسلسل میں چھوٹی ہوئی رقم یا حاصل ضرب درج کریں',
    gameFallingNumbers: 'گرتے ہوئے اعداد (Falling Numbers)',
    gameFallingNumbersDesc: 'نیچے پہنچنے سے پہلے صحیح بلبلے پر ٹیپ کریں!',
    gameMatchPair: 'جوڑے ملائیں',
    gameMatchPairDesc: 'سوالات کو ان کے درست جوابات سے جوڑیں',
    gameTableRace: 'پہاڑا ریس (Speed Race)',
    gameTableRaceDesc: 'وقت ختم ہونے سے پہلے ۱۰ سوالات کے درست جواب دیں',
    gameMissingNumber: 'چھپا ہوا عدد تلاش کریں',
    gameMissingNumberDesc: 'نامعلوم عدد تلاش کریں (مثلاً: ۷ × ؟ = ۵۶)',
    gameTrueFalse: 'صحیح یا غلط',
    gameTrueFalseDesc: 'معلوم کریں کہ کیا ضرب کا بیان درست ہے',
    gameMemory: 'یادداشت کا کھیل (Memory)',
    gameMemoryDesc: 'کارڈز پلٹ کر سوالات اور جوابات کے جوڑے تلاش کریں',
    
    numberHeading: 'ہندوستانی مقامی قیمت اور اعداد',
    numberSubtitle: 'اکائی سے لے کر ۱۰ کروڑ (۱ تا ۱۰،۰۰،۰۰،۰۰۰) تک اعداد پر مہارت',
    indianSystem: 'ہندوستانی عددی نظام',
    placeValueBoard: 'انٹرایکٹو مقامی قیمت کا بورڈ',
    explorePlaceValue: 'مقامی قیمت کا تفصیلی تجزیہ',
    enterAnyNumber: '۱۰ کروڑ تک کوئی بھی عدد درج کریں:',
    randomNumber: '🎲 خودکار عدد بنائیں',
    placeValue: 'مقامی قیمت (Place Value)',
    faceValue: 'ظاہری قیمت (Face Value)',
    expandedForm: 'توسیعی شکل',
    inWords: 'لفظوں میں عدد',
    clickDigitToLearn: 'مقامی قیمت اور توسیعی شکل دیکھنے کے لیے اوپر کسی بھی ہندسے پر ٹیپ کریں!',
    
    numberGamesHeading: 'اعداد اور مقامی قیمت کے کھیل',
    numberGamesSubtitle: 'مقامی قیمت، موازنہ اور عددی ترتیب کے لیے دلچسپ چیلنجز',
    gameIdentifyNumber: 'عدد کی شناخت کریں',
    gameIdentifyNumberDesc: 'الفاظ یا مقامی تفصیل کی بنیاد پر درست عدد چنیں',
    gamePlaceValue: 'مقامی قیمت کوئز',
    gamePlaceValueDesc: 'نمایاں ہندسے کی درست مقامی قیمت بتائیں',
    gameNumberBuilder: 'عدد بنانے کا کھیل (Number Builder)',
    gameNumberBuilderDesc: 'ہندسوں کے کارڈز ترتیب دے کر سب سے بڑا یا چھوٹا عدد بنائیں',
    gameComparison: 'اعداد کا موازنہ',
    gameComparisonDesc: '>, <, یا = علامتوں کے ذریعے دو اعداد کا موازنہ کریں',
    gameSequence: 'عددی سلسلہ مکمل کریں',
    gameSequenceDesc: 'گنتی کے سلسلے میں اگلا درست عدد چنیں',
    gameNumberMemory: 'عددی یادداشت کا کھیل',
    gameNumberMemoryDesc: 'چند سیکنڈ دکھائے گئے عدد کو یاد رکھیں اور درست جواب چنیں',
    gameChallenge: 'عظیم ریاضی چیلنج',
    gameChallengeDesc: 'تمام موضوعات سے ۱۰ سوالات پر مشتمل وقتی چیلنج',
    
    makeLargest: 'تمام ہندسوں کا استعمال کرتے ہوئے سب سے بڑا عدد بنائیں:',
    makeSmallest: 'تمام ہندسوں کا استعمال کرتے ہوئے سب سے چھوٹا عدد بنائیں:',
    whichIsGreater: 'موازنہ کی درست علامت منتخب کریں:',
    memorizeIn: 'اس عدد کو یاد رکھیں! غائب ہونے میں وقت باقی:',
    seconds: 'سیکنڈ',
    whatsTheNumber: 'آپ نے کون سا عدد دیکھا تھا؟',
    
    score: 'اسکور',
    question: 'سوال',
    of: 'از',
    correct: 'شاباش! درست',
    wrong: 'غلط کوشش!',
    excellent: '🎉 شاندار کارکردگی!',
    tryAgain: 'دوبارہ کوشش کریں!',
    streak: 'مسلسل درست',
    timeRemaining: 'باقی وقت',
    gameOver: 'چیلنج مکمل!',
    playAgain: 'دوبارہ کھیلیں',
    finalScore: 'فائنل اسکور',
    accuracy: 'درستگی',
    bestScore: 'بہترین اسکور',
    
    progressHeading: 'طالب علم کی پیش رفت اور تمغے',
    progressSubtitle: 'اپنے پہاڑوں کے ستارے، بلند ترین اسکور اور اعزازات دیکھیں',
    tablesMastered: 'مکمل کیے گئے پہاڑے',
    totalCalculations: 'کل حل شدہ سوالات',
    accuracyRate: 'مجموعی درستگی',
    trophies: 'حاصل کردہ بیجز اور ٹرافیاں',
    exportData: 'ڈیٹا ایکسپورٹ کریں (JSON)',
    importData: 'ڈیٹا امپورٹ کریں',
    resetProgress: 'پیش رفت ری سیٹ کریں',
    resetConfirm: 'کیا آپ واقعی تمام پیش رفت اور ستارے ری سیٹ کرنا چاہتے ہیں؟',
    dataExported: 'پیش رفت کا ڈیٹا کامیابی سے ایکسپورٹ ہو گیا!',
    dataImported: 'پیش رفت کا ڈیٹا کامیابی سے امپورٹ ہو گیا!',
    
    settingsHeading: 'اساتذہ اور کلاس روم کی ترتیبات',
    settingsSubtitle: 'زبان، رفتار، سمارٹ بورڈ ڈسپلے اور آڈیو ترجیحات تبدیل کریں',
    languageSelect: 'زبان منتخب کریں',
    audioSettings: 'آواز اور تلفظ کی ترتیبات',
    smartBoardSettings: 'کلاس روم اور سمارٹ بورڈ ڈسپلے',
    highContrast: 'ہائی کنٹراسٹ موڈ',
    reducedMotion: 'کم اینیمیشن (Reduced Motion)',
    pwaInstall: '📱 ایپ انسٹال کریں (آف لائن استعمال کے لیے)',
    pwaInstalled: 'ایپ انسٹال ہے اور آف لائن تیار ہے',
    pwaOfflineReady: '۱۰۰٪ آف لائن تیار۔ تمام پہاڑے، حسابات اور آوازیں بغیر انٹرنیٹ کے کام کرتی ہیں۔',
    installModalTitle: 'Smart Maths ایپ انسٹال کریں',
    installModalSubtitle: 'فون، ٹیبلٹ، سمارٹ بورڈ یا کمپیوٹر پر ۱۰۰٪ آف لائن استعمال اور فل سکرین تدریس کے لیے انسٹال کریں۔',
    installNowBtn: 'ابھی ایپ انسٹال کریں (1-Click)',
    installHowToTitle: 'اپنے ڈیوائس پر کیسے انسٹال کریں:',
    installAndroidStep: 'اینڈرائیڈ / کروم: "ابھی ایپ انسٹال کریں" پر ٹیپ کریں یا مینو (⋮) سے "App انسٹال کریں" یا "Add to Home screen" منتخب کریں۔',
    installIosStep: 'آئی فون / آئی پیڈ (سفاری): نیچے شیئر بٹن (⎋ / 📤) دبائیں -> نیچے اسکرول کریں -> "Add to Home Screen" (+) منتخب کریں۔',
    installDesktopStep: 'کمپیوٹر / سمارٹ بورڈ: براؤزر کے ایڈریس بار میں دائیں جانب موجود انسٹال آئیکن (⊕ / ⬇) پر کلک کریں۔',
    installFeatureOffline: '⚡ ۱۰۰٪ آف لائن: انٹرنیٹ کے بغیر کہیں بھی پہاڑے اور کھیل سیکھیں۔',
    installFeatureFast: '🚀 فوری اوپن: بغیر کسی تاخیر کے فوراً کھلتی ہے اور ریکارڈ محفوظ رہتا ہے۔',
    installFeatureSafe: '🎯 سمارٹ بورڈ کے لیے تیار: کلاس رومز کے لیے فل سکرین بلاتعطل تدریس۔',
    alreadyInstalled: 'Smart Maths ایپ اس ڈیوائس پر پہلے سے انسٹال ہے!',
    close: 'بند کریں'
  }
};
