import { Link, useParams } from "react-router-dom";

import { blogData } from "../data/blogData";

const fallbackBlogImage =
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80";

function BlogDetails() {
  const { slug } = useParams();

  const blog = blogData.find((item) => item.slug === slug);

  if (!blog) {
    return (
      <section className="container-custom grid min-h-[60vh] place-items-center py-20 text-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900">
            Blog not found
          </h1>

          <p className="mt-4 text-slate-600">
            The article you are looking for does not exist.
          </p>

          <Link
            to="/blog"
            className="mt-8 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
          >
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-slate-950 py-20">
        <div className="container-custom">
          <Link
            to="/blog"
            className="mb-6 inline-flex font-bold text-emerald-300 hover:text-emerald-200"
          >
            ← Back to Blog
          </Link>

          <p className="mb-4 font-bold text-emerald-400">{blog.category}</p>

          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white">
            {blog.title}
          </h1>

          <p className="mt-5 text-slate-300">{blog.date}</p>
        </div>
      </section>

      <section className="container-custom py-16">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[36px] bg-white shadow-sm ring-1 ring-slate-200">
          <img
            src={blog.image || fallbackBlogImage}
            alt={blog.title}
            className="h-[420px] w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = fallbackBlogImage;
            }}
          />

          <div className="p-8 md:p-10">
            <p className="text-xl leading-9 text-slate-600">
              {blog.description}
            </p>

            <div className="mt-8 space-y-5">
              {(blog.content || []).map((paragraph, index) => (
                <p key={index} className="leading-8 text-slate-700">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 rounded-3xl bg-emerald-50 p-6">
              <h2 className="text-2xl font-black text-slate-900">
                Need professional help?
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Browse our services and book a trusted expert for your home.
              </p>

              <Link
                to="/services"
                className="mt-5 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
              >
                Browse Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogDetails;