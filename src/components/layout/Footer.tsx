import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Gojo</h3>
            <p className="text-sm">
              Ethiopia's premier real estate platform. Find your perfect home with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties" className="hover:text-white transition">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Property Types</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties?type=house" className="hover:text-white transition">
                  Houses
                </Link>
              </li>
              <li>
                <Link href="/properties?type=apartment" className="hover:text-white transition">
                  Apartments
                </Link>
              </li>
              <li>
                <Link href="/properties?type=commercial" className="hover:text-white transition">
                  Commercial
                </Link>
              </li>
              <li>
                <Link href="/properties?type=land" className="hover:text-white transition">
                  Land
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Addis Ababa, Ethiopia</li>
              <li>Email: info@gojo.com</li>
              <li>Phone: +251 XXX XXXX</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {currentYear} Gojo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
