import SplitText from "../components/rb/SplitText";
import { events, site } from "../data";

export default function Events() {
  return (
    <section className="events" id="events" aria-labelledby="events-title">
      <SplitText tag="h2" text="Upcoming events" className="display" splitType="words" mask delay={70}
        from={{ opacity: 0, y: 60 }} to={{ opacity: 1, y: 0 }} />
      <ul className="events__list">
        {events.map((e) => (
          <li className="event" key={e.title}>
            <h3 className="display">{e.title}</h3>
            <p className="event__meta">{e.meta}</p>
            {e.lines.map((l) => <p key={l}>{l}</p>)}
            <a className="textlink" href={site.links.instagram} target="_blank" rel="noopener noreferrer">Details on Instagram →</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
