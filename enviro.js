(function() {

    "use strict";

    var Enviro = function(protoEnvironmentStructure) {
        return this.__createEnvironment(protoEnvironmentStructure);
    };

    Enviro.ProtoEnvironment = function(options) {
        this.__construct = function(options) {
            this.__environmentName = options.name;

            if (!this.hasName()) {
                throw new Error("Environment has no name");
            }

            this.__environmentUserAgent = options.ua;

            this.setEnvironmentTriggers(options.trigger);

            if (!this.hasEnvironmentTriggers() && !this.hasUserAgent()) {
                throw new Error("Unable to add environment: no UserAgent regex or environment triggers...");
            }

            this.__environmentOnAction = {};

            for (a in options.events) {
                this.setEnvironmentOnAction(a, options.events[a]);
            }
        };

        this.getEnvironmentOnAction = function(actionName) {

            return this.__environmentOnAction[actionName];
        };

        this.setEnvironmentOnAction = function(actionName, action) {

            if (typeof action === "function") {
                this.__environmentOnAction[actionName] = action;
            } else if (action === undefined) {
                return;
            } else {
                throw new Error("OnInit should be a single function");
            }
        };

        this.getName = function() {
            return this.__environmentName;
        };

        this.hasName = function() {
            var name = this.getName();
            if (typeof name === "string" && name !== "") {
                return true;
            }
            return false;
        };

        this.getUserAgent = function() {
            return this.__environmentUserAgent;
        };

        this.hasUserAgent = function() {
            var userAgent = this.getUserAgent();
            if (!userAgent) {
                return false;
            }

            if (userAgent instanceof RegExp) {
                return true;
            } else {
                throw new Error("User agent should be a regex");
            }

        };

        this.getEnvironmentTriggers = function() {
            return this.__environmentTriggers;
        };

        this.hasEnvironmentTriggers = function() {
            if (this.getEnvironmentTriggers().length === 0) {
                return false;
            }
            return true;
        };
        this.setEnvironmentTriggers = function(triggers) {
            this.__environmentTriggers = [];
            if (!triggers) {
                return;
            } else if (triggers.constructor === Array) {
                for (t in triggers) {
                    this.addEnvironmentTrigger(triggers[t]);
                }
            } else if (typeof triggers === "function") {
                this.addEnvironmentTrigger(triggers);
            } else {
                throw new Error("Triggers should be either a single function or an array of functions");
            }
        };

        this.addEnvironmentTrigger = function(triggerFunction) {
            if (typeof triggerFunction === "function") {
                this.__environmentTriggers.push(triggerFunction);
            } else {
                throw new Error("Trigger should be a function");
            }
        };

        this.__construct(options);
    }
    Enviro.__addEnvironment = function(protoEnvironment) {
        if (arguments.length !== 1 || !(protoEnvironment instanceof Environment.ProtoEnvironment)) {
            throw new Error("Unable to add environment: this function should only be called with a single ProtoEnvironment as a parameter");
        }

        this[protoEnvironment.getName()] = protoEnvironment;

        return this[protoEnvironment.getName()];
    }
    Enviro.__createEnvironment = function(protoEnvironmentOptions) {
        this.__addEnvironment(new Environment.ProtoEnvironment(protoEnvironmentOptions));
    }
    Enviro.forEach = function(callback) {
        for (p in this) {
            if (this[p] instanceof Environment.ProtoEnvironment) {
                callback(p, this[p]);
            }
        }
    }
    Enviro.trigger = function(action, name) {

        var env = this[name];
        var triggers = env.getEnvironmentTriggers();
        for (t in triggers) {
            if (triggers[t]() !== true) {
                return;
            }
        }
        try {
            env.getEnvironmentOnAction(action)();
        } catch (e) {}

    };
    Enviro.triggerAll = function(action) {
        var self = this;
        this.forEach(function(name, env) {
            self.trigger(action, name);

        });
    };

    Enviro.tools = {
        ieVersion: function() {
            if (navigator.appName == 'Microsoft Internet Explorer') {
                var ua = navigator.userAgent;
                var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null)
                    rv = parseFloat(RegExp.$1);
            }
            return rv;
        }
    };

}());
