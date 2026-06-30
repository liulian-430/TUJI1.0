import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../components/common/GlassCard'
import Button from '../components/common/Button'
import BudgetOverview from '../components/common/BudgetOverview'
import ExpenseList from '../components/common/ExpenseList'
import { 
  Plus, TrendingUp, PieChart, 
  ChevronLeft, Wallet, Edit3
} from 'lucide-react'
import useTripStore from '../store/useTripStore'
import useUIStore from '../store/useUIStore'
import { BUDGET_CATEGORIES } from '../data/pois'
import { formatCurrency } from '../utils/helpers'

const Budget = () => {
  const navigate = useNavigate()
  const { budget, expenses, setBudget, addExpense, updateExpense, deleteExpense, getTotalExpenses, getExpensesByCategory } = useTripStore()
  const { successToast, errorToast } = useUIStore()
  
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [budgetForm, setBudgetForm] = useState({
    total: budget.total,
    ...budget.categories
  })

  const totalSpent = getTotalExpenses()

  const handleAddExpense = () => {
    setEditingExpense(null)
    setFormData({
      name: '',
      amount: '',
      category: 'food',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    })
    setShowAddExpense(true)
  }

  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
    setFormData({
      name: expense.name || '',
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      notes: expense.notes || ''
    })
    setShowAddExpense(true)
  }

  const handleSaveExpense = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errorToast('请输入有效的金额')
      return
    }

    const expenseData = {
      name: formData.name || BUDGET_CATEGORIES.find(c => c.id === formData.category)?.label,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: new Date(formData.date).getTime(),
      notes: formData.notes
    }

    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData)
      successToast('花费已更新')
    } else {
      addExpense(expenseData)
      successToast('花费已添加')
    }

    setShowAddExpense(false)
  }

  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('确定要删除这条花费记录吗？')) {
      deleteExpense(expenseId)
      successToast('已删除')
    }
  }

  const handleSaveBudget = () => {
    const total = parseFloat(budgetForm.total) || 0
    const categories = {}
    BUDGET_CATEGORIES.forEach(cat => {
      categories[cat.id] = parseFloat(budgetForm[cat.id]) || 0
    })
    setBudget(total, categories)
    successToast('预算已更新')
    setShowBudgetEdit(false)
  }

  const categoryStats = BUDGET_CATEGORIES.map(cat => {
    const catExpenses = getExpensesByCategory(cat.id)
    const spent = catExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    return {
      ...cat,
      spent,
      budget: budget.categories[cat.id] || 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 pb-24 md:pb-0">
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-white/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">预算管理</h1>
            <button
              onClick={() => {
                setBudgetForm({
                  total: budget.total,
                  ...budget.categories
                })
                setShowBudgetEdit(true)
              }}
              className="ml-auto p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Edit3 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <BudgetOverview
          totalBudget={budget.total}
          spentAmount={totalSpent}
          categoryBudgets={budget.categories}
          expenses={expenses}
          className="mb-6"
        />

        <GlassCard className="p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <PieChart size={20} className="text-purple-500" />
              分类统计
            </h3>
          </div>
          <div className="space-y-3">
            {categoryStats.map((cat) => {
              const percentage = cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0
              const isOver = cat.spent > cat.budget && cat.budget > 0
              
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{cat.label}</span>
                    <div className="text-right">
                      <span className={`font-medium ${isOver ? 'text-rose-500' : 'text-gray-800'}`}>
                        {formatCurrency(cat.spent)}
                      </span>
                      {cat.budget > 0 && (
                        <span className="text-gray-400"> / {formatCurrency(cat.budget)}</span>
                      )}
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver
                          ? 'bg-gradient-to-r from-rose-500 to-red-500'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>

        <ExpenseList
          expenses={expenses}
          onAdd={handleAddExpense}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />
      </div>

      <div className="fixed bottom-20 md:bottom-8 right-6 z-20">
        <button
          onClick={handleAddExpense}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/30 flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Plus size={28} />
        </button>
      </div>

      {showAddExpense && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAddExpense(false)}
          />
          <div className="relative w-full max-w-md animate-slide-up">
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {editingExpense ? '编辑花费' : '添加花费'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    金额
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">¥</span>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-lg font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分类
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {BUDGET_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                        className={`
                          p-3 rounded-xl text-center transition-all
                          ${formData.category === cat.id
                            ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-400'
                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                          }
                        `}
                      >
                        <div className="text-xl mb-1">
                          {cat.id === 'transport' ? '🚗' :
                           cat.id === 'accommodation' ? '🏨' :
                           cat.id === 'food' ? '🍽️' :
                           cat.id === 'tickets' ? '🎫' :
                           cat.id === 'shopping' ? '🛍️' : '📦'}
                        </div>
                        <p className="text-xs font-medium text-gray-700">{cat.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    日期
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    备注（可选）
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="花费名称"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1"
                >
                  取消
                </Button>
                <Button onClick={handleSaveExpense} className="flex-1">
                  保存
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {showBudgetEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowBudgetEdit(false)}
          />
          <div className="relative w-full max-w-md animate-slide-up">
            <GlassCard className="p-6 max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-6">设置预算</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    总预算
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                    <input
                      type="number"
                      value={budgetForm.total}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, total: e.target.value }))}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-3">分类预算（可选）</p>
                  <div className="space-y-3">
                    {BUDGET_CATEGORIES.map((cat) => (
                      <div key={cat.id} className="flex items-center gap-3">
                        <span className="w-20 text-sm text-gray-600 flex items-center gap-1">
                          {cat.id === 'transport' ? '🚗' :
                           cat.id === 'accommodation' ? '🏨' :
                           cat.id === 'food' ? '🍽️' :
                           cat.id === 'tickets' ? '🎫' :
                           cat.id === 'shopping' ? '🛍️' : '📦'}
                          {cat.label}
                        </span>
                        <div className="flex-1 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
                          <input
                            type="number"
                            value={budgetForm[cat.id] || ''}
                            onChange={(e) => setBudgetForm(prev => ({ ...prev, [cat.id]: e.target.value }))}
                            placeholder="0"
                            className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowBudgetEdit(false)}
                  className="flex-1"
                >
                  取消
                </Button>
                <Button onClick={handleSaveBudget} className="flex-1">
                  保存
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  )
}

export default Budget
