import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <div className="mb-8">
              <div className="inline-block p-4 bg-primary/10 rounded-2xl mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-6xl font-bold text-gray-800 mb-4">Expense Tracker</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Take control of your finances. Track expenses, analyze spending patterns, and make smarter financial
              decisions with our simple and intuitive expense tracker.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/login" className="btn btn-primary btn-lg px-8">
                Get Started
              </Link>
              <Link href="/register" className="btn btn-outline btn-lg px-8">
                Create Account
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-primary text-3xl mb-2">📊</div>
                <h3 className="font-bold text-lg mb-2">Track Spending</h3>
                <p className="text-sm text-gray-600">Monitor your expenses across multiple categories</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-primary text-3xl mb-2">💡</div>
                <h3 className="font-bold text-lg mb-2">Get Insights</h3>
                <p className="text-sm text-gray-600">Understand your spending patterns with detailed analytics</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-primary text-3xl mb-2">🎯</div>
                <h3 className="font-bold text-lg mb-2">Save Money</h3>
                <p className="text-sm text-gray-600">Make informed decisions to reach your financial goals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
