const REVIEWS = [
  {
    text: 'Ходжу два роки й жодного разу не пошкодував. Артем робить фейд так, що відростає рівно — це магія. Атмосфера окрема тема.',
    name: 'Олег Кравченко', src: 'Постійний клієнт', a: 'О',
  },
  {
    text: 'Королівське гоління — це не просто послуга, це ритуал. Гарячі рушники, бритва, тиша. Виходиш як новий. Рекомендую кожному.',
    name: 'Дмитро Шевчук', src: 'Google review', a: 'Д',
  },
  {
    text: 'Привів сина на першу дитячу стрижку — боявся, що буде істерика. Майстер знайшов підхід за хвилину. Тепер ходимо разом.',
    name: 'Віталій Бондар', src: 'Instagram', a: 'В',
  },
  {
    text: 'Найкращий барбершоп у місті, без перебільшення. Запис зручний, ніколи не чекаю. Денис розуміє з пів слова, що мені треба.',
    name: 'Андрій Мельник', src: 'Постійний клієнт', a: 'А',
  },
]

export default function Reviews() {
  return (
    <section className="section-pad" id="reviews">
      <div className="wrap">
        <div className="sec-head">
          <div className="titles">
            <span className="kicker">05 — Відгуки</span>
            <h2 className="display" data-reveal>Що кажуть<br />клієнти</h2>
          </div>
          <span className="sec-no" aria-hidden="true">/05</span>
        </div>

        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <article className="review" data-reveal data-delay={String((i % 4) + 1)} key={r.name}>
              <span className="mark" aria-hidden="true">“</span>
              <span className="stars" aria-label="5 з 5">★★★★★</span>
              <p>{r.text}</p>
              <div className="who">
                <span className="ava" aria-hidden="true">{r.a}</span>
                <div><b>{r.name}</b><small>{r.src}</small></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
