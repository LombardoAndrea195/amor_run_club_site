import { asset, site } from "../data";

export default function Footer() {
  return (
    <footer className="footer">
      <img src={asset("brand/logo.png")} alt="Amor Run Club" width={96} height={96} />
      <p className="footer__tag">Eat pasta run fasta.</p>
      <ul>
        <li><a href={site.links.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
        <li><a href={site.links.strava} target="_blank" rel="noopener noreferrer">Strava</a></li>
        <li><a href={site.links.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
      </ul>
      <p className="footer__legal">{site.legal}</p>
    </footer>
  );
}
