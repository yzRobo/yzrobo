// app/components/Footer.tsx
'use client';

import { FaInstagram, FaTwitter } from 'react-icons/fa';

// Re-using the Bluesky icon SVG from the links page for consistency
const BlueskyIcon = () => (
  <svg viewBox="0 0 600 530" fill="currentColor" className="w-5 h-5">
    <path d="M135.72 44.03C202.216 93.951 273.74 195.17 300 249.49c26.262-54.316 97.782-155.54 164.28-205.46C512.26 8.009 590-19.862 590 68.825c0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.38-3.69-10.832-3.708-7.896-.017-2.936-1.193.516-3.707 7.896-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.45-163.25-81.433C20.15 217.613 9.997 86.535 9.997 68.825c0-88.687 77.742-60.816 125.72-24.795z" />
  </svg>
);

const socialLinks = [
  { name: 'Instagram', url: 'https://instagram.com/yzRobo_', icon: <FaInstagram size={20} /> }, //
  { name: 'Bluesky', url: 'https://bsky.app/profile/yzrobo.com', icon: <BlueskyIcon /> }, //
  { name: 'Twitter', url: 'https://twitter.com/yzRobo', icon: <FaTwitter size={20} /> }, //
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} yzRobo. All Rights Reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="mailto:admin@yzrobo.com" className="text-sm text-gray-400 hover:text-white transition-colors">
              admin@yzrobo.com
            </a>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;