const GOOGLE_API_KEY = 'AIzaSyCKEBb6anXZXabriqGlGMH4Oe8SyC5fCPw';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro-exp-02-05:generateContent';

export const generateNarrative = async (prompt: string) => {
  try {
    const response = await fetch(`${API_URL}?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are a historical narrative generator specializing in Palestinian history and tourism. Create concise, engaging, accurate, and respectful narratives about life and travel in Palestine across different time periods.

IMPORTANT INSTRUCTIONS:
1. Start directly with the historical narrative - do NOT include any explanatory text about what you're doing
2. Keep responses brief (150-250 words maximum) and highly specific to the time period and location mentioned
3. Focus on daily life, cultural practices, architectural features, and historical context
4. Include sensory details that transport the reader to that time and place
5. Avoid generalizations - provide specific, factual details wherever possible
6. Do not include any meta-commentary about your response or how it was generated

${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
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
       Please format the response as a structured JSON object without any explanatory text.`
    : `قم بإنشاء جدول رحلة مفصل لمدينة ${city}، فلسطين في ${date} يتضمن:
       - جدول زمني ساعة بساعة
       - المعالم السياحية الشهيرة والخفية
       - توصيات المطاعم المحلية مع الأطباق المميزة
       - خيارات المواصلات
       - أنشطة مناسبة للطقس
       - التكاليف التقديرية بالشيكل والدولار
       - نصائح عن آداب وتقاليد المجتمع
       يرجى تنسيق الرد كـ JSON منظم وبدون أي نص توضيحي.`;

  try {
    const response = await generateNarrative(prompt);
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating travel itinerary:', error);
    throw error;
  }
};
