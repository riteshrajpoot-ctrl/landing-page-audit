import AuditForm from "../components/AuditForm";

export default function HomePage() {
  return (
    <main className="container-custom">
      <section className="hero">
        <p className="hero-tag">Conversion Optimization Tool</p>
        <h1 className="hero-title">Landing Page Audit Tool</h1>
        <p className="hero-subtitle">
          Audit any landing page for headline clarity, CTA strength, trust
          signals, content depth, and conversion readiness.
        </p>
      </section>

      <AuditForm />
    </main>
  );
}