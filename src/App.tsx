import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import TimelineForm from './components/TimelineForm';
import OutputSection from './components/OutputSection';
import HistoricalContext from './components/HistoricalContext';
import AnalyticsWidget from './components/AnalyticsWidget';
import VisualGallery from './components/VisualGallery';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { TimelineFormData } from './types';
import { generateNarrative } from './services/api';

function App() {
  const [narrative, setNarrative] = useState('');
  const [loading, setLoading] = useState(false);
  const [historicalContext, setHistoricalContext] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState<TimelineFormData | null>(null);

  const handleSubmit = async (data: TimelineFormData) => {
    setLoading(true);
    setFormData(data);
    try {
      // Generate prompts based on the current language
      const language = document.documentElement.dir === 'rtl' ? 'ar' : 'en';
      
      let narrativePrompt = '';
      let contextPrompt = '';
      
      if (language === 'en') {
        narrativePrompt = `Write a short personal story (maximum 300 words) from the perspective of a ${data.age}-year-old ${data.sex} named ${data.name} living in ${data.city}, Palestine in ${data.year}. The story should:
          - Be written in first person ("I")
          - Include authentic Palestinian daily life, traditions, and cultural experiences
          - Reference historical events of that time period and their personal impact
          - Mention local landmarks, foods, and customs specific to ${data.city}
          - Show family dynamics and community relationships
          - Be historically accurate while emotionally engaging
          - Highlight both challenges and moments of joy
          Write in English and keep the total length under 300 words.`;
        
        contextPrompt = `Provide a brief historical context (maximum 100 words) about Palestine in ${data.year}, specifically around ${data.city}. Include key historical events, social conditions, and cultural aspects of that period. Keep it concise, informative, and historically accurate. Write in English.`;
      } else {
        narrativePrompt = `اكتب قصة شخصية قصيرة (بحد أقصى 300 كلمة) من منظور ${data.sex === 'male' ? 'رجل' : 'امرأة'} يبلغ من العمر ${data.age} عامًا واسمه/ها ${data.name} يعيش في ${data.city}، فلسطين في عام ${data.year}. يجب أن تكون القصة:
          - مكتوبة بصيغة المتكلم ("أنا")
          - تتضمن الحياة اليومية الفلسطينية الأصيلة والتقاليد والتجارب الثقافية
          - تشير إلى الأحداث التاريخية في تلك الفترة وتأثيرها الشخصي
          - تذكر المعالم المحلية والأطعمة والعادات الخاصة بـ ${data.city}
          - تظهر ديناميكيات العائلة والعلاقات المجتمعية
          - دقيقة تاريخياً مع الحفاظ على التفاعل العاطفي
          - تسلط الضوء على التحديات ولحظات الفرح
          اكتب باللغة العربية واحتفظ بالطول الإجمالي أقل من 300 كلمة.`;
        
        contextPrompt = `قدم سياقًا تاريخيًا موجزًا (بحد أقصى 100 كلمة) عن فلسطين في عام ${data.year}، وخاصة حول ${data.city}. اشمل الأحداث التاريخية الرئيسية والظروف الاجتماعية والجوانب الثقافية لتلك الفترة. اجعله موجزًا ومفيدًا ودقيقًا تاريخيًا. اكتب باللغة العربية.`;
      }
      
      const [narrativeResponse, contextResponse] = await Promise.all([
        generateNarrative(narrativePrompt),
        generateNarrative(contextPrompt)
      ]);
      
      setNarrative(narrativeResponse);
      setHistoricalContext(contextResponse);
      setHasSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
          <Header />
          
          <main className="container mx-auto px-4 pt-24 pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <TimelineForm onSubmit={handleSubmit} />
                
                {(hasSubmitted || loading) && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                  >
                    <OutputSection 
                      narrative={narrative} 
                      loading={loading} 
                      title="Time Travel Narrative"
                      icon="Book"
                    />
                    
                    {historicalContext && !loading && (
                      <HistoricalContext context={historicalContext} />
                    )}
                    
                    {hasSubmitted && !loading && formData && (
                      <>
                        <AnalyticsWidget 
                          year={formData.year} 
                          city={formData.city} 
                        />
                        
                        <VisualGallery 
                          year={formData.year} 
                          city={formData.city} 
                        />
                      </>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;