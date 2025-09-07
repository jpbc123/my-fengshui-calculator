// schemas/dailyPlanetaryOverview.js
export default {
  name: 'dailyPlanetaryOverview',
  title: 'Daily Planetary Overview',
  type: 'document',
  fields: [
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'planetary_index',
      title: 'Planetary Index',
      type: 'number',
      description: 'A score from 1 to 5 indicating planetary energy'
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'string',
      validation: Rule => Rule.max(150)
    },
    {
      name: 'article',
      title: 'Detailed Article',
      type: 'text'
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }
  ]
};
