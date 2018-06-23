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
var net = new brain.NeuralNetwork({activation: "leaky-relu"});
var trainingData = [];

/**
 * 
 * ==== { React / UI } ====
 * 
 */

class App extends React.Component {

    state = {
        trainingData: [],
        currentColors: [255,45,85,255,204,0,76,217,100,0,122,255,88,86,214]
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
                    <RatingScheme onClick={ (function(r) {
                        this.state.trainingData.push({
                            input: this.state.currentColors,
                            output: r/5
                        });
                        this.setState({
                            currentColors: next(this.state.trainingData)
                        });
                    }).bind(this) }/>
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
    render() {
        return (
            <div>
                <button onClick={() => this.props.onClick(1)}>[*]</button> 
                <button onClick={() => this.props.onClick(2)}>[*]</button> 
                <button onClick={() => this.props.onClick(3)}>[*]</button> 
                <button onClick={() => this.props.onClick(4)}>[*]</button> 
                <button onClick={() => this.props.onClick(5)}>[*]</button> 
            </div>
        );
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
function next(trainingData) {

    net.train(trainingData);

    var randomCombination = [];
    for(var j = 0; j < 5; j++) {
        randomCombination.push(randomColor());
    }

    // Keep track of the current best combination
    var bestCombination = null;
    var bestScore = -1;
    for(var i = 0; i < 100; i++) {

        // Create random color combinations
        var randomCombination = [];
        for(var j = 0; j < 5; j++) {
            var randColor = randomColor();
            randomCombination.push(randColor[0]);
            randomCombination.push(randColor[1]);
            randomCombination.push(randColor[2]);
        }

        // Check if the neural network rated this one highest
        var score = net.run(randomCombination);
        if(score >= bestScore) {
            bestCombination = randomCombination;
            bestScore = score;
        }
    }

    return bestCombination;
}

/**
 * 
 * ==== { Utility Functions } ====
 * 
 */
function randomColor() {
    var r = Math.floor(Math.random() * 255) + 1;
    var g = Math.floor(Math.random() * 255) + 1;
    var b = Math.floor(Math.random() * 255) + 1;

    return [r,g,b]
}