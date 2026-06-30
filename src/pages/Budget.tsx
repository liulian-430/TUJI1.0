import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  DollarSign,
  Plus,
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Trash2,
} from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { useTripStore } from '@/store/useTripStore';
import { useUIStore } from '@/store/useUIStore';
import { BUDGET_CATEGORIES } from '@/config/constants';
import { formatCurrency, formatDate } from '@/utils/format';
import type { Budget, Expense } from '@/store/useTripStore';

export function Budget() {
  const { id } = useParams();
  const trip = useTripStore((state) => state.trips.find((t) => t.id === id));
  const getBudget = useTripStore((state) => state.getBudget);
  const setBudget = useTripStore((state) => state.setBudget);
  const getExpenses = useTripStore((state) => state.getExpenses);
  const addExpense = useTripStore((state) => state.addExpense);
  const deleteExpense = useTripStore((state) => state.deleteExpense);
  const addToast = useUIStore((state) => state.addToast);

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState<{
    category: 'transportation' | 'accommodation' | 'food' | 'ticket' | 'shopping' | 'other';
    amount: number;
    date: string;
    note: string;
  }>({
    category: 'food',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <GlassCard className="text-center py-12">
          <p className="text-gray-500">行程不存在</p>
          <Link to="/">
            <Button className="mt-4">返回首页</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const budget = getBudget(trip.id) || {
    tripId: trip.id,
    totalBudget: 0,
    transportation: 0,
    accommodation: 0,
    food: 0,
    ticket: 0,
    shopping: 0,
    other: 0,
  };
  const expenses = getExpenses(trip.id);

  // 计算各分类花费
  const expenseByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget.totalBudget - totalExpense;
  const isOverBudget = remaining < 0;

  const handleSetBudget = () => {
    // 简化的预算设置逻辑
    addToast({ type: 'success', message: '预算已设置' });
    setShowBudgetModal(false);
  };

  const handleAddExpense = () => {
    if (expenseForm.amount <= 0) {
      addToast({ type: 'error', message: '请输入有效金额' });
      return;
    }

    addExpense(trip.id, {
      tripId: trip.id,
      category: expenseForm.category,
      amount: expenseForm.amount,
      date: expenseForm.date,
      note: expenseForm.note,
    });

    addToast({ type: 'success', message: '花费已记录' });
    setShowExpenseModal(false);
    setExpenseForm({
      category: 'food',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      note: '',
    });
  };

  const handleDeleteExpense = (expenseId: string) => {
    deleteExpense(trip.id, expenseId);
    addToast({ type: 'success', message: '花费已删除' });
  };

  const progressPercent = Math.min((totalExpense / budget.totalBudget) * 100, 100);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      {/* 返回按钮 */}
      <Link
        to={`/trip/${trip.id}`}
        className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>返回行程详情</span>
      </Link>

      {/* 预算概览 */}
      <GlassCard className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            预算管理
          </h1>
          <Button onClick={() => setShowBudgetModal(true)} size="sm">
            设置预算
          </Button>
        </div>

        {/* 总预算进度 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">总预算使用进度</span>
            <span className="text-sm font-medium">
              {progressPercent.toFixed(1)}%
            </span>
          </div>
          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              className={twMerge(
                clsx(
                  'h-full rounded-full transition-all',
                  isOverBudget
                    ? 'bg-gradient-to-r from-red-500 to-rose-500'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                )
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-gray-500 mb-2">总预算</p>
            <p className="font-bold text-xl gradient-text">
              {formatCurrency(budget.totalBudget)}
            </p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-gray-500 mb-2">已花费</p>
            <p className={twMerge(clsx('font-bold text-xl', isOverBudget ? 'text-red-500' : 'text-gray-800'))}>
              {formatCurrency(totalExpense)}
            </p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-gray-500 mb-2">剩余预算</p>
            <p className={twMerge(clsx('font-bold text-xl', isOverBudget ? 'text-red-500' : 'text-emerald-500'))}>
              {formatCurrency(remaining)}
            </p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-gray-500 mb-2">状态</p>
            <div className="flex items-center justify-center gap-2">
              {isOverBudget ? (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              )}
              <span className={twMerge(clsx('font-semibold', isOverBudget ? 'text-red-500' : 'text-emerald-500'))}>
                {isOverBudget ? '超支' : '正常'}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 各分类预算 */}
      <GlassCard className="mb-6">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
          分类预算进度
        </h2>
        <div className="space-y-3">
          {BUDGET_CATEGORIES.map((cat) => {
            const budgetAmount = Number(budget[cat.key as keyof Budget] || 0);
            const spent = Number(expenseByCategory[cat.key] || 0);
            const percent = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
            const isOver = spent > budgetAmount;

            const colorClassMap: Record<string, string> = {
              'blue': 'bg-blue-500',
              'purple': 'bg-purple-500',
              'orange': 'bg-orange-500',
              'green': 'bg-green-500',
              'pink': 'bg-pink-500',
              'gray': 'bg-gray-500',
            };

            return (
              <div key={cat.key} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 w-16">{cat.label}</span>
                <div className="flex-1">
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={twMerge(
                        clsx(
                          'h-full rounded-full',
                          isOver ? 'bg-red-500' : colorClassMap[cat.color]
                        )
                      )}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                </div>
                <span className={twMerge(clsx('text-sm font-medium w-24 text-right', isOver && 'text-red-500'))}>
                  {formatCurrency(spent)} / {formatCurrency(budgetAmount)}
                </span>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* 花费记录 */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">
            花费记录
          </h2>
          <Button onClick={() => setShowExpenseModal(true)} size="sm" icon={<Plus className="w-4 h-4" />}>
            添加花费
          </Button>
        </div>

        {expenses.length > 0 ? (
          <div className="space-y-3">
            {expenses.map((expense) => {
              const cat = BUDGET_CATEGORIES.find((c) => c.key === expense.category);
              return (
                <div key={expense.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800">{cat?.label || expense.category}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(expense.date)}
                      </span>
                    </div>
                    {expense.note && (
                      <p className="text-xs text-gray-500">{expense.note}</p>
                    )}
                  </div>
                  <span className="font-semibold text-red-500">
                    -{formatCurrency(expense.amount)}
                  </span>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="p-1 rounded hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>暂无花费记录</p>
            <Button className="mt-4" onClick={() => setShowExpenseModal(true)} size="sm">
              添加花费
            </Button>
          </div>
        )}
      </GlassCard>

      {/* 设置预算模态框 */}
      <Modal isOpen={showBudgetModal} onClose={() => setShowBudgetModal(false)} title="设置预算">
        <div className="space-y-4">
          <Input
            label="总预算"
            type="number"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <p className="text-sm text-gray-500">预算设置功能将在后续版本中完善</p>
          <Button onClick={() => setShowBudgetModal(false)}>关闭</Button>
        </div>
      </Modal>

      {/* 添加花费模态框 */}
      <Modal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} title="添加花费">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
            <div className="flex flex-wrap gap-2">
              {BUDGET_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setExpenseForm({ ...expenseForm, category: cat.key })}
                  className={twMerge(
                    clsx(
                      'px-3 py-1.5 rounded-xl text-sm transition-all',
                      expenseForm.category === cat.key
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600 border border-indigo-500/30'
                        : 'bg-white/10 text-gray-600 hover:bg-white/20'
                    )
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="金额"
            type="number"
            icon={<DollarSign className="w-5 h-5" />}
            value={expenseForm.amount}
            onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
          />

          <Input
            label="日期"
            type="date"
            value={expenseForm.date}
            onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
          />

          <Input
            label="备注"
            placeholder="可选"
            value={expenseForm.note}
            onChange={(e) => setExpenseForm({ ...expenseForm, note: e.target.value })}
          />

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setShowExpenseModal(false)}>
              取消
            </Button>
            <Button onClick={handleAddExpense}>确认添加</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}