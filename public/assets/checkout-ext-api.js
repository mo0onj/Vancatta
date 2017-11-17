var Zooz = Zooz || {};

Zooz.zoozServerProduction = "https://app.zooz.com";  
Zooz.zoozServerSandbox = "https://sandbox.zooz.com";

Zooz.environemtProduction = Zooz.zoozServerProduction;
Zooz.environemtSandbox = Zooz.zoozServerSandbox;

console.log('zooooooooooozzzzzzzzzzzz');

var Zooz = Zooz || {};
Zooz.Checkout = Zooz.Checkout || {};





Zooz.Checkout.randomUUID = function () {
    var s = [];

    // Make array of random hex digits. The UUID only has 32 digits in it, but we
    // allocate an extra items to make room for the '-'s we'll be inserting.
    for (var i = 0; i < 36; i++) {
        var rand = Math.random();
        s[i] = Math.floor(rand * 0x10);
    }
    // Conform to RFC-4122, section 4.4
    s[14] = 4; // Set 4 high bits of time_high field to version
    s[19] = (s[19] & 0x3) | 0x8; // Specify 2 high bits of clock sequence
    // Convert to hex chars
    for (var i = 0; i < 36; i++) {
        switch (s[i]) {
            case 10:
                s[i] = 'A';
                break;
            case 11:
                s[i] = 'B';
                break;
            case 12:
                s[i] = 'C';
                break;
            case 13:
                s[i] = 'D';
                break;
            case 14:
                s[i] = 'E';
                break;
            case 15:
                s[i] = 'F';
                break;
            default:
                break;
        }
    }

    // Insert '-'s
    s[8] = s[13] = s[18] = s[23] = '-';

    return 'zooz_' + s.join('');
};

var Zooz = Zooz || {};

Zooz.Ext = Zooz.Ext || {};

Zooz.Ext.Log = function() {
    this.isOn = false;

};

Zooz.Ext.Log.prototype = function() {
    var log = function(msg) {
        if (this.isOn) {
            console.log(msg);
        }
    };
    return{log:log}
}();

Zooz.Ext.External = function(zoozParams) {
    var apiNames = {
        doPay:'doPay',
        addPaymentMethod:'addPaymentMethod',
        addPaymentMethodWithDeviceFingerprint:'addPaymentMethodWithDeviceFingerprint',
        removePaymentMethod:'removePaymentMethod',
        updateParams:'updateParams'
    };

    var zoozLog = new Zooz.Ext.Log();

    var that = this;
    that.zoozOverlay;
    that.zoozIframe;
    that.zoozServer;
    that.isZoozIframeAvailable = false;
    that.windowId;
    that.isDoingPayment;
    that.apiCalls = {};

    var callFailure = function(actionId, actionName, errorResponse) {
        zoozLog.log(errorResponse);
        delete that.lastDoPayDate;
        that.isDoingPayment = false;
        var apiCall = that.apiCalls[actionName];
        if (apiCall.actionId === actionId && apiCall.failureCallbackFunction) {
            var failureCallbackFunction = apiCall.failureCallbackFunction;
            delete that.apiCalls[actionName]
            failureCallbackFunction(errorResponse);
        }

    };

    var callSuccess = function(actionId, actionName, successResponse) {
        delete that.lastDoPayDate;
        that.isDoingPayment = false;
        var apiCall = that.apiCalls[actionName];
        if (apiCall.actionId === actionId && apiCall.successCallbackFunction) {
            var successCallbackFunction = apiCall.successCallbackFunction;
            delete that.apiCalls[actionName];
            successCallbackFunction(successResponse);
        }

    };


    var listener = function(event) {
        var zoozAlive = 'zooz-alive';
        var successCmd = 'zooz-success';
        var failureCmd = 'zooz-failure';
        var delimeter = ',';


        var extractJsonFromMessage = function(data, cmdPrefix) {
            var jsonData = '';
            var winId = that.windowId;
            var dataStr = event.data.substring(cmdPrefix.length + winId.length + delimeter.length);
            try {
                jsonData = JSON.parse(dataStr);
            } catch(ex) {

            }
            return jsonData;
        };


        if (event.origin !== that.zoozServer) {
            return;
        }
        try {
            var message = JSON.parse(event.data);
        }
        catch(ex) {
            return;
        }

        var validatePrefix = function() {
            var winId = that.windowId;
            return ( message.windowId === winId);

        };

        var validateCmd = function(cmd) {
            return (message.cmd && message.cmd === cmd);
        };
        if (validatePrefix()) {

            if (validateCmd(zoozAlive)) {
                zoozLog.log(event.data);
                that.isZoozIframeAvailable = true;
            } else if (validateCmd(successCmd)) {
                zoozLog.log(event.data);
                if ( apiNames[message.actionName]) {
                    var successResponse = message.data;
                    var actionId = message.actionId;
                    callSuccess(actionId, message.actionName, successResponse);
                }


            } else if (validateCmd(failureCmd)) {
                zoozLog.log(event.data);
                if ( apiNames[message.actionName]) {
                    var errorResponse = message.data;
                    var actionId = message.actionId;
                    var actionName = message.actionName;
                    callFailure(actionId, actionName, errorResponse);
                }

            }
        }


    };


    if (window.addEventListener) {
        addEventListener("message", listener, false);
    } else {
        attachEvent("onmessage", listener);
    }

    that.init(zoozParams);

};


