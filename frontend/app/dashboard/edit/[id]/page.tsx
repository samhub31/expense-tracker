"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

const CATEGORIES = ["Food", "Transport", "Rent", "Entertainment", "Healthcare", "Shopping", "Utilities", "Other"]

export default function EditExpensePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchExpense(token)
  }, [id, router])

  const fetchExpense = async (token: string) => {
    try {
      const response = await fetch(`https://expense-tracker-api-j7vf.onrender.com/api/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch expense")

      const data = await response.json()
      setTitle(data.title)
      setAmount(data.amount.toString())
      setCategory(data.category)
      setDate(new Date(data.date).toISOString().split("T")[0])
      setDescription(data.description || "")
    } catch (error) {
      console.error(error)
      setError("Failed to load expense")
    } finally {
      setFetching(false)
    }
  }

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
      const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: "PUT",
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
        throw new Error(data.message || "Failed to update expense")
      }

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-black"></span>
          <p className="mt-4 text-gray-600">Loading expense...</p>
        </div>
      </div>
    )
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-black">Edit Expense</h2>
                <p className="text-gray-600">Update your expense details</p>
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
                  {loading ? <span className="loading loading-spinner"></span> : "Update Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
