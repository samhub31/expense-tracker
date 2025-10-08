import express from "express"
import { body, validationResult } from "express-validator"
import Expense from "../models/Expense.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

router.use(protect)


//    Getting all expenses for logged in user

router.get("/", async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query


    const query = { user: req.user._id }

    if (category) {
      query.category = category
    }

    if (startDate || endDate) {
      query.date = {}
      if (startDate) {
        query.date.$gte = new Date(startDate)
      }
      if (endDate) {
        query.date.$lte = new Date(endDate)
      }
    }

    const expenses = await Expense.find(query).sort({ date: -1 })
    res.json(expenses)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

//   Get expense stats by category
router.get("/stats", async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const matchStage = { user: req.user._id }

    if (startDate || endDate) {
      matchStage.date = {}
      if (startDate) {
        matchStage.date.$gte = new Date(startDate)
      }
      if (endDate) {
        matchStage.date.$lte = new Date(endDate)
      }
    }

    const stats = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ])

    // Calculate total spending
    const totalSpending = stats.reduce((sum, stat) => sum + stat.total, 0)

    res.json({
      byCategory: stats,
      totalSpending,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

//  Get spending trends per month, week or day
router.get("/trends", async (req, res) => {
  try {
    const { period = "month" } = req.query

    let groupBy
    if (period === "day") {
      groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
    } else if (period === "week") {
      groupBy = { $dateToString: { format: "%Y-W%V", date: "$date" } }
    } else {
      groupBy = { $dateToString: { format: "%Y-%m", date: "$date" } }
    }

    const trends = await Expense.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: groupBy,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.json(trends)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})





//  Create new expense

router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("amount").isFloat({ min: 0 }).withMessage("Amount must be a positive number"),
    body("category")
      .isIn(["Food", "Transport", "Rent", "Entertainment", "Healthcare", "Shopping", "Utilities", "Other"])
      .withMessage("Invalid category"),
    body("date").optional().isISO8601().withMessage("Invalid date format"),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { title, amount, category, date, description } = req.body

      const expense = await Expense.create({
        user: req.user._id,
        title,
        amount,
        category,
        date: date || Date.now(),
        description,
      })

      res.status(201).json(expense)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)


// Update expense

router.put(
  "/:id",
  [
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("amount").optional().isFloat({ min: 0 }).withMessage("Amount must be a positive number"),
    body("category")
      .optional()
      .isIn(["Food", "Transport", "Rent", "Entertainment", "Healthcare", "Shopping", "Utilities", "Other"])
      .withMessage("Invalid category"),
    body("date").optional().isISO8601().withMessage("Invalid date format"),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      let expense = await Expense.findById(req.params.id)

      if (!expense) {
        return res.status(404).json({ message: "Expense not found" })
      }

      // Making sure user owns expense
      if (expense.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" })
      }

      const { title, amount, category, date, description } = req.body

      expense = await Expense.findByIdAndUpdate(
        req.params.id,
        { title, amount, category, date, description },
        { new: true, runValidators: true },
      )

      res.json(expense)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)


// Delete expense
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    // Making sure user owns expense
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    await expense.deleteOne()

    res.json({ message: "Expense removed" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
