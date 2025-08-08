import { useState } from 'react';
import { GAS_UPLOAD_FILE_URL, GAS_FORWARD_EMAIL_URL } from '@/constants/env';

interface ClientFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  fileSrc?: string; // base64, optional
}

export default function ClientForm() {

  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    fileSrc: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1];
      setFormData((prev) => ({ ...prev, fileSrc: base64Data }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 如果有檔案就試著上傳
    if (formData.fileSrc) {
        try {
            const uploadForm = new FormData();
            uploadForm.append('file', formData.fileSrc);
            uploadForm.append('filename', 'test'); // 或者你可以新增一個欄位 filename
            uploadForm.append('mimeType', 'audio/webm'); // ← 或用 file.type（需要記錄下原始 file）
            uploadForm.append('email', formData.email);
            const res = await fetch(GAS_UPLOAD_FILE_URL, {
                method: 'POST',
                body: uploadForm,
            });

            const text = await res.text();
            console.log('📤 檔案上傳結果:', text);
            if (text !== 'OK') {
                throw new Error(text);
            }
        } catch (err) {
        console.warn('⚠️ 檔案上傳失敗，略過處理:', err);
        }
    }

    // 2. 無論檔案成敗，都送出表單
    try {

        const res = await fetch(GAS_FORWARD_EMAIL_URL, {
            method: 'POST',
            body: JSON.stringify({
                name:    formData.name,
                email:   formData.email,
                subject: formData.subject,
                message: formData.message,
            }),
        });
        
      alert('表單已成功送出！我們會儘快聯繫您');
      // 清空表單（可選）
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        fileSrc: '',
      });

    } catch (err) {
      alert('❌ 表單送出失敗，請稍後再試');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="姓名" value={formData.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="信箱" value={formData.email} onChange={handleChange} required />
      <input name="subject" placeholder="主旨" value={formData.subject} onChange={handleChange} required />
      <textarea name="message" placeholder="訊息內容" value={formData.message} onChange={handleChange} required />
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button type="submit">送出</button>
    </form>
  );
}
