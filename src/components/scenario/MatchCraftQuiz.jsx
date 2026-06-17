import { useState } from 'react';
import { assetUrl } from '../../lib/assets';

export default function MatchCraftQuiz({ quiz, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);

  const allAnswered = quiz.questions.every((q) => answers[q.id]);

  const handleSelect = (questionId, craftId) => {
    if (done) return;
    setAnswers((prev) => ({ ...prev, [questionId]: craftId }));
    setFeedback(null);
  };

  const handleCheck = () => {
    const wrong = quiz.questions.find((q) => answers[q.id] !== q.correctCraftId);
    if (wrong) {
      setFeedback('Проверьте ответы — не все сопоставления верны.');
      return;
    }
    setDone(true);
    onComplete(quiz.successMessage);
  };

  if (done) {
    return (
      <p className="text-center text-sm leading-relaxed text-white/70">
        {quiz.successMessage}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {quiz.questions.map((q, i) => (
        <div
          key={q.id}
          className="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
            {i + 1} из {quiz.questions.length}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/80">{q.description}</p>
          <select
            value={answers[q.id] || ''}
            onChange={(e) => handleSelect(q.id, e.target.value)}
            className="mt-3 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-accent"
          >
            <option value="">Выберите ремесло…</option>
            {quiz.crafts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {answers[q.id] && (
            <div className="mt-3 flex items-center gap-3">
              <img
                src={assetUrl(
                  quiz.crafts.find((c) => c.id === answers[q.id])?.image || ''
                )}
                alt=""
                className="h-14 w-14 rounded-lg object-cover"
              />
              <span className="text-xs text-white/50">
                {quiz.crafts.find((c) => c.id === answers[q.id])?.name}
              </span>
            </div>
          )}
        </div>
      ))}

      {feedback && (
        <p className="text-center text-sm text-accent">{feedback}</p>
      )}

      <button
        type="button"
        disabled={!allAnswered}
        onClick={handleCheck}
        className="w-full rounded-full bg-white px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-black transition hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Проверить
      </button>
    </div>
  );
}
