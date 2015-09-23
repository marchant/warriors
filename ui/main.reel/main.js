/**
    @module "ui/main.reel"
    @requires montage
    @requires montage/ui/component
*/
var Component = require("montage/ui/component").Component,
    PressComposer = require("montage/composer/press-composer").PressComposer,
    QuizController = require("core/quiz-controller").QuizController,
    AnswerProvider = require("core/answer-provider").AnswerProvider,
    StatsController = require("core/stats-controller").StatsController,
    TimerProvider = require("core/timer-provider").TimerProvider,
    QuizProvider = require("core/quiz-provider").QuizProvider,
    BackendService = require("core/backend-service").BackendService,
    Application = require("montage/core/application").application,
    configuration = require('core/configuration').configuration;

/**
    Description TODO
    @class module:"ui/main.reel".Main
    @extends module:ui/component.Component
*/
exports.Main = Component.specialize( /** @lends module:"ui/main.reel".Main# */ {

    constructor: {
        value: function () {
            var backendService = new BackendService();
            var answerProvider = new AnswerProvider();
            var timerProvider   = new TimerProvider();
            var quizProvider   = new QuizProvider();

            backendService.init(configuration.backendUrl);
            answerProvider.init(backendService);
            quizProvider.init(configuration.quizId, backendService);


            Application.statsController = new StatsController();
            Application.statsController.init(quizProvider, configuration.quizId, answerProvider, timerProvider, backendService);

            Application.quizController = new QuizController();
            Application.quizController.init(quizProvider, answerProvider, timerProvider);
        }
    },

    currentView: {
        value: 'intro'
    },

    isQuizFinished: {
        set: function (value) {
            if(value) {
                this.currentView = 'results';
            }
        }
    },

    handleReviewButtonAction: {
        value: function () {
            this.menu.toggleMenu();
        }
    },

    handleStartQuizAction: {
        value: function () {
            var self = this;
            Application.quizController.start(configuration.quizTime)
                .then(function() {
                    self.currentView = "quiz";
                });
        }
    },

    handleRestartQuizAction: {
        value: function () {
            var self = this;
            Application.quizController.reset();

            // $question - feels hacky
            setTimeout(function() {
                Application.quizController.start()
                    .then(function() {
                        self.currentView = "quiz";
                    });
            }, 500);
        }
    }

});
