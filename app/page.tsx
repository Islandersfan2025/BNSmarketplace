import Link from "next/link";
import { bots } from "@/lib/bots";

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <div className="badge">BNS Marketplace</div>
        <h1>Run autonomous onchain bots</h1>
        <p>
          Listings of bots for tracking transactions.
        </p>
      </section>

      <section className="grid">
        {bots.map((bot) => (
          <Link className="card" href={`/bots/${bot.slug}`} key={bot.slug}>
            <h2>{bot.name}</h2>
            <p>{bot.tagline}</p>
            <div className="meta">
              <span className="pill">{bot.category}</span>
              <span className="pill">{bot.price}</span>
            </div>
            <span className="button">View Bot</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
