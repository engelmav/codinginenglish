export default {
  name: "post",
  type: "document",
  title: "Post",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "author",
      type: "string",
      title: "Author",
    },

    {
      name: "content",
      type: "array",
      of: [{ type: "block" }],
      title: "Content",
    },
    {
        title: 'Slug',
        name: 'slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 200, // will be ignored if slugify is set
          slugify: input => input
                               .toLowerCase()
                               .replace(/\s+/g, '-')
                               .replace(/[!@#$%^&*()]/g, '')
                               .slice(0, 200)
        }
      }
  ],
};
