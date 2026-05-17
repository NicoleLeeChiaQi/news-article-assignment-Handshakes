import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Article } from '../types';
import { Link } from 'react-router-dom';

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  const filteredArticles = articles.filter((article) => {
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.publisher.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return <p style={{ color: '#4a5568', textAlign: 'center' }}>Loading articles...</p>;
  }

  return (
    <div>
      {/* 1. Enhanced Bold Title Header */}
      <h1 style={{ color: '#000000', fontWeight: '800', fontSize: '34px', margin: '0 0 20px 0', letterSpacing: '-0.5px' }}>
        News Articles
      </h1>
      
      {/* 2. Sleek Light Search Bar */}
      <div style={{ marginBottom: '25px' }}>
        <input
          type="text"
          placeholder="Search by title or publisher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px 16px', 
            boxSizing: 'border-box', 
            borderRadius: '8px', 
            border: '1px solid #cbd5e1', 
            backgroundColor: '#ffffff',
            color: '#1e293b',
            fontSize: '15px',
            outline: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}
        />
      </div>
      
      {filteredArticles.length === 0 ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>
          {articles.length === 0 ? 'No articles found. Click "Create Article" to add one!' : 'No articles match your search criteria.'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredArticles.map((article) => (
            /* 3. Interactive Floating CSS Article Cards */
            <div key={article.id} className="article-card">
              <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#0f172a', fontWeight: '700' }}>
                {article.title}
              </h3>
              
              {/* Metadata Badges Area */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                  🏢 {article.publisher}
                </span>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>
                  📅 {article.date}
                </span>
              </div>
              
              <p style={{ color: '#334155', lineHeight: '1.6', margin: '0 0 15px 0', fontSize: '15px' }}>
                {article.summary}
              </p>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <Link to={`/edit/${article.id}`} style={{ textDecoration: 'none' }}>
                  <button style={{ 
                    cursor: 'pointer', 
                    background: '#f1f5f9', 
                    color: '#1e293b', 
                    border: '1px solid #cbd5e1', 
                    padding: '6px 14px', 
                    borderRadius: '4px', 
                    fontWeight: '500',
                    fontSize: '14px' 
                  }}>
                    Edit Article
                  </button>
                </Link>
                <button 
                  onClick={() => handleDelete(article.id)} 
                  style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}
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