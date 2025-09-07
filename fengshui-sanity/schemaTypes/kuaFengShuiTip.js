export default {
  name: 'fengShuiTip',
  title: 'Kua Feng Shui Tip',
  type: 'document',
  fields: [
    {
      name: 'kuaNumber',
      title: 'Kua Number',
      type: 'number',
      description: 'The Kua number (1-9) these tips are for. Do not use 5.',
      validation: (Rule) => Rule.required().min(1).max(9).integer().custom(number => {
        if (number === 5) {
          return 'Kua number 5 is treated as 2 for males and 8 for females. Please create separate tips for those numbers.';
        }
        return true;
      }),
    },
    {
      name: 'tips',
      title: 'Practical Tips',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'A list of practical Feng Shui tips for this Kua number.',
      validation: (Rule) => Rule.required().min(1),
    },
  ],
  preview: {
    select: {
      kuaNumber: 'kuaNumber',
    },
    prepare(selection) {
      const { kuaNumber } = selection;
      return {
        title: `Kua Number ${kuaNumber} Tips`,
        subtitle: 'Feng Shui Tips',
      };
    },
  },
};