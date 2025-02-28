import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

interface HistoricalContextProps {
  context: string;
}

const HistoricalContext: React.FC<HistoricalContextProps> = ({ context }) => {
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const isLongText = context.length > 300;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      }
    }
  };

  const contentVariants = {
    collapsed: { 
      height: '100px', 
      overflow: 'hidden' 
    },
    expanded: { 
      height: 'auto',
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      className="w-full max-w-2xl mx-auto p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-start space-x-4 rtl:space-x-reverse">
        <div className="flex-shrink-0">
          <Info className="w-6 h-6 text-blue-500" />
        </div>
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {language === 'en' ? 'Historical Context' : 'السياق التاريخي'}
          </h3>
          
          <motion.div 
            className="relative"
            variants={isLongText ? contentVariants : {}}
            initial={isLongText && !expanded ? "collapsed" : "expanded"}
            animate={isLongText && !expanded ? "collapsed" : "expanded"}
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{context}</p>
            
            {isLongText && !expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
            )}
          </motion.div>
          
          {isLongText && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mt-2"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>{language === 'en' ? 'Show less' : 'عرض أقل'}</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>{language === 'en' ? 'Read more' : 'قراءة المزيد'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HistoricalContext;