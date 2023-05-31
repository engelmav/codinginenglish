// client.ts
import { createClient } from "next-sanity";


export const client = createClient({
    projectId: "zkkparnw",
    dataset: "production",
    apiVersion: "2022-03-25",
    useCdn: false,
  });