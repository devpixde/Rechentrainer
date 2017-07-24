/**
 * Created by master on 23.07.17.
 */


class RechenTrainer {

    private _challengeContainer: HTMLDivElement;
    private _currentChallenge: Challenge;
    private _currentTry = 1;
    private _passed: boolean = false;


    constructor(container: HTMLDivElement) {
        this._challengeContainer = container;
        this.nextChallenge();
    }

    nextChallenge(): void {
        var self = this;
        this._currentTry = 1;
        this._passed = false;
        this._currentChallenge = new Challenge(100);
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

    }

    check(): boolean {
        var correct: boolean = this.evaluate();
        if (correct) {
            document.getElementById('questionPart').setAttribute('class', 'correct');
        } else {
            document.getElementById('questionPart').setAttribute('class', 'wrong');
        }
        return correct;
    }

    getPoints(): Number {
        if(this._passed){
            return 5;
        } else{
            return this._currentTry * (-1);
        }

    }

    reset(): void {
        document.getElementById('questionPart').removeAttribute('class');
        document.getElementById('questionPart').innerText = '?';
        document.getElementById('questionPart').focus();
    }

    private evaluate(): boolean {
        this._passed = parseInt(document.getElementById('questionPart').innerText) === this._currentChallenge.questionValue;
        this._currentTry += 1;
        return this._passed;
    }

    private getWrapped(param: string) {
        if (this._currentChallenge.hiddenPart === param) {
            return '<span id="questionPart" contenteditable="true" > ? </span>';
        } else {
            return '<span class="questionParams">' + this._currentChallenge[param] + '</span>';
        }
    }
}

class Challenge {

    private _maxNum: number = 100;
    private _arg1: number = 0;
    private _arg2: number = 0;
    private _result: number = 0;
    private _operator: string = '+';
    private _hiddenPart: string = 'arg1';
    private _parts: Array<string> = ['arg1', 'arg2', 'result'];

    constructor(maxNum: number) {
        this.create();
        this._hiddenPart = this._parts[Math.floor(Math.random() * 3)];
    }

    get arg1(): number {
        return this._arg1;
    }

    get arg2(): number {
        return this._arg2;
    }

    get result(): number {
        return this._result;
    }

    get operator(): string {
        return this._operator;
    }

    get hiddenPart(): string {
        return this._hiddenPart;
    }

    get questionValue(): number {
        return this[this.hiddenPart];
    }

    private create() {
        this._operator = (['+', '-', '*', '/'])[this.getRandInt(3)];

        switch (this._operator) {
            case '+' :
                this.createSum();
                break;
            case '-' :
                this.createSub();
                break;
            case '*' :
                this.createMulti();
                break;
            case '/' :
                this.createDiv();
                break;
        }

    }


    private createSum() {
        this._arg1 = this.getRandInt(this._maxNum);
        this._arg2 = this.getRandInt(this._maxNum);
        this._result = this._arg1 + this._arg2;
        if (this._result > this._maxNum) {
            this.createSum();
        }
    }

    private createMulti() {
        this._arg1 = this.getRandInt(this._maxNum);
        this._arg2 = this.getRandInt(this._maxNum);

        if( this._arg2 === 0 && this._hiddenPart === 'arg2'){
            this._arg2 = 1;
        }
        if( this._arg1 === 0 && this._hiddenPart === 'arg1'){
            this._arg1 = 1;
        }

        this._result = this._arg1 * this._arg2;
        if (this._result > this._maxNum) {
            this.createMulti();
        }
    }

    private createDiv() {
        this._result = this.getRandInt(this._maxNum);
        this._arg2 = this.getRandInt(this._maxNum);
        if (this._arg2 === 0) {
            this._arg2 = 1;
        }
        this._arg1 = this._result * this._arg2;
        if (this._arg1 > this._maxNum) {
            this.createDiv();
        }
    }

    private createSub() {
        this._arg1 = this.getRandInt(this._maxNum);
        this._arg2 = this.getRandInt(this._maxNum);
        this._result = this._arg1 - this._arg2;
        if (this._result < 0) {
            this.createSub();
        }
    }

    // von 0 bis max
    private getRandInt(max: number): number {
        return Math.floor((max + 1) * Math.random());
    }


}
