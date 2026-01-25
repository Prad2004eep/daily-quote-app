const API_URL = "https://zenquotes.io/api/random";

export async function fetchRandomQuote() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("API response not OK");
    }

    const data = await response.json();

    return {
      content: data[0].q,
      author: data[0].a,
    };
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error;
  }
}
