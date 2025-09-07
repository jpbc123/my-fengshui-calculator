export default {
  // Document type name, similar to a table name in a database.
  name: 'contactMessage',
  title: 'Contact Message',
  type: 'document',
  fields: [
    {
      // Matches the `name` field from your Supabase table.
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(), // Matches the `NOT NULL` constraint.
    },
    {
      // Matches the `email` field from your Supabase table.
      name: 'email',
      title: 'Email',
      type: 'email', // Use the 'email' type for built-in validation.
      validation: Rule => Rule.required(), // Matches the `NOT NULL` constraint.
    },
    {
      // Matches the `subject` field from your Supabase table.
      name: 'subject',
      title: 'Subject',
      type: 'string',
      // No validation rule for required, as this field is nullable in Supabase.
    },
    {
      // Matches the `message` field from your Supabase table.
      name: 'message',
      title: 'Message',
      type: 'text', // Use the 'text' type for multi-line input.
      validation: Rule => [
        Rule.required(), // Matches the `NOT NULL` constraint.
        Rule.max(255).error('Message must be 255 characters or less.') // Matches the length check constraint.
      ],
    },
    {
      // Matches the `created_at` timestamp from your Supabase table.
      // Sanity automatically handles creation timestamps, but defining a field is good practice.
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        calendarTodayLabel: 'Today',
      },
      validation: Rule => Rule.required(),
      readOnly: true, // This field should not be editable by the user.
    },
  ],
  // Optional: Define how the document is displayed in the Sanity Studio.
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
    },
  },
};