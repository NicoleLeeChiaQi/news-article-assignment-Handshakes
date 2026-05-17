import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface FormErrors {
  title?: string;
  summary?: string;
  date?: string;
  publisher?: string;
}

export default function ArticleForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({ title: '', summary: '', date: '', publisher: '' });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isEditMode && id) {
      axios.get(`http://localhost:3001/articles/${id}`)
        .then((response) => {
          setFormData({
            title: response.data.title,
            summary: response.data.summary,
            date: response.data.date,
            publisher: response.data.publisher
          });
        })
        .catch((error) => {
          console.error('Error fetching article:', error);
          alert('Could not retrieve article details.');
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};
    if (!formData.title.trim()) tempErrors.title = 'Article title is required.';
    if (!formData.summary.trim()) tempErrors.summary = 'Article summary is required.';
    if (!formData.date) tempErrors.date = 'Article date is required.';
    if (!formData.publisher.trim()) tempErrors.publisher = 'Publisher is required.';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const apiRequest = isEditMode
      ? axios.put(`http://localhost:3001/articles/${id}`, formData)
      : axios.post('http://localhost:3001/articles', formData);

    apiRequest
      .then(() => {
        alert(isEditMode ? 'Article updated successfully!' : 'Article created successfully!');
        setFormData({ title: '', summary: '', date: '', publisher: '' });
        navigate('/');
      })
      .catch((error) => {
        console.error('Error saving article:', error);
        alert('Failed to save the article.');
      });
  };

  // Uniform input style configuration object
  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    boxSizing: 'border-box' as const,
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    fontSize: '15px',
    outline: 'none',
    marginTop: '6px'
  };

  return (
    <div style={{ maxWidth: '550px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', margin: '0 0 25px 0' }}>
        {isEditMode ? '🔧 Update News Article' : '📝 Create News Article'}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label htmlFor="title" style={{ color: '#334155', fontSize: '14px', fontWeight: '600' }}>Article Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} style={inputStyle} placeholder="Enter dynamic headline..." />
          {errors.title && <span style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px', display: 'block' }}>{errors.title}</span>}
        </div>

        <div>
          <label htmlFor="summary" style={{ color: '#334155', fontSize: '14px', fontWeight: '600' }}>Article Summary</label>
          <textarea id="summary" name="summary" rows={5} value={formData.summary} onChange={handleChange} style={inputStyle} placeholder="Write a short summary statement..." />
          {errors.summary && <span style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px', display: 'block' }}>{errors.summary}</span>}
        </div>

        <div>
          <label htmlFor="date" style={{ color: '#334155', fontSize: '14px', fontWeight: '600' }}>Article Date</label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} style={inputStyle} />
          {errors.date && <span style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px', display: 'block' }}>{errors.date}</span>}
        </div>

        <div>
          <label htmlFor="publisher" style={{ color: '#334155', fontSize: '14px', fontWeight: '600' }}>Publisher Of Article</label>
          <input type="text" id="publisher" name="publisher" value={formData.publisher} onChange={handleChange} style={inputStyle} placeholder="e.g., Handshakes Post" />
          {errors.publisher && <span style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px', display: 'block' }}>{errors.publisher}</span>}
        </div>

        <button type="submit" style={{ 
          padding: '12px', 
          cursor: 'pointer', 
          background: isEditMode ? '#007bff' : '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px',
          fontWeight: '600',
          fontSize: '16px',
          marginTop: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
        }}>
          {isEditMode ? 'Update Article Details' : 'Publish Article'}
        </button>
      </form>
    </div>
  );
}