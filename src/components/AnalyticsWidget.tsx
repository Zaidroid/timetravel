import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { BarChart, PieChart, TrendingUp, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { generateNarrative } from '../services/api';

interface AnalyticsWidgetProps {
  year: number;
  city: string;
}

interface AnalyticsData {
  demographicData: {
    [sector: string]: number;
  };
  populationData: {
    total: number;
    growth: string;
    urbanRate: string;
  };
  economicData: {
    gdpGrowth: string;
    inflation: string;
    unemployment: string;
  };
}

const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({ year, city }) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Create a prompt for Gemini to generate realistic historical analytics data
        const analyticsPrompt = language === 'en'
          ? `Generate realistic historical analytics data for ${city}, Palestine in the year ${year}. 
             Return the data as a valid JSON object with the following structure, and nothing else:
             {
               "demographicData": {
                 "Agriculture": 25.5,
                 "Manufacturing": 15.2,
                 "Services": 38.7,
                 "Government": 10.3,
                 "Other": 10.3
               },
               "populationData": {
                 "total": 120000,
                 "growth": "2.3",
                 "urbanRate": "65.2"
               },
               "economicData": {
                 "gdpGrowth": "3.5",
                 "inflation": "4.2",
                 "unemployment": "7.8"
               }
             }
             Ensure all percentages add up to 100% for demographicData. Make the data historically plausible for the region and time period. Format strictly as valid JSON with no additional text.`
          : `قم بإنشاء بيانات تحليلية تاريخية واقعية لمدينة ${city}، فلسطين في عام ${year}.
             أعد البيانات على شكل كائن JSON صالح بالهيكل التالي، وبدون أي محتوى إضافي:
             {
               "demographicData": {
                 "الزراعة": 25.5,
                 "الصناعة": 15.2,
                 "الخدمات": 38.7,
                 "الحكومة": 10.3,
                 "أخرى": 10.3
               },
               "populationData": {
                 "total": 120000,
                 "growth": "2.3",
                 "urbanRate": "65.2"
               },
               "economicData": {
                 "gdpGrowth": "3.5",
                 "inflation": "4.2",
                 "unemployment": "7.8"
               }
             }
             تأكد من أن جميع النسب المئوية تصل إلى 100٪ للبيانات الديموغرافية. اجعل البيانات محتملة تاريخياً للمنطقة والفترة الزمنية. التنسيق بشكل صارم كـ JSON صالح بدون نص إضافي.`;

        // Fetch data from Gemini API
        const response = await generateNarrative(analyticsPrompt);
        
        // Parse the JSON response
        // Need to handle potential JSON embedded in text
        let jsonData: AnalyticsData;
        try {
          // Try to parse the direct response
          jsonData = JSON.parse(response);
        } catch (e) {
          // If that fails, try to extract JSON from text
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            jsonData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('Could not parse JSON data from API response');
          }
        }
        
        setData(jsonData);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data');
        
        // Fallback to simulated data
        const fallbackData: AnalyticsData = {
          demographicData: {
            'Agriculture': 45 - (Math.max(0, (year - 1900) / 10)),
            'Manufacturing': 10 + (Math.min(25, (year - 1900) / 8)),
            'Services': 15 + (Math.min(40, (year - 1900) / 5)),
            'Government': 10 + (Math.min(15, (year - 1900) / 20)),
            'Other': 20 - (Math.min(15, (year - 1900) / 15))
          },
          populationData: {
            total: Math.round(50000 + (year - 1900) * 1000 * (1 + Math.sin(year / 30) * 0.2)),
            growth: (2 + Math.sin(year / 20) * 1.5).toFixed(1),
            urbanRate: Math.min(95, 30 + (year - 1900) / 3).toFixed(1)
          },
          economicData: {
            gdpGrowth: (3 + Math.sin(year / 15) * 2).toFixed(1),
            inflation: (Math.max(1, 5 + Math.sin(year / 10) * 4)).toFixed(1),
            unemployment: (Math.max(4, 10 + Math.sin(year / 25) * 6)).toFixed(1)
          }
        };
        
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [year, city, language]);

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

  const barVariants = {
    hidden: { width: 0 },
    visible: (custom: number) => ({
      width: `${custom}%`,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1],
        delay: 0.3
      }
    })
  };

  const contentVariants = {
    collapsed: { 
      height: '250px', 
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

  if (loading) {
    return (
      <motion.div
        variants={cardVariants}
        className="w-full max-w-2xl mx-auto p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </motion.div>
    );
  }

  // If no data is available, show error
  if (!data) {
    return (
      <motion.div
        variants={cardVariants}
        className="w-full max-w-2xl mx-auto p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-center h-32 text-red-500">
          {error || 'Failed to load analytics data'}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      className="w-full max-w-2xl mx-auto p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {language === 'en' ? `${city} Analytics (${year})` : `تحليلات ${city} (${year})`}
          </h2>
        </div>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span className="text-sm">{language === 'en' ? 'Show less' : 'عرض أقل'}</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span className="text-sm">{language === 'en' ? 'Show more' : 'عرض المزيد'}</span>
            </>
          )}
        </button>
      </div>

      <motion.div
        variants={contentVariants}
        initial={!expanded ? "collapsed" : "expanded"}
        animate={!expanded ? "collapsed" : "expanded"}
        className="relative"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Demographic Data */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-purple-500" />
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                {language === 'en' ? 'Employment by Sector' : 'التوظيف حسب القطاع'}
              </h3>
            </div>
            
            <div className="space-y-3">
              {Object.entries(data.demographicData).map(([sector, percentage]) => (
                <div key={sector} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{sector}</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      custom={percentage}
                      variants={barVariants}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Population Data */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <PieChart className="w-5 h-5 text-green-500" />
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                {language === 'en' ? 'Population Statistics' : 'إحصائيات السكان'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {language === 'en' ? 'Total Population' : 'إجمالي السكان'}
                </span>
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {data.populationData.total.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {language === 'en' ? 'Annual Growth' : 'النمو السنوي'}
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {data.populationData.growth}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {language === 'en' ? 'Urbanization Rate' : 'معدل التحضر'}
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {data.populationData.urbanRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Economic Indicators */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              {language === 'en' ? 'Economic Indicators' : 'المؤشرات الاقتصادية'}
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'en' ? 'GDP Growth' : 'نمو الناتج المحلي'}
              </div>
              <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                {data.economicData.gdpGrowth}%
              </div>
            </div>
            
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'en' ? 'Inflation' : 'التضخم'}
              </div>
              <div className="text-xl font-semibold text-purple-600 dark:text-purple-400">
                {data.economicData.inflation}%
              </div>
            </div>
            
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'en' ? 'Unemployment' : 'البطالة'}
              </div>
              <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                {data.economicData.unemployment}%
              </div>
            </div>
          </div>
        </div>
        
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsWidget;
