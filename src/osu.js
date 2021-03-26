class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          circle: {
            "x": 45,
            "y": 50,
            "width": 10,
            "time": 10
          }
        }
    }



    render() {
        return (
            <div>

            </div>
        );
    };

    renderCanvas(){
      return (

      )
    }
}

ReactDOM.render(<App />, document.getElementById("app"))
//change this ^^
