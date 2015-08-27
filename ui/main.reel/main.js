/**
    @module "ui/main.reel"
    @requires montage
    @requires montage/ui/component
*/
var Component = require("montage/ui/component").Component,
PressComposer = require("montage/composer/press-composer").PressComposer,
QuestionController = require("core/question-controller").QuestionController,
NavigationController = require("core/navigation-controller").NavigationController;

/**
    Description TODO
    @class module:"ui/main.reel".Main
    @extends module:ui/component.Component
*/
exports.Main = Component.specialize( /** @lends module:"ui/main.reel".Main# */ {

    enterDocument: {
        value: function Main(firstTime) {
            if(firstTime) {
                this.application.navigationController = NavigationController;
                this.application.QuestionController = QuestionController;
            }
        }
    }

    // templateDidLoad: {
    //     value: function () {
    //         var self = this;

    //         this.setPaths();

    //         this.flowRibbon.content = teamData;

    //         // handle resize function this.setPaths

    //         window.addEventListener("resize", this, false);
    //     }
    // }

});
