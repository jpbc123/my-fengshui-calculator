import { createClient } from "@sanity/client";

// This client connects your React app to your Sanity.io content.
// It now securely reads the project ID and dataset from environment variables.
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: "2021-10-21", // The API version to use
});
