// schemas/dailyFengShuiTip.js
export default {
  name: 'dailyFengShuiTip',
  title: 'Daily Feng Shui Tip',
  type: 'document',
  fields: [
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'tip',
      title: 'Feng Shui Tip',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }
  ]
};
