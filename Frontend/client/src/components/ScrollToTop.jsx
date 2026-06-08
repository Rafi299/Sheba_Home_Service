import { useEffect, useState } from "react";

function ScrollToTop() {
  const [showButton, setShowButton] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const scrolled = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const totalScroll = documentHeight - windowHeight;

    const progress =
      totalScroll > 0 ? Math.min((scrolled / totalScroll) * 100, 100) : 0;

    setScrollProgress(progress);

    if (scrolled > 300) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!showButton) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="relative grid h-14 w-14 place-items-center rounded-full bg-white shadow-xl ring-1 ring-slate-200 transition hover:scale-105"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          <path
            d="M1.5 24L0 22.7368L12 0L24 22.7368L22.5 24L12 20.2105L1.5 24Z"
            fill="#059669"
            fillOpacity="0.9"
          />
        </svg>

        <div className="absolute inset-0">
          <svg
            className="h-full w-full"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="2"
            />

            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="#059669"
              strokeWidth="2"
              strokeDasharray={`${scrollProgress}, 100`}
              strokeLinecap="round"
              transform="rotate(-90 16 16)"
            />
          </svg>
        </div>
      </button>
    </div>
  );
}

export default ScrollToTop;