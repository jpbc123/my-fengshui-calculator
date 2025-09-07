//schemas/yearlyWesternHoroscope.js
export default {
  name: 'yearlyWesternHoroscope',
  title: 'Yearly Western Horoscope',
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
      name: 'year',
      title: 'Year',
      type: 'number',
    },
    {
      name: 'overviewContent',
      title: 'Overview',
      type: 'text',
    },
    {
      name: 'loveContent',
      title: 'Love',
      type: 'text',
    },
    {
      name: 'careerContent',
      title: 'Career',
      type: 'text',
    },
    {
      name: 'wealthContent',
      title: 'Wealth',
      type: 'text',
    },
    {
      name: 'socialContent',
      title: 'Social',
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
