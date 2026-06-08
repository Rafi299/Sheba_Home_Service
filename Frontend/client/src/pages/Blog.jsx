import { Link } from "react-router-dom";

import SectionTitle from "../components/SectionTitle";
import { blogData } from "../data/blogData";

const fallbackBlogImage =
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80";

const blogBanner =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80";

function Blog() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 py-24">
        <div className="absolute inset-0">
          <img
            src={blogBanner}
            alt="Blog writing desk banner"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-slate-950/75"></div>
        </div>

        <div className="container-custom relative text-center">
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
              <div className="h-52 overflow-hidden bg-gradient-to-br from-emerald-100 to-slate-200">
                <img
                  src={blog.image || fallbackBlogImage}
                  alt={blog.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  onError={(event) => {
                    event.currentTarget.src = fallbackBlogImage;
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

                <Link
                  to={`/blog/${blog.slug}`}
                  className="mt-5 inline-flex font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default Blog;