import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ArticleList from './pages/ArticleList';
import ArticleForm from './pages/ArticleForm';
import './App.css'; // Ensure global styles are active

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ 
        backgroundColor: '#f4f6f9', 
        minHeight: '100vh', 
        padding: '30px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ 
          maxWidth: '850px', 
          margin: '0 auto', 
          backgroundColor: '#ffffff', 
          padding: '35px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)' 
        }}>
          
          {/* Navigation Bar */}
          <nav style={{ marginBottom: '25px', display: 'flex', gap: '15px' }}>
            <Link to="/" className="nav-btn-view" style={{ 
              padding: '10px 22px', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '15px',
              textAlign: 'center'
            }}>
              View Articles
            </Link>
            
            <Link to="/create" className="nav-btn-create" style={{ 
              padding: '10px 22px', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '15px',
              textAlign: 'center'
            }}>
              Create Article
            </Link>
          </nav>

          <hr style={{ border: '0', borderTop: '1px solid #edf2f7', marginBottom: '30px' }} />

          {/* Route Definitions */}
          <Routes>
            <Route path="/" element={<ArticleList />} />
            <Route path="/create" element={<ArticleForm />} />
            <Route path="/edit/:id" element={<ArticleForm />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}