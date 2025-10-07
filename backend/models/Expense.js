import mongoose from "mongoose"

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Please provide an amount"],
      min: [0, "Amount cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: ["Food", "Transport", "Rent", "Entertainment", "Healthcare", "Shopping", "Utilities", "Other"],
    },
    date: {
      type: Date,
      required: [true, "Please provide a date"],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster queries
expenseSchema.index({ user: 1, date: -1 })
expenseSchema.index({ user: 1, category: 1 })

const Expense = mongoose.model("Expense", expenseSchema)

export default Expense
