import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function NewTrip() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 md:pb-8 pt-20 md:pt-24 px-4 md:px-8 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-primary mx-auto mb-6 flex items-center justify-center animate-float">
          <span className="text-5xl text-white">＋</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">创建新行程</h1>
        <p className="text-gray-500 mb-8">选择规划方式开始您的旅行</p>
        <div className="flex flex-col gap-4 max-w-xs mx-auto">
          <button
            onClick={() => navigate('/ai-planner')}
            className="gradient-button flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            <span>AI 智能规划</span>
          </button>
          <button
            onClick={() => navigate('/ai-planner')}
            className="glass-card px-6 py-3 text-gray-700 hover:bg-white/20 transition-colors"
          >
            从空白行程开始
          </button>
        </div>
      </div>
    </div>
  );
}
