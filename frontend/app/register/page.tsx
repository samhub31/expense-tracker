"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }))

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-white shadow-xl border-2 border-gray-200">
        <div className="card-body">
          <div className="text-center mb-4">
            <div className="inline-block p-3 bg-black rounded-full mb-3">
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-black">Create Account</h2>
            <p className="text-gray-600 mt-2">Join us and start tracking your expenses</p>
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
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered focus:input-primary border-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered focus:input-primary border-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                className="input input-bordered focus:input-primary border-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <label className="label">
                <span className="label-text-alt text-gray-500">Must be at least 6 characters</span>
              </label>
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : "Create Account"}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="link link-primary font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
