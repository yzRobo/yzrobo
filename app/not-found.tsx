// app/not-found.tsx
import Link from 'next/link';
import Navigation from './components/Navigation';

export default function NotFound() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-8xl md:text-9xl font-black text-[var(--accent-primary)]" style={{ textShadow: "0 0 15px color-mix(in srgb, var(--accent-primary) 30%, transparent)" }}>
          404
        </h1>
        <p className="mt-4 text-2xl md:text-3xl font-semibold text-white">
          Page Not Found
        </p>
        <p className="mt-2 text-lg text-gray-400 max-w-md">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-10">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-[var(--accent-primary)] text-white font-bold rounded-full transition-transform hover:scale-105"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}