import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Shuffle } from 'lucide-react';
import { TimelineFormData } from '../types';
import { useLanguage } from '../context/LanguageContext';

const palestinianCities = {
  en: [
    'Jerusalem',
    'Gaza',
    'Ramallah',
    'Bethlehem',
    'Hebron',
    'Nablus',
    'Jericho',
    'Jenin',
    'Tulkarm',
    'Qalqilya'
  ],
  ar: [
    'القدس',
    'غزة',
    'رام الله',
    'بيت لحم',
    'الخليل',
    'نابلس',
    'أريحا',
    'جنين',
    'طولكرم',
    'قلقيلية'
  ]
};

const TimelineForm: React.FC<{ onSubmit: (data: TimelineFormData) => void }> = ({ onSubmit }) => {
  const { language } = useLanguage();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TimelineFormData>();

  const randomizeFields = () => {
    const currentYear = new Date().getFullYear();
    const randomYear = Math.floor(Math.random() * (currentYear - 1900 + 1)) + 1900;
    const randomAge = Math.floor(Math.random() * 80) + 1;
    const randomSex = Math.random() < 0.5 ? 'male' : 'female';
    const cities = palestinianCities[language as keyof typeof palestinianCities];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];

    setValue('year', randomYear);
    setValue('age', randomAge);
    setValue('sex', randomSex);
    setValue('city', randomCity);
  };

  const formVariants = {
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

  const buttonVariants = {
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { 
      scale: 0.97,
      boxShadow: "0 5px 10px -3px rgba(0, 0, 0, 0.1), 0 2px 3px -2px rgba(0, 0, 0, 0.05)"
    }
  };

  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-lg mx-auto p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {language === 'en' ? 'Name' : 'الاسم'}
          </label>
          <input
            {...register('name', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">
              {language === 'en' ? 'Name is required' : 'الاسم مطلوب'}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {language === 'en' ? 'Age' : 'العمر'}
          </label>
          <input
            type="number"
            {...register('age', { required: true, min: 1, max: 120 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {language === 'en' ? 'Gender' : 'الجنس'}
          </label>
          <select
            {...register('sex')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            <option value="male">{language === 'en' ? 'Male' : 'ذكر'}</option>
            <option value="female">{language === 'en' ? 'Female' : 'أنثى'}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {language === 'en' ? 'City' : 'المدينة'}
          </label>
          <select
            {...register('city')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {palestinianCities[language as keyof typeof palestinianCities].map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {language === 'en' ? 'Year' : 'السنة'}
          </label>
          <input
            type="number"
            {...register('year', { required: true, min: 1900, max: 2050 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="submit"
            className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            {language === 'en' ? 'Travel' : 'سافر'}
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="button"
            onClick={randomizeFields}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            <Shuffle className="w-4 h-4" />
            <span className="sr-only">{language === 'en' ? 'Randomize' : 'عشوائي'}</span>
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
};

export default TimelineForm;