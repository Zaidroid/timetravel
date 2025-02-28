import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, Copy, Book, Clock, Map, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface OutputSectionProps {
  narrative: string;
  loading: boolean;
  title?: string;
  icon?: 'Book' | 'Clock' | 'Map' | 'Info';
}

const OutputSection: React.FC<OutputSectionProps> = ({ 
  narrative, 
  loading, 
  title = 'Narrative',
  icon = 'Book'
}) => {
  const { language } = useLanguage();
  const wordCount = narrative.split(/\s+/).length;
  const [expanded, setExpanded] = useState(false);
  const isLongText = narrative.length > 500;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(narrative);
  };

  const handleDownload = () => {
    const blob = new Blob([narrative], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'time-travel-narrative.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getIcon = () => {
    switch (icon) {
      case 'Book': return <Book className="w-6 h-6 text-blue-500" />;
      case 'Clock': return <Clock className="w-6 h-6 text-blue-500" />;
      case 'Map': return <Map className="w-6 h-6 text-blue-500" />;
      case 'Info': return <Info className="w-6 h-6 text-blue-500" />;
      default: return <Book className="w-6 h-6 text-blue-500" />;
    }
  };

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
      height: '150px', 
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
      <div className="flex items-center gap-3 mb-4">
        {getIcon()}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {language === 'en' ? title : 'السرد الزمني'}
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : narrative ? (
        <>
          <motion.div 
            className="prose dark:prose-invert max-w-none mb-4 relative"
            variants={isLongText ? contentVariants : {}}
            initial={isLongText && !expanded ? "collapsed" : "expanded"}
            animate={isLongText && !expanded ? "collapsed" : "expanded"}
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{narrative}</p>
            
            {isLongText && !expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
            )}
          </motion.div>
          
          {isLongText && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-4"
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
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {language === 'en' ? `${wordCount} words` : `${wordCount} كلمة`}
            </div>
            
            <div className="flex space-x-2 rtl:space-x-reverse">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Copy to clipboard"
              >
                <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Download narrative"
              >
                <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {}}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Share narrative"
              >
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          {language === 'en' 
            ? 'Fill out the form to generate your time travel narrative'
            : 'املأ النموذج لإنشاء سردك للسفر عبر الزمن'}
        </div>
      )}
    </motion.div>
  );
};

export default OutputSection;