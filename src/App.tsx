import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ArticleList from './pages/ArticleList';
import ArticleForm from './pages/ArticleForm';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        {/* Navigation Bar */}
        <nav style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
          <Link to="/">View Articles</Link>
          <Link to="/create">Create Article</Link>
        </nav>

        <hr />

        {/* Route Definitions */}
        <Routes>
          <Route path="/" element={<ArticleList />} />
          <Route path="/create" element={<ArticleForm />} />
          <Route path="/edit/:id" element={<ArticleForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
