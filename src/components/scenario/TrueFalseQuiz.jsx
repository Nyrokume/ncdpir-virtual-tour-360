import { useState } from 'react';

export default function TrueFalseQuiz({ quiz, onComplete }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);

  const q = quiz.questions[index];

  const handleAnswer = (value) => {
    if (feedback !== null) return;
    const correct = value === q.correct;
    if (correct) {
      setFeedback({ ok: true, text: q.explanation });
    } else {
      setFeedback({
        ok: false,
        text: `Неверно. ${q.explanation}`,
      });
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
      <p className="mt-4 text-sm leading-relaxed text-white/80">{q.statement}</p>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => handleAnswer(true)}
          disabled={feedback !== null}
          className="flex-1 rounded-xl border border-white/15 py-3 font-mono text-xs uppercase tracking-wider transition hover:border-green-500/50 hover:bg-green-500/10 disabled:opacity-50"
        >
          Верно
        </button>
        <button
          type="button"
          onClick={() => handleAnswer(false)}
          disabled={feedback !== null}
          className="flex-1 rounded-xl border border-white/15 py-3 font-mono text-xs uppercase tracking-wider transition hover:border-red-500/50 hover:bg-red-500/10 disabled:opacity-50"
        >
          Неверно
        </button>
      </div>

      {feedback && (
        <div className="mt-4 space-y-4">
          <p
            className={`text-sm leading-relaxed ${feedback.ok ? 'text-green-400/90' : 'text-accent'}`}
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
