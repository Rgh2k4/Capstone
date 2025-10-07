"use client";

export default function ContactWindow({
  companyEmail = "place@holder.com",
  companyPhone = "(111) 111-1111",
}) {
  return (
    <main className="min-h-[80vh] bg-gradient-to-b from-sky-300 to-sky-700 flex flex-col items-center justify-start pt-16">
      <h1 className="text-7xl md:text-8xl font-bold text-gray-200 text-shadow-lg text-shadow-black text-center mb-10">
        Contact Us
      </h1>

      <section className="w-[540px] max-w-[90vw] rounded-2xl bg-white p-8 shadow-lg">
        <form className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Your name..."
            className="h-12 w-full rounded-xl border border-black/30 px-4 outline-none"
          />
          <input
            type="email"
            placeholder="Your email..."
            className="h-12 w-full rounded-xl border border-black/30 px-4 outline-none"
          />
          <textarea
            placeholder="How can we help?"
            className="h-40 w-full resize-none rounded-xl border border-black/30 px-4 py-3 outline-none"
          />
          <input
            type="submit"
            value="Send message"
            className="h-12 w-full cursor-pointer rounded-xl bg-gray-300 text-xl font-semibold"
          />
        </form>
      </section>

      <div className="mt-6 w-[540px] max-w-[90vw] flex flex-col items-center gap-2">
        <div className="w-full rounded-xl bg-white/70 backdrop-blur p-4 text-center shadow">
          <p className="text-gray-700">
            Company Email: <span className="font-semibold">{companyEmail}</span>
          </p>
          <p className="text-gray-700">
            Phone: <span className="font-semibold">{companyPhone}</span>
          </p>
        </div>
      </div>
    </main>
  );
}
