"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const CATEGORIES = ["Food", "Transport", "Rent", "Entertainment", "Healthcare", "Shopping", "Utilities", "Other"]

export default function AddExpensePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          amount: Number.parseFloat(amount),
          category,
          date,
          description,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to add expense")
      }

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="navbar bg-white shadow-md sticky top-0 z-50 border-b-2 border-gray-200">
        <div className="flex-1">
          <Link href="/dashboard" className="btn btn-ghost text-lg gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-6 max-w-2xl">
        <div className="card bg-white shadow-xl border-2 border-gray-200">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-black rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-black">Add New Expense</h2>
                <p className="text-gray-600">Track your spending by adding a new expense</p>
              </div>
            </div>

            {error && (
              <div className="alert alert-error shadow-lg bg-black text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Grocery shopping"
                  className="input input-bordered input-lg focus:input-primary border-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Amount</span>
                </label>
                <label className="input-group">
                  <span className="bg-black text-white border-2 border-black">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="input input-bordered input-lg w-full focus:input-primary border-2"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Category</span>
                </label>
                <select
                  className="select select-bordered select-lg focus:select-primary border-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered input-lg focus:input-primary border-2"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Description (Optional)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered textarea-lg focus:textarea-primary border-2"
                  placeholder="Add notes about this expense"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="form-control mt-8">
                <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
                  {loading ? <span className="loading loading-spinner"></span> : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
