import { title } from "process";
import { z } from "zod";

// here we define the expected answer of the LLM in this case OPENAI
// it should be an object with suggestions
// the suggsitons is just an array with objects with tittle and author

export const BookSuggestionSchema = z.object({
  suggestions: z.array(
    z.object({
      title: z.string(),
      author: z.string(), 
    })
  ),
});


// generate a typescript type from the schema to use in the app
export type BookSuggestionResponse = z.infer<typeof BookSuggestionSchema>;
