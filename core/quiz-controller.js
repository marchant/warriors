/**
 * @module quiz-controller
 */
var Target = require("montage/core/target").Target,
    Promise = require("montage/core/promise").Promise.Promise,
    Application = require("montage/core/application").application;
    Run = require('model/run').Run;
/**
 * @class QuizController
 * @extends Montage
 */
exports.QuizController = Target.specialize(/** @lends QuizController# */ {

    quizProvider: {
        value: null
    },

    answerProvider: {
        value: null
    },

    statsProvider: {
        value: null
    },

    timerProvider: {
        value: null
    },

    currentQuestionIndex: {
        value: null
    },

    currentQuestion: {
        value: null
    },

    isFinished: {
        value: null
    },

    totalQuestions: {
        value: null
    },

    showTimerEndedModal: {
        value: false
    },

    _runId: {
        value: null
    },

    submittedLastQuestion: {
        value: false
    },

    _startTime: {
        value: null
    },

    totalQuestions: {
        value: null
    },

    constructor: {
        value: function() {
            this.isFinished = false;
            this.currentQuestionIndex = -1;
            Application.addEventListener("timerHasEnded", this, false);
        }
    },

    init: {
        value: function(quizProvider, answerProvider, statsProvider, timerProvider) {
            this.quizProvider = quizProvider;
            this.quizProvider.loadData();
            this.answerProvider = answerProvider;
            this.statsProvider = statsProvider;
            this.timerProvider = timerProvider;
        }
    },

    handleTimerHasEnded: {
        value: function () {
            this.showTimerEndedModal = true;
            var self = this;

            setTimeout(function() {
                self.end();
            },500);

            setTimeout(function(){
                self.showTimerEndedModal = false;
            }, 2000);
        }
    },

    getNextQuestion: {
        value: function() {
            this.currentQuestion = this.quizProvider.getQuestion(this.currentQuestionIndex + 1);

            this.submittedLastQuestion = (!this.currentQuestion || typeof this.currentQuestion !== 'object');
            if (this.submittedLastQuestion) {
                this.end(true);
            } else {
                this.currentQuestionIndex++;
                this.timerProvider.resume();
            }
            return this.currentQuestion
        }
    },

    answer: {
        value: function(answer) {
            this.timerProvider.pause();
            var answerIndex = this.currentQuestion.options.indexOf(answer);
            var isCorrect = answerIndex === this.currentQuestion.answer;
            this.answerProvider.save(this._runId, this.currentQuestionIndex, answerIndex, isCorrect);
            return isCorrect;
        }
    },

    start: {
        value: function(time) {
            if(time) {
                this._startTime = time;
            }
            var self = this;

            return this.quizProvider.startRun()
                .then(function(runId) {
                    self._runId = runId;
                    self.getNextQuestion();
                    self.totalQuestions = self.quizProvider.getQuestionsCount();
                    self.timerProvider.start(self._startTime);
                }).catch(function(e) {
                    console.log(e);
                });
        }
    },

    end: {
        value: function(isFinished) {
            var self = this;
            this.timerProvider.pause();
            this.isFinished = true;
            var totalWrong = this.quizProvider.getQuestionsCount() - this.statsProvider.getTotalCorrect();
            var run = new Run(this._runId, this.statsProvider.getTotalCorrect(), totalWrong, this.timerProvider.currentTime, !!isFinished);
            return self.statsProvider.loadRunStatistics()
                .then(function() {
                    return self.quizProvider.endRun(run);
                });
        }
    },

    getStatistics: {
        value: function() {
            var percentageCorrect = this.statsProvider.getPercentageCorrect();
            var totalCorrect = this.statsProvider.getTotalCorrect();
            var percentageDifference = this.statsProvider.getPercentageDifference();
            var elapsedTime = this.statsProvider.getElapsedTime();
            var elapsedTimeDifference = this.statsProvider.getElapsedTimeDifference();
            var totalQuestions = this.totalQuestions;

            return {
                percentageCorrect: percentageCorrect,
                totalCorrect: totalCorrect,
                totalQuestions: totalQuestions,
                percentageDifference: percentageDifference,
                elapsedTime: elapsedTime,
                elapsedTimeDifference: elapsedTimeDifference
            };
        }
    },

    reset: {
        value: function() {
            this._runId = null;
            this.isFinished = false;
            this.submittedLastQuestion = null;
            this.currentQuestion = null;
            this.currentQuestionIndex = -1;
            this.answerProvider.reset();
        }
    }
});







