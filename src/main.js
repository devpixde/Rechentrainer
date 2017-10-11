/**
 * Created by master on 23.07.17.
 */
var RechenTrainer = (function () {
    function RechenTrainer(container) {
        this._currentTry = 1;
        this._passed = false;
        this._maxNum = 100;
        this._challengeContainer = container;
        this.nextChallenge();
    }
    RechenTrainer.prototype.nextChallenge = function () {
        this._currentTry = 1;
        this._passed = false;
        this._currentChallenge = new Challenge(this._maxNum);
        this._challengeContainer.innerHTML = this.getWrapped('arg1') + this._currentChallenge.operator + this.getWrapped('arg2') + ' = ' + this.getWrapped('result');
        document.getElementById('questionPart').focus();
        document.getElementById('questionPart').addEventListener('keydown', function (event) {
            // enter
            if (event.which === 13) {
                event.preventDefault();
            }
            if (document.getElementById('questionPart').innerText.match(/\?/)) {
                document.getElementById('questionPart').innerText = '';
            }
        });
        document.getElementById('questionPart').addEventListener('keyup', function () {
            if (!document.getElementById('questionPart').innerText.match(/^\d+$/)) {
                document.getElementById('questionPart').innerText = '?';
            }
        });
    };
    RechenTrainer.prototype.check = function () {
        var correct = this.evaluate();
        if (correct) {
            document.getElementById('questionPart').setAttribute('class', 'correct');
        }
        else {
            document.getElementById('questionPart').setAttribute('class', 'wrong');
        }
        return correct;
    };
    RechenTrainer.prototype.getPoints = function () {
        if (this._passed) {
            switch (this._maxNum) {
                case 100: return 5;
                case 200: return 7;
                case 500: return 10;
                case 1000: return 20;
            }
            return 5;
        }
        else {
            return this._currentTry * (-1);
        }
    };
    RechenTrainer.prototype.reset = function () {
        document.getElementById('questionPart').removeAttribute('class');
        document.getElementById('questionPart').setAttribute('contenteditable', 'true');
        document.getElementById('questionPart').innerText = '?';
        document.getElementById('questionPart').focus();
    };
    RechenTrainer.prototype.setMaxNum = function (maxNum) {
        this._maxNum = maxNum;
    };
    RechenTrainer.prototype.evaluate = function () {
        document.getElementById('questionPart').setAttribute('contenteditable', 'false');
        this._passed = parseInt(document.getElementById('questionPart').innerText) === this._currentChallenge.questionValue;
        this._currentTry += 1;
        return this._passed;
    };
    RechenTrainer.prototype.getWrapped = function (param) {
        if (this._currentChallenge.hiddenPart === param) {
            return '<span id="questionPart" contenteditable="true" > ? </span>';
        }
        else {
            return '<span class="questionParams">' + this._currentChallenge[param] + '</span>';
        }
    };
    return RechenTrainer;
}());
var Challenge = (function () {
    function Challenge(maxNum) {
        this._maxNum = 100;
        this._arg1 = 0;
        this._arg2 = 0;
        this._result = 0;
        this._operator = '+';
        this._hiddenPart = 'arg1';
        this._parts = ['arg1', 'arg2', 'result'];
        this._maxNum = maxNum;
        this.create();
        this._hiddenPart = this._parts[Math.floor(Math.random() * 3)];
    }
    Object.defineProperty(Challenge.prototype, "arg1", {
        get: function () {
            return this._arg1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Challenge.prototype, "arg2", {
        get: function () {
            return this._arg2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Challenge.prototype, "result", {
        get: function () {
            return this._result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Challenge.prototype, "operator", {
        get: function () {
            return this._operator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Challenge.prototype, "hiddenPart", {
        get: function () {
            return this._hiddenPart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Challenge.prototype, "questionValue", {
        get: function () {
            return this[this.hiddenPart];
        },
        enumerable: true,
        configurable: true
    });
    Challenge.prototype.create = function () {
        this._operator = (['+', '-', '*', '/'])[this.getRandInt(3)];
        switch (this._operator) {
            case '+':
                this.createSum();
                break;
            case '-':
                this.createSub();
                break;
            case '*':
                this.createMulti();
                break;
            case '/':
                this.createDiv();
                break;
        }
    };
    Challenge.prototype.createSum = function () {
        this._arg1 = this.getRandInt(this._maxNum);
        this._arg2 = this.getRandInt(this._maxNum);
        this._result = this._arg1 + this._arg2;
        if (this._result > this._maxNum) {
            this.createSum();
        }
    };
    Challenge.prototype.createMulti = function () {
        this._arg1 = this.getRandInt(this._maxNum);
        this._arg2 = this.getRandInt(this._maxNum);
        if (this._arg2 === 0 && (this._hiddenPart === 'arg2' || this._hiddenPart === 'arg1')) {
            this._arg2 = 1;
        }
        if (this._arg1 === 0 && (this._hiddenPart === 'arg1' || this._hiddenPart === 'arg2')) {
            this._arg1 = 1;
        }
        this._result = this._arg1 * this._arg2;
        if (this._result > this._maxNum) {
            this.createMulti();
        }
    };
    Challenge.prototype.createDiv = function () {
        this._result = this.getRandInt(this._maxNum);
        this._arg2 = this.getRandInt(this._maxNum);
        if (this._arg2 === 0) {
            this._arg2 = 1;
        }
        if (this._result === 0) {
            this._result = 1;
        }
        this._arg1 = this._result * this._arg2;
        if (this._arg1 > this._maxNum) {
            this.createDiv();
        }
    };
    Challenge.prototype.createSub = function () {
        this._arg1 = this.getRandInt(this._maxNum);
        this._arg2 = this.getRandInt(this._maxNum);
        this._result = this._arg1 - this._arg2;
        if (this._result < 0) {
            this.createSub();
        }
    };
    // von 0 bis max
    Challenge.prototype.getRandInt = function (max) {
        return Math.floor((max + 1) * Math.random());
    };
    return Challenge;
}());
