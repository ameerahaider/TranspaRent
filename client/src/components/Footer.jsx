import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white py-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
        <div className="flex items-center justify-center mb-4">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-orange-500 mr-4 hover:text-black">
            <FaFacebook size={24} />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-orange-500 mr-4 hover:text-black">
            <FaTwitter size={24} />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-black">
            <FaInstagram size={24} />
          </a>
        </div>
        <p className="text-orange-500 mb-4">Stay connected with us on social media</p>
        <p className="text-orange-500 text-sm">© {new Date().getFullYear()} TranspaRent. All rights reserved.</p>
      </div>
    </footer>
  );
}
