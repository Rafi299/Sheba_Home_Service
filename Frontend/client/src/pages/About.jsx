import SectionTitle from "../components/SectionTitle";

const aboutImage =
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80";

const fallbackAboutImage =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80";

const aboutBanner =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80";

function About() {
  const values = [
    "Trusted service experts",
    "Clear and fair pricing",
    "Easy booking process",
    "Customer-first support",
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 py-24">
        <div className="absolute inset-0">
          <img
            src={aboutBanner}
            alt="About Sheba banner"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-slate-950/75"></div>
        </div>

        <div className="container-custom relative text-center">
          <p className="mb-4 font-bold text-emerald-400">About Us</p>

          <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight text-white">
            We make home service booking simple, fast and reliable.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Sheba is a home service platform built for customers who want
            trusted technicians and service experts without stress.
          </p>
        </div>
      </section>

      <section className="container-custom py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-[40px] bg-gradient-to-br from-emerald-100 to-slate-200 p-5">
            <img
              src={aboutImage}
              alt="Sheba service team helping customers"
              className="h-[450px] w-full rounded-[32px] object-cover"
              onError={(event) => {
                event.currentTarget.src = fallbackAboutImage;
              }}
            />
          </div>

          <div>
            <SectionTitle
              align="left"
              label="Our Story"
              title="A better way to find home service experts"
              description="Our goal is to connect customers with reliable service providers for everyday home problems."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((value) => (
                <div
                  key={value}
                  className="rounded-2xl bg-white p-5 font-bold text-slate-800 shadow-sm ring-1 ring-slate-200"
                >
                  ✓ {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-custom grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-8 text-center">
            <h3 className="text-4xl font-black text-emerald-600">50+</h3>
            <p className="mt-2 font-semibold text-slate-600">Services</p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-8 text-center">
            <h3 className="text-4xl font-black text-emerald-600">1K+</h3>
            <p className="mt-2 font-semibold text-slate-600">Bookings</p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-8 text-center">
            <h3 className="text-4xl font-black text-emerald-600">4.8</h3>
            <p className="mt-2 font-semibold text-slate-600">Average Rating</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;