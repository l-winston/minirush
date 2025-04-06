import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <main className="flex flex-col items-center px-6 sm:px-12 py-20 gap-32">
        
        {/* 🔥 Hero Section */}
        <section className="flex flex-col items-center text-center gap-6">
          <Image
            src="/your-logo.png" // replace with personal logo or photo
            alt="Winston Liu logo"
            width={100}
            height={100}
            className="rounded-full border border-white/10"
          />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Winston Liu</h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-xl">
            Software Engineer • Builder • Car Enthusiast
          </p>
        </section>

        {/* 👨‍💻 About Section */}
        <section className="w-full max-w-4xl flex flex-col gap-4">
          <h2 className="text-2xl font-semibold border-b border-white/10 pb-2">About</h2>
          <p className="text-white/70">
            [Placeholder] A short paragraph about you, your background, interests, etc.
          </p>
        </section>

        {/* 🚀 Projects Section */}
        <section className="w-full max-w-4xl flex flex-col gap-4">
          <h2 className="text-2xl font-semibold border-b border-white/10 pb-2">Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Project Card Placeholder */}
            <div className="border border-white/10 rounded-xl p-4 bg-white/5">
              <h3 className="text-xl font-semibold">Project Title</h3>
              <p className="text-white/60 text-sm">Short project description goes here.</p>
            </div>
            <div className="border border-white/10 rounded-xl p-4 bg-white/5">
              <h3 className="text-xl font-semibold">Another Project</h3>
              <p className="text-white/60 text-sm">Something cool you built.</p>
            </div>
          </div>
        </section>

        {/* 💼 Experience Section (Optional) */}
        <section className="w-full max-w-4xl flex flex-col gap-4">
          <h2 className="text-2xl font-semibold border-b border-white/10 pb-2">Experience</h2>
          <ul className="text-white/70 list-disc list-inside space-y-2">
            <li>[Placeholder] Company Name – Role</li>
            <li>[Placeholder] Internship or project-based work</li>
          </ul>
        </section>

        {/* 📬 Contact / Footer */}
        <footer className="text-center text-white/50 text-sm mt-32">
          <p>&copy; {new Date().getFullYear()} Winston Liu. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
