export default {
  name: "classSession",
  type: "document",
  title: "Class Session",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Name",
    },
    {
      name: "description",
      type: "array",
      of: [{ type: "block" }],
      title: "Description",
    },
  ],
};
