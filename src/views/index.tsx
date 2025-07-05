import styles from '@/css/views/HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.main}>

      <section className={styles.hero}>
        {/* 實際圖片當背景，便於 cover 裁切；img 只留 SEO/懶載可省略 */}
        <img src="/room.jpg" alt="Microphone" className={styles.heroImg} />
        {/* 文字層，可放 H1、按鈕、任意內容 */}
        <div className={styles.heroText}>
          <h1>Record Your Voice</h1>
          <p>Capture every nuance in studio-quality sound.</p>
        </div>
      </section>
      <section>
        <h1>section2</h1>
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
      <section>
        <h1>section3</h1>
      </section>
      <section>
        <h1>section3</h1>
      </section>

    </div>

  );
}