// ./schemas/dailyWisdom.js
export default {
  name: 'dailyWisdom',
  title: 'Daily Wisdom',
  type: 'document',
  fields: [
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'quote',
      title: 'Quote',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'article',
      title: 'Article',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'quote',
      subtitle: 'date',
    },
  },
};
