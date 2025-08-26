import { FaFacebook, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© 2025 HackOut 2025. All rights reserved.</p>
          <div className="flex space-x-4 text-lg">
            <a href="/social/facebook" aria-label="Facebook" className="hover:text-blue-400 transition-all">
              <FaFacebook />
            </a>
            <a href="/social/twitter" aria-label="Twitter" className="hover:text-blue-400 transition-all">
              <FaTwitter />
            </a>
            <a href="/social/linkedin" aria-label="LinkedIn" className="hover:text-blue-400 transition-all">
              <FaLinkedin />
            </a>
            <a href="/social/youtube" aria-label="YouTube" className="hover:text-blue-400 transition-all">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