Zooz.Ext.External.prototype = function() {
    var apiNames = {
        doPay:'doPay',
        addPaymentMethod:'addPaymentMethod',
        addPaymentMethodWithDeviceFingerprint:'addPaymentMethodWithDeviceFingerprint',
        removePaymentMethod:'removePaymentMethod',
        updateParams:'updateParams'
    };

    var that = this;
    var zoozTimeoutPeriod = 30000;//ms when a call went out to server (30 sec)
    var maximumNumberOfAttemptsToPayBeforeFail = 60; //interval of 500 ms = 30 sec
    var maximumNumberOfAttemptsToPingIframe = 30; //interval of 1000 ms = 30 sec

    var zoozLog = new Zooz.Ext.Log();

    var removeZoozElements = function() {

        if (this.isDoingPayment) {
            zoozLog.log('zooz is processing another request token:' + data.paymentToken + ' failed');
            return synchronousFailure;
        } else {
            var that = this;

            document.body.removeChild(that.zoozOverlay);
            delete that.zoozOverlay;
            delete that.zoozIframe;
            delete that.zoozServer;
            delete that.isZoozIframeAvailable;
            delete that.windowId;
            delete that.isDoingPayment;
            that.apiCalls = {};
        }
    }

    var createZoozElements = function(zoozParams, checkoutAttributes) {
        var that = this;
        that.zoozOverlay = document.createElement('div');
        that.zoozOverlay.style.display = 'none';
        var body = $document.find('body').eq(0);
        body.appendChild(that.zoozOverlay);

        var iframeName = 'zooz-ext-iframe-' + that.windowId;
        that.zoozIframe =(/MSIE (6|7|8)/).test(navigator.userAgent) ?
                            document.createElement('<iframe name="'+iframeName+'">') :
                            document.createElement('iframe');

        that.zoozIframe.name = iframeName;
        that.zoozIframe.style.display = 'none';
        that.zoozOverlay.appendChild(that.zoozIframe);


        if (zoozParams.isSandbox) {
            that.zoozServer = Zooz.environemtSandbox;
        } else {
            that.zoozServer = Zooz.environemtProduction;
        }


        var iframeSrc = this.zoozServer + '/mobile/checkoutapi/checkout.jsp';

        var submitToZooz = function(src, targetId, attributes) {
            var zoozForm = document.createElement("form");
            zoozForm.setAttribute("method", "post");
            zoozForm.setAttribute("action", src);

            zoozForm.setAttribute("target", targetId);

            that.zoozOverlay.appendChild(zoozForm);

            for (var prop in attributes) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", prop);
                hiddenField.setAttribute("value", attributes[prop]);
                zoozForm.appendChild(hiddenField);
            }


            zoozForm.submit();
            delete zoozForm;
        };


        submitToZooz(iframeSrc, that.zoozIframe.name, checkoutAttributes);
    };


    var init = function(zoozParams , successCallbackFunction, failureCallbackFunction) {
        var that = this;
        var firstInitObject = {firstInit:true};
        if (shouldRemoveZoozElements.call(this, zoozParams.isSandbox)){
            removeZoozElements.call(this);
            firstInitObject.firstInit=false;
            firstInitObject.actionName = apiNames.updateParams;
            firstInitObject.actionId = addAPICallEntry.call(that, firstInitObject.actionName, successCallbackFunction, failureCallbackFunction);
            firstInitObject.requestData = zoozParams;
        }

        if (!that.windowId){
            var checkoutAttributes = {};
            that.windowId = Zooz.Checkout.randomUUID();
            createZoozElements.call(this, zoozParams, checkoutAttributes);

            pingZoozOverlay.call(this,zoozParams,firstInitObject);
        }
        else{
            handleCommand.call(this, apiNames.updateParams, zoozParams, successCallbackFunction, failureCallbackFunction);
        }

    };

    var shouldRemoveZoozElements = function(isSandbox){

        if (this.zoozServer){
            if (isSandbox){
                return this.zoozServer != Zooz.environemtSandbox;
            } else{
                return this.zoozServer != Zooz.environemtProduction;
            }
        } else{
            return false;
        }
    }

    var addAPICallEntry = function(apiName, successCallbackFunction, failureCallbackFunction) {
        if (!this.apiCalls[apiName]) {
            var actionId = Zooz.Checkout.randomUUID();
            this.apiCalls[apiName] = {actionId:actionId,apiName:apiName,successCallbackFunction:successCallbackFunction,failureCallbackFunction:failureCallbackFunction};
            return actionId;
        }
    };

    var synchronousSuccess = {
        code:0,
        msg:'Payment initiated'

    };

    var synchronousFailure = {
        code:1,
        msg:'Already processing'

    };


    var addPaymentMethodProxy = function(data,successCallbackFunction, failureCallbackFunction){
        return handleCommand.call(this,apiNames.addPaymentMethod ,data,successCallbackFunction, failureCallbackFunction)
    };

    var addPaymentMethodWithDeviceFingerprintProxy = function(data,successCallbackFunction, failureCallbackFunction){
        return handleCommand.call(this,apiNames.addPaymentMethodWithDeviceFingerprint ,data,successCallbackFunction, failureCallbackFunction)
    };

    var doPayProxy = function(data,successCallbackFunction, failureCallbackFunction){
        return handleCommand.call(this,apiNames.doPay,data,successCallbackFunction, failureCallbackFunction)
    };

    var removePaymentMethodProxy = function(data,successCallbackFunction, failureCallbackFunction){
        return handleCommand.call(this,apiNames.removePaymentMethod,data,successCallbackFunction, failureCallbackFunction)
    };

    var handleCommand = function(apiName,data ,successCallbackFunction, failureCallbackFunction) {
        zoozLog.log('handle command was called');

        var that = this;

        if (this.isDoingPayment) {
            zoozLog.log('zooz is processing another request token:' + data.paymentToken + ' failed');
            return synchronousFailure;
        }
        else {
            var actionName = apiName;
            var actionId = addAPICallEntry.call(that, actionName, successCallbackFunction, failureCallbackFunction);
            if (actionId) {
                if (!this.isZoozIframeAvailable) {
                    zoozLog.log('zooz isn\'t ready for token ' + data.paymentToken);
                    this.isDoingPayment = true;

                    waitForZoozIframeWithCommand.call(that, data, maximumNumberOfAttemptsToPayBeforeFail, actionId, actionName);
                    return synchronousSuccess;

                } else {
                    execute.call(that, data, actionId, actionName);
                    return synchronousSuccess;
                }
            } else {
                return synchronousFailure;
            }
        }
    };

    var callFailure = function(actionId, actionName, errorResponse) {
        var that = this;
        zoozLog.log(errorResponse);
        delete that.lastDoPayDate;
        that.isDoingPayment = false;
        var apiCall = that.apiCalls[actionName];
        if (apiCall.actionId === actionId && apiCall.failureCallbackFunction) {
            var failureCallbackFunction = apiCall.failureCallbackFunction;
            delete that.apiCalls[actionName]
            failureCallbackFunction(errorResponse);
        }

    };

    var execute = function(data, actionId, actionName) {
        var that = this;
        zoozLog.log('start payment for token ' + data.paymentToken);
        this.isDoingPayment = true;
        var date = new Date();
        that.lastDoPayDate = date;
        try {
            var msessage = {
                cmd:actionName,
                actionId:actionId,
                actionName:actionName,
                requestData:data
            };
            that.zoozIframe.contentWindow.postMessage(JSON.stringify(msessage), this.zoozServer);
            setTimeout(function() {
                if (that && that.lastDoPayDate === date) {
                    callFailure.call(that, actionId, actionName, generalError);

                }
            }, zoozTimeoutPeriod);
        } catch(ex) {
            zoozLog.log('error' + ex);
            setTimeout(function() {
                callFailure.call(that, actionId, actionName, generalError);
            }, 4);

        }
        delete data;
    };


    var waitForZoozIframeWithCommand = function(data, doPayAttempts, actionId, actionName) {
        var that = this;
        doPayAttempts -= 1;
        if (!this.isZoozIframeAvailable) {
            if (doPayAttempts === 0) {
                zoozLog.log('failed since iframe doesn\'t load');
                callFailure.call(that, actionId,actionName, generalError);
            } else {
                setTimeout(function() {
                    waitForZoozIframeWithCommand.call(that, data, doPayAttempts, actionId, actionName);
                }, 500);
                return -1;
            }
        } else {
            execute.call(that, data, actionId, actionName);
            return 0;
        }
    };

    var pingZoozOverlay = function(zoozParams,firstInitObject) {
        pingZooz.call(this, maximumNumberOfAttemptsToPingIframe,zoozParams,firstInitObject);
    };

    var pingZooz = function(attemptsLeft,zoozParams,firstInitObject) {

        var that = this;
        attemptsLeft -= 1;

        if (attemptsLeft == 0) {
            zoozLog.log('cancel pinging');
            return;
        } else {
            if (!that.isZoozIframeAvailable) {
                setTimeout(function() {
                    var message = {
                        cmd:'check-zooz',
                        windowId:that.windowId,
                        programId:zoozParams.programId ? zoozParams.programId : zoozParams.uniqueId,
                        uniqueId:zoozParams.programId ? zoozParams.programId : zoozParams.uniqueId,
                        isReturnResponse:!firstInitObject.firstInit
                    };
                    if(!firstInitObject.firstInit){
                        message.actionId=firstInitObject.actionId;
                        message.actionName=firstInitObject.actionName;
                        message.requestData= firstInitObject.requestData;
                    }
                    try {

                        that.zoozIframe.contentWindow.postMessage(JSON.stringify(message), that.zoozServer);
                    }
                    catch(ex) {
                        zoozLog.log('error' + ex);
                    }
                    pingZooz.call(that, attemptsLeft,zoozParams,firstInitObject);
                }, 1000);
            }
        }
    };

    var generalError = {
        errorMessage:'We’re sorry, but something went wrong. Please contact the app developer for more details.' ,
        responseErrorCode:0x050104,
        errorDescription:'We’re sorry, but something went wrong. Please contact the app developer for more details.'

    };


    return {
        init:init,
        doPay:doPayProxy ,
        addPaymentMethod:addPaymentMethodProxy,
        addPaymentMethodWithDeviceFingerprint:addPaymentMethodWithDeviceFingerprintProxy,
        removePaymentMethod:removePaymentMethodProxy,
        generalError:generalError
    }


}();













