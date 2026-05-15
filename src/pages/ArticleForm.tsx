import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface FormErrors {
  title?: string;
  summary?: string;
  date?: string;
  publisher?: string;
}

export default function ArticleForm() {
  const navigate = useNavigate();
  
  // 1. Grab the dynamic 'id' parameter from the URL route (/edit/:id)
  const { id } = useParams<{ id: string }>();
  
  // Determine if we are creating a new article or editing an existing one
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    date: '',
    publisher: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // 2. Fetch the existing article's data if we are in Edit Mode
  useEffect(() => {
    if (isEditMode && id) {
      axios.get(`http://localhost:3001/articles/${id}`)
        .then((response) => {
          // Pre-populate the form state with the database values
          setFormData({
            title: response.data.title,
            summary: response.data.summary,
            date: response.data.date,
            publisher: response.data.publisher
          });
        })
        .catch((error) => {
          console.error('Error fetching the article for editing:', error);
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

    // 3. Conditionally choose between an Axios POST (Create) or PUT (Update) request
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

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      {/* Dynamic Heading based on current mode */}
      <h2>{isEditMode ? 'Update News Article' : 'Create News Article'}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="title"><strong>Article Title</strong></label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
          {errors.title && <span style={{ color: 'red', fontSize: '14px' }}>{errors.title}</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="summary"><strong>Article Summary</strong></label>
          <textarea id="summary" name="summary" rows={4} value={formData.summary} onChange={handleChange} />
          {errors.summary && <span style={{ color: 'red', fontSize: '14px' }}>{errors.summary}</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="date"><strong>Article Date</strong></label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} />
          {errors.date && <span style={{ color: 'red', fontSize: '14px' }}>{errors.date}</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="publisher"><strong>Publisher Of Article</strong></label>
          <input type="text" id="publisher" name="publisher" value={formData.publisher} onChange={handleChange} />
          {errors.publisher && <span style={{ color: 'red', fontSize: '14px' }}>{errors.publisher}</span>}
        </div>

        <button type="submit" style={{ padding: '10px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          {isEditMode ? 'Update Article' : 'Submit Article'}
        </button>
      </form>
    </div>
  );
}