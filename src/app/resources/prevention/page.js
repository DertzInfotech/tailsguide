'use client';

import Link from 'next/link';

const TIPS = [
  {
    title: 'Secure Your Home & Yard',
    items: ['Check fences and gates', 'Secure window screens', 'Be cautious with open doors'],
  },
  {
    title: 'Identification is Key',
    items: ['Use ID tags', 'Microchip your pet', 'Consider GPS tracking'],
  },
  {
    title: 'Training & Leash Safety',
    items: ['Train recall commands', 'Always use a leash', 'Check harness fit'],
  },
  {
    title: 'Be Prepared',
    items: ['Keep recent photos', 'Emergency contacts list', 'Prepare a lost pet flyer'],
  },
];

export default function PreventionTipsPage() {
  return (
    <div className="bg-[#fffaf3] min-h-screen px-4 py-12 max-w-7xl mx-auto">
      <Link
        href="/resources"
        className="mb-6 inline-flex text-orange-600 font-semibold hover:text-orange-700"
      >
        ← Back to Resources
      </Link>

      <div className="bg-orange-50 rounded-2xl p-10 text-center mb-12 mt-4">
        <h1 className="text-3xl font-bold text-orange-600 mb-2">
          Pet Safety & Prevention Tips
        </h1>
        <p className="text-gray-700">
          Proactive steps are the best way to keep your pet safe.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {TIPS.map((tip) => (
          <div key={tip.title} className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-orange-600 font-bold mb-2 text-lg">{tip.title}</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {tip.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
