export default {
    name: "privacyPolicy",
    type: "document",
    title: "Privacy Policy",
    fields: [
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
    ],
  };
  