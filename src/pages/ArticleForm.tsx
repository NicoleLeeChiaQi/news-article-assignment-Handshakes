import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface FormErrors { title?: string; summary?: string; date?: string; publisher?: string; }

export default function ArticleForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({ title: '', summary: '', date: '', publisher: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditMode && id) {
      axios.get(`http://localhost:3001/articles/${id}`)
        .then((res) => {
          setFormData(res.data);
          if (res.data.date) setCurrentCalendarDate(new Date(res.data.date));
        })
        .catch(() => alert('Could not retrieve article details.'));
    }
  }, [id, isEditMode]);

  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) setShowCalendar(false);
    }
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const temp: FormErrors = {};
    if (!formData.title.trim()) temp.title = 'Title is required.';
    if (!formData.summary.trim()) temp.summary = 'Summary is required.';
    if (!formData.date) temp.date = 'Date is required.';
    if (!formData.publisher.trim()) temp.publisher = 'Publisher is required.';
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const request = isEditMode
      ? axios.put(`http://localhost:3001/articles/${id}`, formData)
      : axios.post('http://localhost:3001/articles', formData);

    request.then(() => { navigate('/'); }).catch(() => alert('Failed to save.'));
  };

  const renderCalendarDays = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} />);
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = formData.date === dateStr;
      cells.push(
        <button
          key={day} type="button" onClick={() => { setFormData(p => ({ ...p, date: dateStr })); setShowCalendar(false); setErrors(p => ({ ...p, date: undefined })); }}
          style={{ padding: '8px 0', background: isSelected ? '#007bff' : 'transparent', color: isSelected ? '#fff' : '#1e293b', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {day}
        </button>
      );
    }
    return cells;
  };

  const inputStyle = { width: '100%', padding: '10px 12px', boxSizing: 'border-box' as const, borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#1e293b', fontSize: '15px', outline: 'none', marginTop: '6px' };

  return (
    <div style={{ maxWidth: '550px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '25px' }}>{isEditMode ? '🔧 Update Article' : '📝 Create Article'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ color: '#334155', fontSize: '14px', fontWeight: '600' }}>Article Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} style={inputStyle} placeholder="Enter a headline..." />
          {errors.title && <span style={{ color: '#ef4444', fontSize: '13px' }}>{errors.title}</span>}
        </div>
        <div>
          <label style={{ color: '#334155', fontSize: '14px', fontWeight: '600' }}>Article Summary</label>
          <textarea name="summary" rows={5} value={formData.summary} onChange={handleChange} style={inputStyle} placeholder="Write a short summary statement..." />
          {errors.summary && <span style={{ color: '#ef4444', fontSize: '13px' }}>{errors.summary}</span>}
        </div>
        <div style={{ position: 'relative' }} ref={calendarRef}>
          <label style={{ color: '#334155', fontSize: '14px', fontWeight: '600' }}>Article Date</label>
          <div onClick={() => setShowCalendar(!showCalendar)} style={{ ...inputStyle, cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
            <span>{formData.date || 'Select Date...'}</span><span>📅 ▾</span>
          </div>
          {errors.date && <span style={{ color: '#ef4444', fontSize: '13px' }}>{errors.date}</span>}
          {showCalendar && (
            <div style={{ position: 'absolute', top: '102%', left: 0, zIndex: 100, width: '320px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <button type="button" onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1))} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>◀</button>
                <span style={{ fontWeight: '700' }}>{currentCalendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button type="button" onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1))} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>▶</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>{renderCalendarDays()}</div>
            </div>
          )}
        </div>
        <div>
          <label style={{ color: '#334155', fontSize: '14px', fontWeight: '600' }}>Publisher</label>
          <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} style={inputStyle} autoComplete="on" placeholder="eg. ABC Publisher"/>
          {errors.publisher && <span style={{ color: '#ef4444', fontSize: '13px' }}>{errors.publisher}</span>}
        </div>
        <button type="submit" style={{ padding: '12px', cursor: 'pointer', background: isEditMode ? '#007bff' : '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', marginTop: '10px' }}>
          {isEditMode ? 'Update Details' : 'Publish Article'}
        </button>
      </form>
    </div>
  );
}