import React, { useState } from 'react'
import GlassCard from './GlassCard'
import Button from './Button'
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react'
import { BUDGET_CATEGORIES } from '../../data/pois'
import { formatCurrency, formatDate } from '../../utils/helpers'

const ExpenseList = ({ expenses = [], onAdd, onEdit, onDelete, className = '' }) => {
  const [expanded, setExpanded] = useState(true)
  const [filterCategory, setFilterCategory] = useState('all')

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

  const getCategoryInfo = (categoryId) => {
    return BUDGET_CATEGORIES.find(c => c.id === categoryId) || BUDGET_CATEGORIES[5]
  }

  const filteredExpenses = filterCategory === 'all'
    ? expenses
    : expenses.filter(exp => exp.category === filterCategory)

  const sortedExpenses = [...filteredExpenses].sort((a, b) => b.createdAt - a.createdAt)

  const groupedByDate = sortedExpenses.reduce((groups, expense) => {
    const date = formatDate(expense.date || expense.createdAt, 'YYYY-MM-DD')
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(expense)
    return groups
  }, {})

  return (
    <GlassCard className={`${className}`}>
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">花费记录</h3>
          {onAdd && (
            <Button size="sm" variant="primary" icon={Plus} onClick={onAdd}>
              添加
            </Button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterCategory === 'all'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {BUDGET_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterCategory === cat.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {getCategoryIcon(cat.icon)} {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        {sortedExpenses.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📝</p>
            <p>暂无花费记录</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([date, dayExpenses]) => {
              const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0)
              return (
                <div key={date}>
                  <div className="flex items-center justify-between mb-2 px-2">
                    <span className="text-sm font-medium text-gray-500">{date}</span>
                    <span className="text-sm font-bold text-gray-700">{formatCurrency(dayTotal)}</span>
                  </div>
                  <div className="space-y-2">
                    {dayExpenses.map((expense) => {
                      const catInfo = getCategoryInfo(expense.category)
                      return (
                        <div
                          key={expense.id}
                          className="flex items-center gap-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xl">
                            {getCategoryIcon(catInfo.icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {expense.name || catInfo.label}
                            </p>
                            {expense.notes && (
                              <p className="text-xs text-gray-500 truncate">{expense.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">-{formatCurrency(expense.amount)}</p>
                          </div>
                          {(onEdit || onDelete) && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {onEdit && (
                                <button
                                  onClick={() => onEdit(expense)}
                                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600"
                                >
                                  <Edit2 size={14} />
                                </button>
                              )}
                              {onDelete && (
                                <button
                                  onClick={() => onDelete(expense.id)}
                                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-rose-500"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </GlassCard>
  )
}

export default ExpenseList
