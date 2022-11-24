import React from 'react';

class App extends React.Component {
	constructor(props: object) {
    super(props);
    this.state = {color: "red", atr2: "gaga"};
  }

	componentDidMount() {
		
	}

	onClick() {
		this.setState({color: "blue"});
	}

	render() {
		return (
				<div className="App">
					<button onClick={this.onClick}></button>
					App
				</div>
			);
	}
}