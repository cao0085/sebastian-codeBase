import styles from '@/css/views/HomePage.module.css';
import DraggableWindow from '@/components/DraggableWindow';
import ExpandablePanel from '@/components/ExpandablePanel'

export default function HomePage() {
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
          <SegmentedPlayer
          src={`${import.meta.env.BASE_URL}mp3/Ab.m3u8`}
        />
      </section> */}
      <section>
        {/* <SegmentedPlayer2></SegmentedPlayer2> */}
        
      </section>
      <section>
        <DraggableWindow></DraggableWindow>
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
      <section>
        <h1>section3</h1>
      </section>
      <section>
        <h1>section3</h1>
      </section>

    </div>

  );
}