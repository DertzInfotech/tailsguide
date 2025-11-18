
export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Welcome to TailsGuide</h1>
      <p className="mt-4">This is your home page. Use the navigation below to visit Pets or Lost & Found.</p>
      <nav className="mt-8 flex gap-4">
        <a href="/pets" className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">Pets</a>
        <a href="/lost-found" className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600">Lost &amp; Found</a>
      </nav>
    </main>
  );
}
