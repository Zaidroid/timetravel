const OPENROUTER_API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const generateNarrative = async (prompt: string) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Palestine Time Travel Simulator'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-pro-exp-02-05:free',
        messages: [
          {
            role: 'system',
            content: 'You are a historical narrative generator specializing in Palestinian history and tourism. Create engaging, accurate, and respectful narratives about life and travel in Palestine across different time periods.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};

export const generateTravelItinerary = async (city: string, date: string, language: string) => {
  const prompt = language === 'en'
    ? `Create a detailed travel itinerary for ${city}, Palestine on ${date} including:
       - Hour-by-hour schedule from morning to evening
       - Popular attractions and hidden gems
       - Local restaurant recommendations with signature dishes
       - Transportation options
       - Weather-appropriate activities
       - Estimated costs in ILS and USD
       - Cultural etiquette tips
       Please format the response as a structured JSON object.`
    : `قم بإنشاء جدول رحلة مفصل لمدينة ${city}، فلسطين في ${date} يتضمن:
       - جدول زمني ساعة بساعة
       - المعالم السياحية الشهيرة والخفية
       - توصيات المطاعم المحلية مع الأطباق المميزة
       - خيارات المواصلات
       - أنشطة مناسبة للطقس
       - التكاليف التقديرية بالشيكل والدولار
       - نصائح عن آداب وتقاليد المجتمع
       يرجى تنسيق الرد كـ JSON منظم.`;

  try {
    const response = await generateNarrative(prompt);
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating travel itinerary:', error);
    throw error;
  }
};