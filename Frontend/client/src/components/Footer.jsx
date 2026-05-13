import { Link } from "react-router-dom";

function Footer() {
  const services = [
    "AC Service",
    "Cleaning",
    "Plumbing",
    "Electrical",
    "Painting",
  ];

  const paymentLogos = [
    "/images/logos/bkash.png",
    "/images/logos/nagad.png",
    "/images/logos/visa.png",
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
              <p>Phone: 01XXXXXXXXX</p>
              <p>Email: support@sheba.com</p>
              <p>Address: Dhaka, Bangladesh</p>
            </div>

            <div className="mt-5 flex items-center gap-3">
              {paymentLogos.map((logo) => (
                <div
                  key={logo}
                  className="grid h-10 w-16 place-items-center rounded-lg bg-white/10"
                >
                  <img
                    src={logo}
                    alt="Payment logo"
                    className="max-h-7 object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ))}
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