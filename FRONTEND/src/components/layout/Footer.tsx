import { Link } from "react-router-dom";

function Footer() {
  return (
    <div>
      <footer className="bg-gray-100 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-gray-900 mb-4">Blogger</h3>
              <p className="text-gray-600 text-sm">
                Create a beautiful blog that fits your style. Choose from a
                selection of easy-to-use templates.
              </p>
            </div>
            <div>
              <h4 className="text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link to="/about" className="hover:text-[#FF5722]">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#FF5722]">
                    Contact
                   </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-[#FF5722]">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-[#FF5722]">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#FF5722]">
                    Forums
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#FF5722]">
                    Developers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-[#FF5722]">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#FF5722]">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#FF5722]">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 Blogger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
