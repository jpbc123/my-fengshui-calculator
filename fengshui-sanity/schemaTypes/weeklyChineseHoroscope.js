// schemas/weeklyChineseHoroscope.js
export default {
  name: 'weeklyChineseHoroscope',
  title: 'Weekly Chinese Horoscope',
  type: 'document',
  fields: [
    {
      name: 'sign',
      title: 'Zodiac Sign',
      type: 'string',
      options: {
        list: [
          { title: 'Rat', value: 'rat' },
          { title: 'Ox', value: 'ox' },
          { title: 'Tiger', value: 'tiger' },
          { title: 'Rabbit', value: 'rabbit' },
          { title: 'Dragon', value: 'dragon' },
          { title: 'Snake', value: 'snake' },
          { title: 'Horse', value: 'horse' },
          { title: 'Goat', value: 'goat' },
          { title: 'Monkey', value: 'monkey' },
          { title: 'Rooster', value: 'rooster' },
          { title: 'Dog', value: 'dog' },
          { title: 'Pig', value: 'pig' },
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
      title: 'Horoscope (CN)',
      type: 'text',
    },
    {
      name: 'horoscopeEn',
      title: 'Horoscope (English)',
      type: 'text',
    },
    // The tables also show `money`, `social`, `career`, and `love` fields, so they are added here
    {
      name: 'money',
      title: 'Money (CN)',
      type: 'text',
    },
    {
      name: 'social',
      title: 'Social (CN)',
      type: 'text',
    },
    {
      name: 'career',
      title: 'Career (CN)',
      type: 'text',
    },
    {
      name: 'love',
      title: 'Love (CN)',
      type: 'text',
    },
    {
      name: 'luckyColor',
      title: 'Lucky Color (CN)',
      type: 'string',
    },
    {
      name: 'luckyNumber',
      title: 'Lucky Number (CN)',
      type: 'string',
    },
    {
      name: 'moneyEn',
      title: 'Money (EN)',
      type: 'text',
    },
    {
      name: 'socialEn',
      title: 'Social (EN)',
      type: 'text',
    },
    {
      name: 'careerEn',
      title: 'Career (EN)',
      type: 'text',
    },
    {
      name: 'loveEn',
      title: 'Love (EN)',
      type: 'text',
    },
    {
      name: 'luckyColorEn',
      title: 'Lucky Color (EN)',
      type: 'string',
    },
    {
      name: 'luckyNumberEn',
      title: 'Lucky Number (EN)',
      type: 'string',
    },
  ],
};