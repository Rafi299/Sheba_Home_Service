import { useState } from "react";
import { Link } from "react-router-dom";

import CategoryCard from "../components/CategoryCard";
import QuoteModal from "../components/QuoteModal";
import SectionTitle from "../components/SectionTitle";
import ServiceCard from "../components/ServiceCard";

import { popularServices, servicesData } from "../data/servicesData";

function Home() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const steps = [
    {
      title: "Choose Service",
      description: "Select the service category you need from our platform.",
    },
    {
      title: "Book Schedule",
      description: "Pick your preferred date, time and service location.",
    },
    {
      title: "Get Expert Help",
      description: "Our verified service expert will visit your place.",
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <img
            src="/images/hero-home.jpg"
            alt="Home service hero"
            className="h-full w-full object-cover opacity-30"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-emerald-950/60"></div>
        </div>

        <div className="container-custom relative grid min-h-[650px] items-center gap-12 py-20 lg:grid-cols-2">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-emerald-400/10 px-5 py-2 text-sm font-bold text-emerald-300 ring-1 ring-emerald-400/20">
              Trusted Home Service Platform
            </p>

            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
              Book expert home services at your doorstep.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              AC service, cleaning, plumbing, electrical work, painting and
              appliance repair — all from one simple platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/services"
                className="rounded-2xl bg-emerald-500 px-7 py-4 font-bold text-white hover:bg-emerald-600"
              >
                Explore Services
              </Link>

              <button
                onClick={() => setIsQuoteOpen(true)}
                className="rounded-2xl bg-white px-7 py-4 font-bold text-slate-900 hover:bg-slate-100"
              >
                Get Free Quote
              </button>
            </div>

            <div className="mt-12 grid max-w-xl grid-cols-3 gap-4">
              <div>
                <h3 className="text-3xl font-black text-white">50+</h3>
                <p className="text-sm text-slate-400">Services</p>
              </div>

              <div>
                <h3 className="text-3xl font-black text-white">1K+</h3>
                <p className="text-sm text-slate-400">Bookings</p>
              </div>

              <div>
                <h3 className="text-3xl font-black text-white">24/7</h3>
                <p className="text-sm text-slate-400">Support</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-[40px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <div className="rounded-[32px] bg-white p-6">
                <img
                  src="/images/hero-card.jpg"
                  alt="Service booking"
                  className="h-72 w-full rounded-[28px] object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-sm font-semibold text-emerald-700">
                      Today Available
                    </p>
                    <h3 className="mt-1 text-xl font-black text-slate-900">
                      AC Cleaning Expert
                    </h3>
                  </div>

                  <Link
                    to="/services/ac-service"
                    className="block w-full rounded-2xl bg-slate-900 py-4 text-center font-bold text-white hover:bg-slate-800"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-custom py-20">
        <SectionTitle
          label="Categories"
          title="Popular service categories"
          description="Choose from our most requested home service categories."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {servicesData.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-custom">
          <SectionTitle
            label="Popular"
            title="Most booked services"
            description="These services are frequently booked by customers."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularServices.slice(0, 3).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                category={{
                  title: service.categoryTitle,
                  slug: service.categorySlug,
                  image: service.categoryImage,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container-custom py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionTitle
              align="left"
              label="How It Works"
              title="Book service in three simple steps"
              description="The whole booking process is easy, clean and beginner friendly."
            />

            <div className="space-y-5">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-600 font-black text-white">
                    {index + 1}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 leading-7 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[40px] bg-gradient-to-br from-emerald-100 to-slate-200 p-5">
            <img
              src="/images/how-it-works.jpg"
              alt="How booking works"
              className="h-[480px] w-full rounded-[32px] object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      </section>

      <section className="bg-emerald-600 py-16">
        <div className="container-custom flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-4xl font-black text-white">
              Need a custom service?
            </h2>
            <p className="mt-3 max-w-2xl text-emerald-50">
              Tell us your problem. Our support team will help you choose the
              right service.
            </p>
          </div>

          <button
            onClick={() => setIsQuoteOpen(true)}
            className="rounded-2xl bg-white px-7 py-4 font-bold text-emerald-700 hover:bg-emerald-50"
          >
            Request Quote
          </button>
        </div>
      </section>

      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </>
  );
}

export default Home;