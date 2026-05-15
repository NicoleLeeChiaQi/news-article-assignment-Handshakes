export interface Article {
  id?: string;          // Or 'number' depending on your preference
  title: string;
  summary: string;
  date: string;         // Stored as an ISO string (YYYY-MM-DD)
  publisher: string;
}