import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type LanguageCode = 'en' | 'hi' | 'bn' | 'ta' | 'mr';

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    'hero.title.start': 'Find the right',
    'hero.title.highlight': 'Indian Standard',
    'hero.title.end': 'for every tender',
    'hero.subtitle': 'AI-powered BIS standard recommendations, certification guidance, and cross-reference intelligence for government procurement.',
    
    'search.title': 'Find Standards Faster',
    'search.subtitle': 'Search with technical specs, item descriptions, or upload a tender document.',
    'search.placeholder': 'Paste your tender specification or describe the item to be procured...',
    'search.dropzone': 'Drop a PDF or DOCX file here',
    'search.browse': 'or browse files',
    'search.regional.title': 'Regional Language Support',
    'search.regional.desc': 'Search Indian Standards using descriptions in your native language.',
    
    'nav.home': 'Home',
    'nav.basket': 'Basket',
    'nav.admin': 'Admin',
  },
  hi: {
    'hero.title.start': 'हर निविदा के लिए सही',
    'hero.title.highlight': 'भारतीय मानक',
    'hero.title.end': 'खोजें',
    'hero.subtitle': 'सरकारी खरीद के लिए एआई-संचालित बीआईएस मानक सिफारिशें, प्रमाणन मार्गदर्शन और क्रॉस-रेफरेंस इंटेलिजेंस।',
    
    'search.title': 'मानक तेजी से खोजें',
    'search.subtitle': 'तकनीकी विनिर्देशों, आइटम विवरण के साथ खोजें, या निविदा दस्तावेज़ अपलोड करें।',
    'search.placeholder': 'अपना निविदा विनिर्देश पेस्ट करें या खरीदे जाने वाले आइटम का वर्णन करें...',
    'search.dropzone': 'यहां PDF या DOCX फ़ाइल छोड़ें',
    'search.browse': 'या फ़ाइलें ब्राउज़ करें',
    'search.regional.title': 'क्षेत्रीय भाषा समर्थन',
    'search.regional.desc': 'अपनी मूल भाषा में विवरण का उपयोग करके भारतीय मानक खोजें।',
    
    'nav.home': 'होम',
    'nav.basket': 'बास्केट',
    'nav.admin': 'व्यवस्थापक',
  },
  bn: {
    'hero.title.start': 'প্রতিটি টেন্ডারের জন্য সঠিক',
    'hero.title.highlight': 'ভারতীয় মান',
    'hero.title.end': 'খুঁজুন',
    'hero.subtitle': 'সরকারী ক্রয়ের জন্য এআই-চালিত বিআইএস মান সুপারিশ, শংসাপত্র নির্দেশিকা এবং ক্রস-রেফারেন্স ইন্টেলিজেন্স।',
    
    'search.title': 'দ্রুত মান খুঁজুন',
    'search.subtitle': 'প্রযুক্তিগত বৈশিষ্ট্য, আইটেম বিবরণ সহ অনুসন্ধান করুন, অথবা একটি টেন্ডার নথি আপলোড করুন।',
    'search.placeholder': 'আপনার টেন্ডার স্পেসিফিকেশন পেস্ট করুন বা কেনার আইটেম বর্ণনা করুন...',
    'search.dropzone': 'এখানে PDF বা DOCX ফাইল দিন',
    'search.browse': 'বা ফাইল ব্রাউজ করুন',
    'search.regional.title': 'আঞ্চলিক ভাষা সমর্থন',
    'search.regional.desc': 'আপনার মাতৃভাষায় বিবরণ ব্যবহার করে ভারতীয় মান খুঁজুন।',
    
    'nav.home': 'হোম',
    'nav.basket': 'বাস্কেট',
    'nav.admin': 'অ্যাডমিন',
  },
  ta: {
    'hero.title.start': 'ஒவ்வொரு டெண்டருக்கும் சரியான',
    'hero.title.highlight': 'இந்திய தரத்தை',
    'hero.title.end': 'கண்டறியவும்',
    'hero.subtitle': 'அரசு கொள்முதலுக்கான AI- இயங்கும் BIS நிலையான பரிந்துரைகள், சான்றிதழ் வழிகாட்டுதல் மற்றும் குறுக்கு குறிப்பு நுண்ணறிவு.',
    
    'search.title': 'தரங்களை வேகமாக கண்டறியவும்',
    'search.subtitle': 'தொழில்நுட்ப விவரக்குறிப்புகள், உருப்படி விளக்கங்களுடன் தேடவும் அல்லது டெண்டர் ஆவணத்தை பதிவேற்றவும்.',
    'search.placeholder': 'உங்கள் டெண்டர் விவரக்குறிப்பை ஒட்டவும் அல்லது வாங்க வேண்டிய பொருளை விவரிக்கவும்...',
    'search.dropzone': 'PDF அல்லது DOCX கோப்பை இங்கே விடவும்',
    'search.browse': 'அல்லது கோப்புகளை உலாவவும்',
    'search.regional.title': 'பிராந்திய மொழி ஆதரவு',
    'search.regional.desc': 'உங்கள் தாய்மொழியில் விளக்கங்களைப் பயன்படுத்தி இந்திய தரங்களைத் தேடுங்கள்.',
    
    'nav.home': 'முகப்பு',
    'nav.basket': 'கூடை',
    'nav.admin': 'நிர்வாகம்',
  },
  mr: {
    'hero.title.start': 'प्रत्येक निविदेसाठी योग्य',
    'hero.title.highlight': 'भारतीय मानक',
    'hero.title.end': 'शोधा',
    'hero.subtitle': 'सरकारी खरेदीसाठी AI-सक्षम BIS मानक शिफारसी, प्रमाणपत्र मार्गदर्शन आणि क्रॉस-रेफरन्स इंटेलिजेंस.',
    
    'search.title': 'मानके वेगाने शोधा',
    'search.subtitle': 'तांत्रिक तपशील, आयटम वर्णनांसह शोधा किंवा निविदा दस्तऐवज अपलोड करा.',
    'search.placeholder': 'तुमचे निविदा तपशील पेस्ट करा किंवा खरेदी करायच्या वस्तूचे वर्णन करा...',
    'search.dropzone': 'येथे PDF किंवा DOCX फाईल सोडा',
    'search.browse': 'किंवा फाईल्स ब्राउझ करा',
    'search.regional.title': 'प्रादेशिक भाषा समर्थन',
    'search.regional.desc': 'तुमच्या मातृभाषेत वर्णन वापरून भारतीय मानके शोधा.',
    
    'nav.home': 'मुख्यपृष्ठ',
    'nav.basket': 'बास्केट',
    'nav.admin': 'प्रशासन',
  }
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const t = useCallback((key: string) => {
    return translations[language][key] || translations['en'][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
