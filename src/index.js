/**
 * 
 * ==== { Configuration Values } ====
 */
let COLOR_SCHEME_COLORS = 5;
let GENERATION_PERMUTATIONS = 1000;

/**
 * 
 * ==== { Runtime variables } ====
 */
var trainingData = [
    {
        input: [211,47,47,255,255,210,244,67,54,33,33,33,117,117,117],
        output: {rating: 1}
    },
    {
        input: [194,24,91,248,187,208,233, 30, 99,33,33,33,117,117,117],
        output: {rating: 1}
    },
    {
        input: [123, 31, 162,225, 190, 231,156, 39, 176,33,33,33,117,117,117],
        output: {rating: 1}
    },
    {
        input: [81, 45, 168,209, 196, 233,103, 58, 183,33,33,33,117,117,117],
        output: {rating: 1}
    },
    {
        input: [48, 63, 159,197, 202, 233,63, 81, 181,33,33,33,117,117,117],
        output: {rating: 1}
    },
    {
        input: [25, 118, 210, 187, 222, 251,33, 150, 243,33,33,33,117,117,117],
        output: {rating: 1}
    }
];

/**
 * 
 * ==== { React / UI } ====
 * 
 */

class App extends React.Component {

    constructor(props) {
        super(props);
        this.net = new brain.NeuralNetwork({activation: "leaky-relu"});
    }

    state = {
        export: null,
        trainingData: [{
            input: [211,47,47,255,255,210,244,67,54,33,33,33,117,117,117],
            output: {rating: 1}
        },
        {
            input: [194,24,91,248,187,208,233, 30, 99,33,33,33,117,117,117],
            output: {rating: 1}
        },
        {
            input: [123, 31, 162,225, 190, 231,156, 39, 176,33,33,33,117,117,117],
            output: {rating: 1}
        },
        {
            input: [81, 45, 168,209, 196, 233,103, 58, 183,33,33,33,117,117,117],
            output: {rating: 1}
        },
        {
            input: [48, 63, 159,197, 202, 233,63, 81, 181,33,33,33,117,117,117],
            output: {rating: 1}
        },
        {
            input: [25, 118, 210, 187, 222, 251,33, 150, 243,33,33,33,117,117,117],
            output: {rating: 1}
        }],
        currentColors: [255,45,85,255,204,0,76,217,100,0,122,255,88,86,214],
        score: "No score available"
    }

    next(trainingData) {

        const net = new brain.NeuralNetwork();
        net.train(trainingData);
    
        /*var randomCombination = [];
        for(var j = 0; j < 5; j++) {
            var randColor = this.randomColor();
            randomCombination.push(randColor[0]);
            randomCombination.push(randColor[1]);
            randomCombination.push(randColor[2]);
        }

        console.log("Random Combination: " + randomCombination);
        console.log("Score: " + JSON.stringify(net.run(randomCombination)));

        return randomCombination;*/
    
        // Keep track of the current best combination
        var bestCombination = null;
        var bestScore = -1;
        for(var i = 0; i < 1000; i++) {
    
            // Create random color combinations
            var randomCombination = [];
            for(var j = 0; j < 5; j++) {
                if(j <= 3) {
                    var randColor = this.randomColor();
                } else if(j == 4) {
                    var randColor = this.randomBlackColor();
                }
                randomCombination.push(randColor[0]);
                randomCombination.push(randColor[1]);
                randomCombination.push(randColor[2]);
            }
    
            // Check if the neural network rated this one highest
            var score = net.run(randomCombination).score;
            if(score >= bestScore) {
                bestCombination = randomCombination;
                bestScore = score;
            }
        }

        return {
            combination: bestCombination,
            score: bestScore
        };
    }

    randomColor() {
        var r = Math.floor(Math.random() * 255) + 1;
        var g = Math.floor(Math.random() * 255) + 1;
        var b = Math.floor(Math.random() * 255) + 1;
    
        return [r,g,b]
    }

    randomBlackColor() {
        var r = Math.floor(Math.random() * 50) + 1;
        var g = Math.floor(Math.random() * 50) + 1;
        var b = Math.floor(Math.random() * 50) + 1;
    
        return [r,g,b]
    }

    randomGrayColor() {
        var randomBlack = this.randomBlackColor();
        return [255-randomBlack.r,255-randomBlack.g,255-randomBlack.b];
    }

    render() {
        return (
        <div style={{flex: 1}}>
            <div style={{ flex: 5, flexDirection: 'row' }}>
                <ColorScheme backgroundColor={"rgb(" + this.state.currentColors[0] + "," + this.state.currentColors[1] + "," + this.state.currentColors[2] + ")"}/>
                <ColorScheme backgroundColor={"rgb(" + this.state.currentColors[3] + "," + this.state.currentColors[4] + "," + this.state.currentColors[5] + ")"}/>
                <ColorScheme backgroundColor={"rgb(" + this.state.currentColors[6] + "," + this.state.currentColors[7] + "," + this.state.currentColors[8] + ")"}/>
                <ColorScheme backgroundColor={"rgb(" + this.state.currentColors[9] + "," + this.state.currentColors[10] + "," + this.state.currentColors[11] + ")"}/>
                <ColorScheme backgroundColor={"rgb(" + this.state.currentColors[12] + "," + this.state.currentColors[13] + "," + this.state.currentColors[14] + ")"}/>
            </div>
            <center>
                <div style={{flex: 1}}>
                    <RatingScheme 
                    predicted={this.state.score}
                    onClick={ (function(r) {
                        this.state.trainingData.push({
                            input: this.state.currentColors,
                            output: { score: r/5 }
                        });
                        alert(JSON.stringify(this.state.trainingData));
                        var nxt = this.next(this.state.trainingData);
                        this.setState({
                            currentColors: nxt.combination,
                            score: "Computer thinks: " + nxt.score,
                            export: nxt.json
                        });
                    }).bind(this) }/>
                </div>
                <div>
                    <ImportExportBar export={JSON.stringify(this.state.trainingData)}/>
                </div>
            </center>
        </div>
        );
    }
}

class ColorScheme extends React.Component {
    render() {
        return (
            <div style={{ flex: 1, height: 90, backgroundColor: this.props.backgroundColor}}>
            </div>
        ); 
    }
}

class RatingScheme extends React.Component {

    state = {
        showingPrediction: false
    }

    render() {
        return (
            <div>
                <div>
                    <button onClick={() => this.props.onClick(1)}>[*]</button> 
                    <button onClick={() => this.props.onClick(2)}>[*]</button> 
                    <button onClick={() => this.props.onClick(3)}>[*]</button> 
                    <button onClick={() => this.props.onClick(4)}>[*]</button> 
                    <button onClick={() => this.props.onClick(5)}>[*]</button> 
                </div>
                {
                    (this.state.showingPrediction) ? <p>{this.props.predicted}</p> : <button style={{backgroundColor: 'white'}} onClick={() => this.setState({showingPrediction: true})}>What does the computer think?</button>
                }
            </div>
        );
    }
}

class ImportExportBar extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <div style={{flexDirection: "row", flex: 1}}>
                <textarea></textarea>
                <textarea>{this.props.export}</textarea>
            </div>
        )
    }
}

    ReactDOM.render( <App/> , document.getElementById('container'));


/**
 * 
 * ==== { Event Handlers } ====
 * 
 */

function rate(rating) {
    trainingData.push({
        input: this.state.currentColors,
        output: {rating: rating / 5}
    });
}

/**
 * 
 * ==== { Machine Learning Functions } ====
 */


/**
 * 
 * ==== { Utility Functions } ====
 * 
 */
