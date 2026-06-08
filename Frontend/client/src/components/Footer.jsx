import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  const services = [
    "AC Service",
    "Cleaning",
    "Plumbing",
    "Electrical",
    "Painting",
  ];

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/login/",
      icon: <FaFacebookF />,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/accounts/login/",
      icon: <FaInstagram />,
    },
    {
      name: "Twitter",
      url: "https://twitter.com/login",
      icon: <FaTwitter />,
    },
  ];

  return (
    <footer className="bg-slate-950 text-white">
      <div className="container-custom py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="mb-4 text-3xl font-black text-emerald-400">
              Sheba
            </h2>

            <p className="max-w-sm leading-7 text-slate-400">
              A modern home service platform where customers can book reliable
              technicians, cleaners, plumbers and other service experts.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Quick Links</h3>

            <div className="space-y-3 text-slate-400">
              <Link className="block hover:text-emerald-400" to="/">
                Home
              </Link>

              <Link className="block hover:text-emerald-400" to="/services">
                Services
              </Link>

              <Link className="block hover:text-emerald-400" to="/about">
                About
              </Link>

              <Link className="block hover:text-emerald-400" to="/contact">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Popular Services</h3>

            <div className="space-y-3 text-slate-400">
              {services.map((service) => (
                <p key={service}>{service}</p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Contact</h3>

            <div className="space-y-3 text-slate-400">
              <p>Phone: +8801746058187</p>
              <p>Email: support@sheba.com</p>
              <p>Address: Dhaka, Bangladesh</p>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-sm font-bold text-slate-300">
                Follow Us
              </p>

              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    title={social.name}
                    className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-white transition hover:bg-emerald-600"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Sheba Home Service. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;