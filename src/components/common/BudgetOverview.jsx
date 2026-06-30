import React from 'react'
import GlassCard from './GlassCard'
import { BUDGET_CATEGORIES } from '../../data/pois'
import { formatCurrency } from '../../utils/helpers'

const BudgetOverview = ({ totalBudget, spentAmount, categoryBudgets = {}, expenses = [], className = '' }) => {
  const remaining = totalBudget - spentAmount
  const percentage = totalBudget > 0 ? (spentAmount / totalBudget) * 100 : 0
  const isOverBudget = spentAmount > totalBudget

  const getCategorySpent = (categoryId) => {
    return expenses
      .filter(exp => exp.category === categoryId)
      .reduce((sum, exp) => sum + exp.amount, 0)
  }

  const getCategoryIcon = (iconName) => {
    const icons = {
      Car: '🚗',
      Hotel: '🏨',
      Utensils: '🍽️',
      Ticket: '🎫',
      ShoppingBag: '🛍️',
      MoreHorizontal: '📦'
    }
    return icons[iconName] || '📦'
  }

  return (
    <GlassCard className={`p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">预算概览</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalBudget)}</p>
            <p className="text-xs text-gray-500 mt-1">总预算</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${isOverBudget ? 'text-rose-500' : 'text-indigo-600'}`}>
              {formatCurrency(spentAmount)}
            </p>
            <p className="text-xs text-gray-500 mt-1">已花费</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${remaining < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {formatCurrency(remaining)}
            </p>
            <p className="text-xs text-gray-500 mt-1">剩余</p>
          </div>
        </div>

        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
              isOverBudget
                ? 'bg-gradient-to-r from-rose-500 to-red-500'
                : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="text-right text-xs text-gray-500 mt-2">{percentage.toFixed(1)}%</p>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">分类预算</h4>
        {BUDGET_CATEGORIES.map((category) => {
          const categoryBudget = categoryBudgets[category.id] || 0
          const categorySpent = getCategorySpent(category.id)
          const catPercentage = categoryBudget > 0 ? (categorySpent / categoryBudget) * 100 : 0
          const isCatOver = categorySpent > categoryBudget && categoryBudget > 0

          return (
            <div key={category.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryIcon(category.icon)}</span>
                  <span className="text-gray-700">{category.label}</span>
                </div>
                <div className="text-right">
                  <span className={`font-medium ${isCatOver ? 'text-rose-500' : 'text-gray-700'}`}>
                    {formatCurrency(categorySpent)}
                  </span>
                  <span className="text-gray-400"> / {formatCurrency(categoryBudget)}</span>
                </div>
              </div>
              {categoryBudget > 0 && (
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCatOver
                        ? 'bg-gradient-to-r from-rose-400 to-red-400'
                        : 'bg-gradient-to-r from-indigo-400 to-purple-400'
                    }`}
                    style={{ width: `${Math.min(catPercentage, 100)}%` }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}

export default BudgetOverview
