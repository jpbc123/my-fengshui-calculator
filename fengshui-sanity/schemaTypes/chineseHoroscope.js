// schemas/chineseHoroscope.js
export default {
    name: 'chineseHoroscope',
    type: 'document',
    title: 'Chinese Horoscope',
    fields: [
      { name: 'sign', type: 'string', title: 'Zodiac Sign' },
      { name: 'period', type: 'string', title: 'Period', options: { list: ['daily', 'weekly', 'yearly'] } },
  
      // Daily
      { name: 'for_date', type: 'date', title: 'For Date' },
  
      // Weekly
      { name: 'start_date', type: 'date', title: 'Start Date' },
      { name: 'end_date', type: 'date', title: 'End Date' },
  
      // Yearly
      { name: 'year', type: 'number', title: 'Year' },
  
      // Horoscope texts
      { name: 'horoscope', type: 'text', title: 'Horoscope (CN)' },
      { name: 'horoscope_en', type: 'text', title: 'Horoscope (EN)' },
      { name: 'love', type: 'text', title: 'Love (CN)' },
      { name: 'love_en', type: 'text', title: 'Love (EN)' },
      { name: 'career', type: 'text', title: 'Career (CN)' },
      { name: 'career_en', type: 'text', title: 'Career (EN)' },
      { name: 'money', type: 'text', title: 'Wealth (CN)' },
      { name: 'money_en', type: 'text', title: 'Wealth (EN)' },
      { name: 'social', type: 'text', title: 'Social (CN)' },
      { name: 'social_en', type: 'text', title: 'Social (EN)' },
  
      // Lucky fields
      { name: 'lucky_color', type: 'string', title: 'Lucky Color (CN)' },
      { name: 'lucky_color_en', type: 'string', title: 'Lucky Color (EN)' },
      { name: 'lucky_number', type: 'string', title: 'Lucky Number (CN)' },
      { name: 'lucky_number_en', type: 'string', title: 'Lucky Number (EN)' },
  
      { name: 'updated_at', type: 'datetime', title: 'Last Updated' }
    ]
  };
  