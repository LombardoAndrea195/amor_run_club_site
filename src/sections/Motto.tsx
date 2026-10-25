import ScrollVelocity from "../components/rb/ScrollVelocity";

export default function Motto() {
  return (
    <section className="motto" aria-label="Eat pasta run fasta">
      <ScrollVelocity
        texts={["Eat pasta run fasta ✺", "Run laugh connect ✺"]}
        velocity={60}
        className="motto__text"
        numCopies={6}
      />
    </section>
  );
}
