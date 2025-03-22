import React, { useState } from 'react';
import { Brain, Book, CheckCircle, AlertCircle, Loader2, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { getQuizQuestions } from '../lib/gemini';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizGeneratorProps {
  onClose: () => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onClose }) => {
  const [courseName, setCourseName] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('intermediate');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuiz = async () => {
    if (!courseName) {
      setError('Please enter a course name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const quizQuestions = await getQuizQuestions(courseName, difficulty, numQuestions);
      setQuestions(quizQuestions);
      setSelectedAnswers(new Array(quizQuestions.length).fill(''));
      setCurrentQuestion(0);
      setShowResults(false);
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === '') {
        // No points for unanswered questions
        return;
      }
      if (selectedAnswers[index] === question.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const getQuestionStatus = () => {
    return questions.map((_, index) => ({
      isAnswered: selectedAnswers[index] !== '',
      isCurrent: index === currentQuestion
    }));
  };

  const handleClose = () => {
    // Reset all states before closing
    setQuestions([]);
    setSelectedAnswers([]);
    setCurrentQuestion(0);
    setShowResults(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={handleClose}>
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 max-w-3xl w-full border border-white/20 max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">AI Quiz Generator</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-indigo-200 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {!questions.length ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Course Topic</label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g., Machine Learning Fundamentals"
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Number of Questions</label>
                    <select
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {[5, 10, 15, 20].map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Difficulty Level</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/20 text-red-400 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={generateQuiz}
                disabled={loading}
                className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating Quiz...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>Generate Quiz</span>
                  </>
                )}
              </button>
            </div>
          ) : showResults ? (
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Quiz Complete!
                  </h3>
                  <p className="text-xl text-indigo-200 mb-4">
                    Your Score: {calculateScore()} out of {questions.length}
                  </p>
                  <p className="text-indigo-300 text-sm">
                    {questions.length - selectedAnswers.filter(a => a !== '').length} questions unanswered
                  </p>
                </div>

                <div className="space-y-4 mt-8">
                  {questions.map((question, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-indigo-300">Question {index + 1}:</span>
                        {selectedAnswers[index] === '' ? (
                          <span className="text-yellow-400">(Unanswered)</span>
                        ) : selectedAnswers[index] === question.correctAnswer ? (
                          <span className="text-green-400">(Correct)</span>
                        ) : (
                          <span className="text-red-400">(Incorrect)</span>
                        )}
                      </div>
                      <p className="text-white font-medium mb-2">{question.question}</p>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg flex items-center gap-2 ${
                              option === question.correctAnswer
                                ? 'bg-green-500/20 text-green-400'
                                : option === selectedAnswers[index]
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-white/5 text-indigo-200'
                            }`}
                          >
                            {option === question.correctAnswer ? (
                              <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            ) : option === selectedAnswers[index] ? (
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            ) : null}
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-indigo-200 text-sm">
                        {question.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Question {currentQuestion + 1} of {questions.length}
                </h3>
                <div className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-indigo-300" />
                  <span className="text-indigo-200">{courseName}</span>
                </div>
              </div>

              {/* Question Progress Indicators */}
              <div className="flex gap-2 mb-4">
                {getQuestionStatus().map((status, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      status.isCurrent
                        ? 'bg-purple-500'
                        : status.isAnswered
                        ? 'bg-indigo-500/50'
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>

              <div className="p-6 bg-white/5 rounded-xl">
                <p className="text-white text-lg mb-6">
                  {questions[currentQuestion].question}
                </p>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full p-4 rounded-xl transition-colors flex items-center gap-3 ${
                        selectedAnswers[currentQuestion] === option
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 text-indigo-200 hover:bg-white/10'
                      }`}
                    >
                      <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {questions.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
            {!showResults ? (
              <>
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                <div className="text-indigo-200">
                  {selectedAnswers[currentQuestion] ? 'Answered' : 'Not answered'}
                </div>
                <button
                  onClick={nextQuestion}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
                >
                  {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                  {currentQuestion < questions.length - 1 && <ArrowRight className="w-4 h-4" />}
                </button>
              </>
            ) : (
              <div className="flex justify-between w-full">
                <button
                  onClick={() => {
                    setQuestions([]);
                    setSelectedAnswers([]);
                    setShowResults(false);
                  }}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors"
                >
                  Create New Quiz
                </button>
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;