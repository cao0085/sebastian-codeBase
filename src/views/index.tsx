import styles from '@/css/views/HomePage.module.css';
import DraggableWindow from '@/components/DraggableWindow';
import BeforeAfterPlayer from '@/components/BeforeAfterPlayer';
import ClientForm from '@/components/ClientForm';

export default function HomePage() {
  return (
    <div className={styles.main}>

      <section className={styles.hero}>
        {/* <img src={`${import.meta.env.BASE_URL}room.jpg`}  alt="Microphone" className={styles.heroImg} />
        <div className={styles.heroText}>
          <h1>Record Your Voice</h1>
          <p>Capture every nuance in studio-quality sound.</p>
        </div> */}
      </section>
      <section>
        {/* <DraggableWindow/> */}
      </section>
      <section>
        {/* <BeforeAfterPlayer/> */}
      </section>
      <section>
        <ClientForm/>
      </section>
      <section>
        <h1>section3</h1>
      </section>
      <section>
        <h1>section3</h1>
      </section>
      <section>
        <h1>section3</h1>
      </section>
      <section>
        <h1>section3</h1>
      </section>
      <section>
        <h1>section3</h1>
      </section>
      <section>
        <h1>section3</h1>
      </section>
      <section>
        <h1>section3</h1>
      </section>
      <section>
        <h1>section3</h1>
      </section>
      <section>
        <h1>section3</h1>
      </section>

    </div>

  );
}