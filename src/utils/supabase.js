import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pcpkgpokgfsqaeclejhf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcGtncG9rZ2ZzcWFlY2xlamhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NTIxNTgsImV4cCI6MjA2MTIyODE1OH0.w41dSRqdXqQJrKEWiCa5pGn7g--3A88yTlS7GCEuQ7g";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to get all data from the imageStorage table
export async function getImageStorageData() {
  const { data, error } = await supabase
    .from('imageStorage') // Specify the table name
    .select('*'); // Select all columns

  if (error) {
    console.error('Error fetching image storage data:', error);
    return null; // Or handle the error as needed
  }

  return data;
}

// Function to get a story by its ID from the story table
export async function getStoryById(id = 1) {
  const { data, error } = await supabase
    .from('story') 
    .select('*') 
    .eq('id', id) 
    .single(); 

  if (error) {
    console.error(`Error fetching story with id ${id}:`, error);
    return null; 
  }

  return data;
}

