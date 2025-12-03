const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Dare Centre</h3>
            <p className="text-gray-400 text-sm">
              Building careers and reaching new heights through quality education and training.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://darecentre.in/" className="text-gray-400 hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="https://darecentre.in/about.html" className="text-gray-400 hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="https://darecentre.in/courses.html" className="text-gray-400 hover:text-white transition">
                  Courses
                </a>
              </li>
              <li>
                <a href="https://darecentre.in/contact.html" className="text-gray-400 hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">
              Visit our website for contact information and inquiries.
            </p>
            <a
              href="https://darecentre.in/contact.html"
              className="inline-block mt-4 text-primary-400 hover:text-primary-300 transition text-sm"
            >
              Get in Touch →
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Dare Centre. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

