import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Article } from '../types';
import { Link } from 'react-router-dom';

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // 1. State to track what the user types in the search bar
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    axios.get('http://localhost:3001/articles')
      .then((response) => {
        setArticles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this article?')) {
      axios.delete(`http://localhost:3001/articles/${id}`)
        .then(() => {
          setArticles((prevArticles) => prevArticles.filter((article) => article.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting article:', error);
          alert('Failed to delete the article.');
        });
    }
  };

  // 2. Compute the derived filtered list based on the search query
  const filteredArticles = articles.filter((article) => {
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.publisher.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return <p>Loading articles...</p>;
  }

  return (
    <div>
      <h2>News Articles</h2>
      
      {/* 3. Search Bar UI Component */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by title or publisher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      
      {filteredArticles.length === 0 ? (
        <p>{articles.length === 0 ? 'No articles found. Click "Create Article" to add one!' : 'No articles match your search criteria.'}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 4. Render filtered list instead of the raw array */}
          {filteredArticles.map((article) => (
            <div 
              key={article.id} 
              style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}
            >
              <h3>{article.title}</h3>
              <p><strong>Publisher:</strong> {article.publisher} | <strong>Date:</strong> {article.date}</p>
              <p>{article.summary}</p>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Link to={`/edit/${article.id}`}>
                  <button style={{ cursor: 'pointer' }}>Edit Article</button>
                </Link>
                <button 
                  onClick={() => handleDelete(article.id)} 
                  style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}