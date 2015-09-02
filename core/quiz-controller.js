/**
 * @module quiz-controller
 */
var Montage = require("montage/core/core").Montage,
    Promise = require("montage/core/promise").Promise.Promise;
/**
 * @class QuizController
 * @extends Montage
 */
exports.QuizController = Montage.specialize(/** @lends QuizController# */ {

    quizProvider: {
        value: null
    },

    answerProvider: {
        value: null
    },

    currentQuestionIndex: {
        value: null
    },

    currentQuestion: {
        value: null
    },

    submittedLastQuestion: {
        value: false
    },

    constructor: {
        value: function() {
            this.currentQuestionIndex = -1;
        }
    },

    init: {
        value: function(quizProvider, answerProvider) {
            this.quizProvider = quizProvider;
            this.answerProvider = answerProvider;
        }
    },

    getNextQuestion: {
        value: function() {
            this.currentQuestionIndex++;
            var self = this;
            self.currentQuestion = this.quizProvider.getQuestion(this.currentQuestionIndex);

            // check if we have submitted the last question
            if (self.currentQuestion && typeof self.currentQuestion == 'object') {
                return self.currentQuestion;
            } else {
                this.submittedLastQuestion = true;
            }
        }
    },

    answer: {
        value: function(answer) {
            var answerIndex = this.currentQuestion.options.indexOf(answer);
            var isCorrect = answerIndex === this.currentQuestion.answer;
            this.answerProvider.save(this.currentQuestionIndex, answer, isCorrect);
            return isCorrect;
        }
    }
});






