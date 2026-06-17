import { useState } from 'react';

export default function MultiSelectQuiz({ quiz, onComplete }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);

  const q = quiz.questions[index];
  const isMulti = q.options.filter((o) => o.correct).length > 1;

  const toggle = (id) => {
    if (feedback) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (isMulti) {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      } else {
        next.clear();
        next.add(id);
      }
      return next;
    });
  };

  const handleCheck = () => {
    const correctIds = new Set(q.options.filter((o) => o.correct).map((o) => o.id));
    const match =
      selected.size === correctIds.size &&
      [...selected].every((id) => correctIds.has(id));

    if (match) {
      setFeedback({ ok: true, text: q.explanation });
    } else {
      setFeedback({ ok: false, text: q.explanation });
    }
  };

  const handleNext = () => {
    if (index + 1 >= quiz.questions.length) {
      setDone(true);
      onComplete(quiz.successMessage);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(new Set());
    setFeedback(null);
  };

  if (done) {
    return (
      <p className="text-center text-sm leading-relaxed text-white/70">
        {quiz.successMessage}
      </p>
    );
  }

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
        {index + 1} из {quiz.questions.length}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-white/80">{q.prompt}</p>

      <ul className="mt-4 space-y-2">
        {q.options.map((opt) => (
          <li key={opt.id}>
            <button
              type="button"
              onClick={() => toggle(opt.id)}
              disabled={Boolean(feedback)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                selected.has(opt.id)
                  ? 'border-accent bg-accent/10 text-white'
                  : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
              } disabled:opacity-70`}
            >
              {isMulti && (
                <span
                  className={`mr-2 inline-block h-3 w-3 rounded border ${
                    selected.has(opt.id) ? 'border-accent bg-accent' : 'border-white/30'
                  }`}
                />
              )}
              {opt.label}
            </button>
          </li>
        ))}
      </ul>

      {!feedback && (
        <button
          type="button"
          disabled={selected.size === 0}
          onClick={handleCheck}
          className="mt-6 w-full rounded-full bg-white px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-black transition hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Проверить
        </button>
      )}

      {feedback && (
        <div className="mt-4 space-y-4">
          <p
            className={`text-sm leading-relaxed ${feedback.ok ? 'text-green-400/90' : 'text-white/60'}`}
          >
            {feedback.text}
          </p>
          <button
            type="button"
            onClick={handleNext}
            className="w-full rounded-full bg-white px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-black transition hover:bg-accent hover:text-white"
          >
            {index + 1 >= quiz.questions.length ? 'Завершить' : 'Далее'}
          </button>
        </div>
      )}
    </div>
  );
}
