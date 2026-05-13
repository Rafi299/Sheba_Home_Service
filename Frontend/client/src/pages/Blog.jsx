import SectionTitle from "../components/SectionTitle";
import { blogData } from "../data/blogData";

function Blog() {
  return (
    <>
      <section className="bg-slate-950 py-20">
        <div className="container-custom text-center">
          <p className="mb-4 font-bold text-emerald-400">Blog</p>

          <h1 className="text-5xl font-black tracking-tight text-white">
            Tips and service guides
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Learn useful tips about home service, cleaning, repair and
            maintenance.
          </p>
        </div>
      </section>

      <section className="container-custom py-20">
        <SectionTitle
          label="Latest Articles"
          title="Helpful home service articles"
          description="Read simple guides to keep your home safe, clean and comfortable."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogData.map((blog) => (
            <article
              key={blog.id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-52 bg-gradient-to-br from-emerald-100 to-slate-200">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
                    {blog.category}
                  </span>
                  <span className="text-slate-500">{blog.date}</span>
                </div>

                <h2 className="text-xl font-black text-slate-900">
                  {blog.title}
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  {blog.description}
                </p>

                <button className="mt-5 font-bold text-emerald-600 hover:text-emerald-700">
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default Blog;