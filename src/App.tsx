import { useState } from 'react';
import './App.css';
import heroImage from './assets/hero-image-1440.png';
import heroMobileImage from './assets/hero-mobile.png';
import logoMark from './assets/logo.svg';
import footerLogo from './assets/logo-footer.png';

export default function App() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const submitEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter a valid email.');
      return;
    }

    if (honeypot) {
      setStatus('success');
      setMessage('Thanks! You are on the waitlist.');
      setEmail('');
      return;
    }

    const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined;
    if (!endpoint) {
      setStatus('error');
      setMessage('Waitlist is not configured yet.');
      return;
    }

    try {
      setStatus('submitting');
      setMessage('');
      const formBody = new URLSearchParams({
        email,
        company: honeypot,
        source: 'landing-page',
      });
      await fetch(endpoint, {
        method: 'POST',
        body: formBody,
        mode: 'no-cors',
      });

      setStatus('success');
      setMessage('Thanks! You are on the waitlist.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div className="logo">
          <img src={logoMark} alt="Clawplay logo" />
        </div>
        <a
          className="header-link"
          href="https://x.com/Clawplayapp"
          target="_blank"
          rel="noreferrer"
        >
          Follow us on X
        </a>
      </header>

      <main className="hero">
        <section className="hero-copy">
          <h1>An AI agent playground for everyone</h1>
          <p>A mobile-first platform to deploy AI agents that handle real-world tasks.</p>
        </section>

        <section className="hero-cta" id="waitlist">
          <p>Join the waitlist. TestFlight invites coming soon.</p>
          <form className="cta-form" onSubmit={submitEmail}>
            <label className="sr-only" htmlFor="email">
              Email address
            </label>
            <input
              className="hp-field"
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending...' : 'Submit'}
            </button>
          </form>
          {message ? <p className={`form-status ${status}`}>{message}</p> : null}
        </section>
      </main>

      <section className="features">
        <div className="feature">
          <span className="dot" />
          <span className="feature-text">Mobile-first, designed for speed</span>
        </div>
        <div className="feature">
          <span className="dot" />
          <span className="feature-text">20+ powerful AI models</span>
        </div>
        <div className="feature">
          <span className="dot" />
          <span className="feature-text">Expandable skills &amp; plugins</span>
        </div>
      </section>

      <section className="hero-image">
        <div className="image-frame">
          <picture>
            <source media="(max-width: 600px)" srcSet={heroMobileImage} />
            <img src={heroImage} alt="Clawplay app preview" />
          </picture>
        </div>
      </section>

      <footer className="footer">
        <img src={footerLogo} alt="Clawplay" />
        <p className="footer-tagline">The AI app that actually gets things done.</p>
      </footer>
    </div>
  );
}
