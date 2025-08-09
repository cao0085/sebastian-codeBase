import { useState } from 'react';
import { GAS_UPLOAD_FILE_URL, GAS_FORWARD_EMAIL_URL } from '@/constants/env';
import style from '@/css/components/ClientFormModal.module.css';

interface ClientFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  fileSrc?: string; // base64, optional
}

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClientFormModal({ isOpen, onClose }: ClientFormModalProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    fileSrc: '',
  });

  if (!isOpen) return null;

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

    if (formData.fileSrc) {
      try {
        const uploadForm = new FormData();
        uploadForm.append('file', formData.fileSrc);
        uploadForm.append('filename', 'test');
        uploadForm.append('mimeType', 'audio/webm');
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

    try {
      await fetch(GAS_FORWARD_EMAIL_URL, {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      alert('表單已成功送出！我們會儘快聯繫您');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        fileSrc: '',
      });
      onClose();
    } catch (err) {
      alert('❌ 表單送出失敗，請稍後再試');
      console.error(err);
    }
  };

  return (
    <div className={style.modalOverlay}>
      <div className={style.modal}>
        <button className={style.modalClose} onClick={onClose}>✖</button>
        <h2>填寫表單</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="姓名" value={formData.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="信箱" value={formData.email} onChange={handleChange} required />
          <input name="subject" placeholder="主旨" value={formData.subject} onChange={handleChange} required />
          <textarea name="message" placeholder="訊息內容" value={formData.message} onChange={handleChange} required />
          <input type="file" accept="audio/*" onChange={handleFileChange} />
          <button type="submit">送出</button>
        </form>
      </div>
    </div>
  );
}