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
      .then((res) => { setArticles(res.data); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  const handleDelete = (id: string | undefined) => {
    if (!id || !window.confirm('Are you sure you want to delete this article?')) return;
    axios.delete(`http://localhost:3001/articles/${id}`)
      .then(() => setArticles(prev => prev.filter(a => a.id !== id)))
      .catch((err) => { console.error(err); alert('Failed to delete.'); });
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.publisher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p style={{ textAlign: 'center', color: '#64748b' }}>Loading articles...</p>;

  return (
    <div>
      <h1 style={{ fontWeight: '800', fontSize: '34px', margin: '0 0 20px 0', letterSpacing: '-0.5px' }}>News Articles</h1>
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
            outline: 'none', 
            fontSize: '15px',
            backgroundColor: '#ffffff', 
            color: '#1e293b'            
          }}
        />
      </div>
      {filteredArticles.length === 0 ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No articles match your search criteria.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredArticles.map((article) => (
            <div key={article.id} className="article-card">
              <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: '700' }}>{article.title}</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>🏢 {article.publisher}</span>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>📅 {article.date}</span>
              </div>
              <p style={{ color: '#334155', lineHeight: '1.6', fontSize: '15px', margin: '0 0 15px 0' }}>{article.summary}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to={`/edit/${article.id}`} style={{ textDecoration: 'none' }}>
                  <button style={{ cursor: 'pointer', background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '6px 14px', borderRadius: '4px', fontWeight: '500' }}>Edit Article</button>
                </Link>
                <button onClick={() => handleDelete(article.id)} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}