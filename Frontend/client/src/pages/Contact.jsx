function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const contactData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    console.log("Contact message:", contactData);
    alert("Message sent successfully.");

    event.currentTarget.reset();
  };

  return (
    <>
      <section className="bg-slate-950 py-20">
        <div className="container-custom text-center">
          <p className="mb-4 font-bold text-emerald-400">Contact</p>

          <h1 className="text-5xl font-black tracking-tight text-white">
            Get in touch with us
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Need help choosing a service? Send us a message and our team will
            contact you.
          </p>
        </div>
      </section>

      <section className="container-custom py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-5">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-xl font-black text-slate-900">Phone</h3>
              <p className="mt-2 text-slate-600">01XXXXXXXXX</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-xl font-black text-slate-900">Email</h3>
              <p className="mt-2 text-slate-600">support@sheba.com</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-xl font-black text-slate-900">Address</h3>
              <p className="mt-2 text-slate-600">Dhaka, Bangladesh</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <input
                name="name"
                type="text"
                placeholder="Your name"
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email address"
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />
            </div>

            <input
              name="phone"
              type="text"
              placeholder="Phone number"
              className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              required
            />

            <textarea
              name="message"
              rows="6"
              placeholder="Write your message"
              className="mt-5 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              required
            ></textarea>

            <button className="mt-5 rounded-xl bg-emerald-600 px-7 py-3 font-bold text-white hover:bg-emerald-700">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Contact;