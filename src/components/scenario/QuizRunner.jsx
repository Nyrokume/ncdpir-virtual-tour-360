import MatchCraftQuiz from './MatchCraftQuiz';
import TrueFalseQuiz from './TrueFalseQuiz';
import MultiSelectQuiz from './MultiSelectQuiz';
import SingleChoiceQuiz from './SingleChoiceQuiz';
import QuizModal from './QuizModal';

export default function QuizRunner({ quiz, onClose, onComplete }) {
  if (!quiz) return null;

  const handleComplete = (message) => {
    onComplete(message);
  };

  const body = (() => {
    switch (quiz.type) {
      case 'match':
        return <MatchCraftQuiz quiz={quiz} onComplete={handleComplete} />;
      case 'true-false':
        return <TrueFalseQuiz quiz={quiz} onComplete={handleComplete} />;
      case 'multi-select':
        return <MultiSelectQuiz quiz={quiz} onComplete={handleComplete} />;
      case 'single-choice':
        return <SingleChoiceQuiz quiz={quiz} onComplete={handleComplete} />;
      default:
        return null;
    }
  })();

  return (
    <QuizModal title={quiz.title} onClose={onClose}>
      {body}
    </QuizModal>
  );
}
