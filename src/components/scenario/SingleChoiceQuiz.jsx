import { useState } from 'react';
import { assetUrl } from '../../lib/assets';

export default function SingleChoiceQuiz({ quiz, onComplete }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);

  const q = quiz.questions[index];

  const handleSelect = (optionIndex) => {
    if (feedback) return;
    if (optionIndex === q.correctIndex) {
      setFeedback({ ok: true });
    } else {
      setFeedback({ ok: false, text: 'Попробуйте ещё раз.' });
    }
  };

  const handleNext = () => {
    if (index + 1 >= quiz.questions.length) {
      setDone(true);
      onComplete(quiz.successMessage);
      return;
    }
    setIndex((i) => i + 1);
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

      {q.image && (
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <img
            src={assetUrl(q.image)}
            alt=""
            className="mx-auto max-h-48 w-full object-contain bg-black/30"
          />
        </div>
      )}

      <ul className="mt-4 space-y-2">
        {q.options.map((opt, i) => (
          <li key={opt}>
            <button
              type="button"
              onClick={() => handleSelect(i)}
              disabled={feedback?.ok}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                feedback?.ok && i === q.correctIndex
                  ? 'border-green-500/50 bg-green-500/10'
                  : feedback && !feedback.ok
                    ? 'border-white/10 bg-white/5 hover:border-white/20'
                    : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
              }`}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>

      {feedback && (
        <div className="mt-4 space-y-4">
          {feedback.ok ? (
            <p className="text-sm text-green-400/90">Верно!</p>
          ) : (
            <p className="text-sm text-accent">{feedback.text}</p>
          )}
          {feedback.ok && (
            <button
              type="button"
              onClick={handleNext}
              className="w-full rounded-full bg-white px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-black transition hover:bg-accent hover:text-white"
            >
              {index + 1 >= quiz.questions.length ? 'Завершить' : 'Далее'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
