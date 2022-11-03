import React from "react";


/*The basic timer code! 
    This is effectively the core of the timer app, it counts down a var every second. I think I can turn this into a react component on its own
    which will take props from the core app to determine when to start, stop, how long to go down for and so on.
*/





// COMBINED TIMER APP
class TimerApp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            expectedStates: ['start', 'paused', 'running','session','break'],
            phaseState: 'Session',
            timerState: 'paused',
            sessionMinutes: 25,
            breakMinutes: 5,
            timer: 1500, //time in seconds
            intervalID: '', //need this for the countdown to be stopped
        }

        this.updateCountdown = this.updateCountdown.bind(this);
        this.decrementTimer = this.decrementTimer.bind(this);
        this.beginCountdown = this.beginCountdown.bind(this);
        this.staStop = this.staStop.bind(this);
        this.addMinute = this.addMinute.bind(this);
        this.subtractMinute = this.subtractMinute.bind(this);
        this.initializeClock = this.initializeClock.bind(this);
        this.pauseTime = this.pauseTime.bind(this);
        this.updateDisplay = this.updateDisplay.bind(this);
        this.phaseControl = this.phaseControl.bind(this);
        this.switchTimer = this.switchTimer.bind(this);
        this.playAlarm = this.playAlarm.bind(this);
    };
