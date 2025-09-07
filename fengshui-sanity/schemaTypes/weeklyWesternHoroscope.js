export default {
  name: 'weeklyWesternHoroscope',
  title: 'Weekly Western Horoscope',
  type: 'document',
  fields: [
    {
      name: 'sign',
      title: 'Zodiac Sign',
      type: 'string',
      options: {
        list: [
          { title: 'Aries', value: 'aries' },
          { title: 'Taurus', value: 'taurus' },
          { title: 'Gemini', value: 'gemini' },
          { title: 'Cancer', value: 'cancer' },
          { title: 'Leo', value: 'leo' },
          { title: 'Virgo', value: 'virgo' },
          { title: 'Libra', value: 'libra' },
          { title: 'Scorpio', value: 'scorpio' },
          { title: 'Sagittarius', value: 'sagittarius' },
          { title: 'Capricorn', value: 'capricorn' },
          { title: 'Aquarius', value: 'aquarius' },
          { title: 'Pisces', value: 'pisces' },
        ],
        layout: 'dropdown'
      },
    },
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
    },
    {
      name: 'endDate',
      title: 'End Date',
      type: 'date',
    },
    {
      name: 'horoscope',
      title: 'Horoscope',
      type: 'text',
    },
    {
      name: 'money',
      title: 'Money',
      type: 'text',
    },
    {
      name: 'social',
      title: 'Social',
      type: 'text',
    },
    {
      name: 'career',
      title: 'Career',
      type: 'text',
    },
    {
      name: 'love',
      title: 'Love',
      type: 'text',
    },
    {
      name: 'luckyColor',
      title: 'Lucky Color',
      type: 'string',
    },
    {
      name: 'luckyNumber',
      title: 'Lucky Number',
      type: 'number',
    },
  ],
};
