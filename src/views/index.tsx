import styles from '@/css/views/HomePage.module.css';
import DraggableWindow from '@/components/DraggableWindow';
import BeforeAfterPlayer from '@/components/BeforeAfterPlayer';
import ClientFormModal from '@/components/ClientFormModal';
import { useState } from 'react';

export default function HomePage() {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.main}>

      <section className={styles.hero}>
        <img src={`${import.meta.env.BASE_URL}room.jpg`}  alt="Microphone" className={styles.heroImg} />
        <div className={styles.heroText}>
          <h1>Record Your Voice</h1>
          <p>Capture every nuance in studio-quality sound.</p>
        </div>
      </section>
      {/* <section>
        <DraggableWindow/>
      </section> */}
      <section className={styles.beforeAfterSection}>
        <BeforeAfterPlayer/>
      </section>
      <section className={styles.formLink}>
        <button onClick={() => setIsOpen(true)}>開啟表單</button>
        <ClientFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </section>
    </div>

  );
}