/* I need to create a set of 3 functions: 
    1. A function to decrement the time
    2. A function that activates depending on the state of the timer
    3. A function to change the timer's time in seconds */
    staStop(){ 
        if (this.state.timerState === 'paused') {
            this.beginCountdown()
            this.setState({
                timerState: 'running'
            })
        } else {
            this.pauseTime()
        }
    };

    pauseTime(){
        this.setState({timerState: 'paused'});
        clearInterval(this.state.intervalID);
    };

    beginCountdown() {
        this.setState({
            intervalID: setInterval(this.updateCountdown, 1000)
        })
    };

    updateCountdown() {
        this.decrementTimer();   
    };

    updateDisplay() {
        let minutes = Math.floor(this.state.timer / 60);
        let seconds = this.state.timer % 60;
    
        seconds = seconds < 10 ? '0' + seconds : seconds; // if seconds are less than 10, add a 0 to make it stick to being double digit
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        return minutes + ':' + seconds;
    };

    decrementTimer(){
        this.setState({
            timer: this.state.timer - 1
        });
        if (this.state.timer <= 0) {
            this.setState({timer: 0});
            this.phaseControl();
            this.playAlarm();
        }
    };

    phaseControl(){
        this.pauseTime();
        if (this.state.phaseState === 'Session'){
            this.beginCountdown()
            this.setState({
                timerState: 'running'
            })
            this.switchTimer(this.state.breakMinutes * 60, 'Break');
        } else {
            this.beginCountdown()
            this.setState({
                timerState: 'running'
            })
            this.switchTimer(this.state.sessionMinutes * 60, 'Session');
        };
    };

    playAlarm(){
        this.audioBeep.play();
    }

    switchTimer(num,str){
        this.setState({
            phaseState: str,
            timer: num
        });
    };

    addMinute(minuteType){
        if(minuteType === 'session'){
            this.setState(state => ({
                sessionMinutes: state.sessionMinutes += 1
            }));

            if (this.state.phaseState === 'Session') {
                this.setState(state => ({
                    timer: state.sessionMinutes * 60
                }));
            };

            if (this.state.sessionMinutes >= 60) {
                this.setState({sessionMinutes: 60});
                if (this.state.phaseState === 'Session') {
                    this.setState(state => ({
                        timer: state.sessionMinutes * 60
                    }));
                };
            };
        } else { //BREAK
            this.setState(state => ({
                breakMinutes: state.breakMinutes += 1
            }));

            if (this.state.phaseState === 'Break') {
                this.setState(state => ({
                    timer: state.breakMinutes * 60
                }));
            };

            if (this.state.breakMinutes >= 60) {
                this.setState({breakMinutes: 60});
                if (this.state.phaseState === 'Break') {
                    this.setState(state => ({
                        timer: state.breakMinutes * 60
                    }));
                };
            }; 
        }
    };

    subtractMinute(minuteType){
        if(minuteType === 'session'){
            this.setState(state => ({
                sessionMinutes: state.sessionMinutes -= 1,
            }));
            
            if (this.state.phaseState === 'Session') {
                this.setState(state => ({
                    timer: state.sessionMinutes * 60
                }));
            };

            if (this.state.sessionMinutes <= 1) {
                this.setState({sessionMinutes: 1});
                if (this.state.phaseState === 'Session') {
                    this.setState(state => ({
                        timer: state.sessionMinutes * 60
                    }));
                };
            };

        } else {//BREAK
            this.setState(state => ({
                breakMinutes: state.breakMinutes -= 1
            }));
            if (this.state.phaseState === 'Break') {
                this.setState(state => ({
                    timer: state.breakMinutes * 60
                }));
            };

            if (this.state.breakMinutes <= 1) {
                this.setState({breakMinutes: 1});
                if (this.state.phaseState === 'Break') {
                    this.setState(state => ({
                        timer: state.breakMinutes * 60
                    }));
                };
            };
            
        }
    };

    initializeClock(){
        this.setState({
            expectedStates: ['start', 'paused', 'running','session','break'],
            phaseState: 'Session',
            timerState: 'paused',
            sessionMinutes: 25,
            breakMinutes: 5,
            timer: 1500, //time in seconds
            intervalID: '', //need this for the countdown to be stopped
        });
        this.pauseTime()
        this.audioBeep.pause();
        this.audioBeep.currentTime = 0;
    };

    render () {
        var staStop;
        if (this.state.timerState === 'running') {
            staStop = 'pause'
        } else { staStop = 'play_arrow'}
        return (
            <div
                id="mainApp"
            >  
                <button onClick={this.phaseControl}>Dev Button</button>
                <div>
                    Dev Info: <br />
                    state: {this.state.timerState} <br />
                    timer: {this.state.timer} <br />
                </div>
                <div id='timer-label'>{this.state.phaseState}</div>
                <div id='breakSeshGroup'>
                    
                    <div>
                        <BreakSession 
                            labelID = 'session-label'
                            labelName = 'Session Length'
                            labelLength = 'session-length'
                            incrementFunc = {this.addMinute}
                            decrementFunc = {this.subtractMinute}
                            buttonIncrementID = 'session-increment'
                            buttonDecrementID = 'session-decrement'
                            minuteType = 'session'
                            minutes = {this.state.sessionMinutes}
                        />
                    </div>
                    
                    <div>
                        <BreakSession
                            labelID = 'break-label'
                            labelName = 'Break Length'
                            labelLength = 'break-length'
                            incrementFunc = {this.addMinute}
                            decrementFunc = {this.subtractMinute}
                            buttonIncrementID = 'break-increment'
                            buttonDecrementID = 'break-decrement'
                            minuteType = 'break'
                            minutes = {this.state.breakMinutes}
                        />
                    </div>
                </div>

                <div id='time-left'><p className="h1">{this.updateDisplay()}</p></div>
                <div id='buttons'>
                    <button 
                    id = 'start_stop'
                    className="btn btn-primary timerControls"
                    onClick={this.staStop}>
                        <span class="material-symbols-outlined">
                            {staStop}
                        </span>
                    </button> 
                     
                    <button 
                    id = 'reset'
                    className="btn btn-primary timerControls"
                    onClick={this.initializeClock}>
                        <span class="material-symbols-outlined">
                            device_reset
                        </span>
                    </button>
                </div>
                <audio 
                    id='beep'
                    preload="auto"
                    ref={(audio) => {this.audioBeep = audio;}} 
                    src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
            </div>
        )
    }
}

// COMPONENT TO CHANGE TIMER DURATION
class BreakSession extends React.Component {
    constructor(props){
        super(props);

        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
    }

    increment(){
        this.props.incrementFunc(this.props.minuteType)
    }

    decrement(){
        this.props.decrementFunc(this.props.minuteType)
    }
    render(){
        return (
            <div className='breakSeshController'>
                <button id={this.props.buttonIncrementID} onClick={this.increment} className='btn btn-info incrementButtons'>
                    <span class="material-symbols-outlined">
                        arrow_upward
                    </span>
                </button>
                <div id={this.props.labelID}> 
                    {this.props.labelName}
                </div>
                <div id={this.props.labelLength}>
                    {this.props.minutes}
                </div>
                <button id={this.props.buttonDecrementID} onClick={this.decrement} className='btn btn-info incrementButtons'>
                <span class="material-symbols-outlined">
                        arrow_downward
                    </span>
                </button>
            </div>
                
            
        )
    }
}



export default TimerApp