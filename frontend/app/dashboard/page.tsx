"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Expense {
  _id: string
  title: string
  amount: number
  category: string
  date: string
  description?: string
}

interface Stats {
  byCategory: Array<{
    _id: string
    total: number
    count: number
  }>
  totalSpending: number
}

interface Trend {
  _id: string
  total: number
  count: number
}

const categoryIcons: Record<string, string> = {
  Food: "🍽️",
  Transport: "🚗",
  Rent: "🏠",
  Entertainment: "🎬",
  Healthcare: "⚕️",
  Shopping: "🛍️",
  Utilities: "💡",
  Other: "📦",
}

const CATEGORIES = ["Food", "Transport", "Rent", "Entertainment", "Healthcare", "Shopping", "Utilities", "Other"]

export default function DashboardPage() {
  const router = useRouter()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [trends, setTrends] = useState<Trend[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStartDate, setFilterStartDate] = useState<string>("")
  const [filterEndDate, setFilterEndDate] = useState<string>("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token) {
      router.push("/login")
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    fetchExpenses(token)
    fetchStats(token)
    fetchTrends(token)
  }, [router])

  useEffect(() => {
    applyFilters()
  }, [expenses, filterCategory, filterStartDate, filterEndDate])

  const fetchExpenses = async (token: string) => {
    try {
      const response = await fetch("https://expense-tracker-api-j7vf.onrender.com/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch expenses")

      const data = await response.json()
      setExpenses(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async (token: string) => {
    try {
      const response = await fetch("https://expense-tracker-api-j7vf.onrender.com/api/expenses/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch stats")

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchTrends = async (token: string) => {
    try {
      const response = await fetch("https://expense-tracker-api-j7vf.onrender.com/api/expenses/trends?period=month", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch trends")

      const data = await response.json()
      setTrends(data)
    } catch (error) {
      console.error(error)
    }
  }

  const applyFilters = () => {
    let filtered = [...expenses]

    if (filterCategory !== "all") {
      filtered = filtered.filter((exp) => exp.category === filterCategory)
    }

    if (filterStartDate) {
      filtered = filtered.filter((exp) => new Date(exp.date) >= new Date(filterStartDate))
    }

    if (filterEndDate) {
      filtered = filtered.filter((exp) => new Date(exp.date) <= new Date(filterEndDate))
    }

    setFilteredExpenses(filtered)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token")
    if (!token) return

    if (!confirm("Are you sure you want to delete this expense?")) return

    try {
      const response = await fetch(`https://expense-tracker-api-j7vf.onrender.com/api/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to delete expense")

      fetchExpenses(token)
      fetchStats(token)
      fetchTrends(token)
    } catch (error) {
      console.error(error)
    }
  }

  const clearFilters = () => {
    setFilterCategory("all")
    setFilterStartDate("")
    setFilterEndDate("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-black"></span>
          <p className="mt-4 text-gray-600">Loading your expenses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r-2 border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b-2 border-gray-200">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
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
            <span className="text-xl font-bold">Expense Tracker</span>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-black text-white rounded-full w-10">
                <span className="text-lg">{user?.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="font-bold mb-3 text-sm uppercase text-gray-600">Filters</h3>

          <div className="space-y-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-semibold">Category</span>
              </label>
              <select
                className="select select-sm select-bordered border-2 w-full"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-semibold">Start Date</span>
              </label>
              <input
                type="date"
                className="input input-sm input-bordered border-2 w-full"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-semibold">End Date</span>
              </label>
              <input
                type="date"
                className="input input-sm input-bordered border-2 w-full"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
              />
            </div>

            <button onClick={clearFilters} className="btn btn-sm btn-outline w-full">
              Clear Filters
            </button>
          </div>

          {(filterCategory !== "all" || filterStartDate || filterEndDate) && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-center">
              {filteredExpenses.length} of {expenses.length} expenses
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="p-4 border-t-2 border-gray-200">
          <button onClick={handleLogout} className="btn btn-sm btn-outline w-full gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b-2 border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link href="/dashboard/add" className="btn btn-sm gap-2 bg-black text-white hover:bg-gray-800 border-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </Link>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* Left Column - Stats and Chart */}
            <div className="col-span-8 flex flex-col gap-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600 uppercase">Total</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                  <p className="text-2xl font-bold">${stats?.totalSpending.toFixed(2) || 0}</p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600 uppercase">Expenses</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold">{expenses.length}</p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600 uppercase">Categories</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold">{stats?.byCategory.length || 0}</p>
                </div>
              </div>

              {/* Spending Trends Chart */}
              {trends.length > 0 && (
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex-1">
                  <h3 className="font-bold mb-3 text-sm">SPENDING TRENDS</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="_id" stroke="#6b7280" style={{ fontSize: "12px" }} />
                      <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "2px solid #e5e7eb",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#000000"
                        strokeWidth={2}
                        dot={{ fill: "#000000" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Right Column - Category Stats and Recent Expenses */}
            <div className="col-span-4 flex flex-col gap-4">
              {/* Category Stats */}
              {stats && stats.byCategory.length > 0 && (
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold mb-3 text-sm">BY CATEGORY</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {stats.byCategory.map((cat) => (
                      <div
                        key={cat._id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{categoryIcons[cat._id]}</span>
                          <div>
                            <p className="font-semibold text-sm">{cat._id}</p>
                            <p className="text-xs text-gray-500">{cat.count} items</p>
                          </div>
                        </div>
                        <p className="font-bold">${cat.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Expenses */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex-1 flex flex-col">
                <h3 className="font-bold mb-3 text-sm">RECENT EXPENSES</h3>
                {filteredExpenses.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-sm text-gray-600">No expenses found</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {filteredExpenses.slice(0, 10).map((expense) => (
                      <div
                        key={expense._id}
                        className="p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{expense.title}</p>
                            <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                          </div>
                          <p className="font-bold ml-2">${expense.amount.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded border border-gray-300 text-xs">
                            <span>{categoryIcons[expense.category]}</span>
                            <span>{expense.category}</span>
                          </span>
                          <div className="flex gap-1">
                            <Link
                              href={`/dashboard/edit/${expense._id}`}
                              className="btn btn-xs btn-ghost btn-square border border-gray-300"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleDelete(expense._id)}
                              className="btn btn-xs btn-ghost btn-square border border-gray-300 hover:bg-black hover:text-white"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
