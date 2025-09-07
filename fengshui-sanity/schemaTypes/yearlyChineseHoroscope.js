// schemas/yearlyChineseHoroscope.js
export default {
  name: 'yearlyChineseHoroscope',
  title: 'Yearly Chinese Horoscope',
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
	{
		name: 'overviewContentCn',
		title: 'Overview (CN)',
		type: 'text',
	},
	{
		name: 'loveContentCn',
		title: 'Love (CN)',
		type: 'text',
	},
	{
		name: 'careerContentCn',
		title: 'Career (CN)',
		type: 'text',
	},
	{
		name: 'wealthContentCn',
		title: 'Wealth (CN)',
		type: 'text',
	},
	{
		name: 'socialContentCn',
		title: 'Social (CN)',
		type: 'text',
	},
	{
		name: 'luckyColorCn',
		title: 'Lucky Color (CN)',
		type: 'string',
	},
	{
		name: 'luckyNumberCn',
		title: 'Lucky Number (CN)',
		type: 'string',
	},
  ],
};