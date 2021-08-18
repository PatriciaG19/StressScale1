import { React, Fragment, Component } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

/* Creating 'Summary' component */
class Summary extends Component {
  constructor(props) {
    super(props);

    /* Defining the state of the app */
    this.state = {
      userId: "",
      score: 0,
      numberOfQuestions: 0,
      numberOfAnsweredQuestions: 0,
    };
  }

  componentDidMount() {
    const { state } = this.props.location;

    /* Setting the present state */
    this.setState = {
      userId: state.userId,
      score: state.score,
      numberOfQuestions: state.numberOfQuestions,
      numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
      scoreMessage: state.scoreMessage,
	  link: "",
	  text: ""
    };
  }
  render() {
    console.log(localStorage.getItem("userId"));
    console.log(
      "scoreMessage from summary",
      JSON.parse(localStorage.getItem("scoreMessage"))
    );
    console.log(this.props.location.state);

    /* Setting the state and other variables */
    const { state } = this.props.location;
    let stats, link, text, relaxImg

    /* Setting the gifs according to present score */
		// Array of day, score for curent user
		const scoreFromServer = JSON.parse(localStorage.getItem("scoreMessage"))
		let showStressLevel;

	if (this.state.score > -1 && this.state.score < 14) {
		text = "Ways to Manage Stress";
		link = "https://www.webmd.com/balance/stress-management/stress-management";
		relaxImg = "https://media4.giphy.com/media/pmONR25D6YmkI2qHVg/giphy.gif"
		showStressLevel = (
			<>
				<p className="score">Stress level is low</p>
				<p className="score">You have no reason to worry. Your stress levels are under control 🎉</p>
				{calculatePreviousDay(scoreFromServer, this.state)}
			</>
		)

	} else if (this.state.score > 13 && this.state.score < 27) {
		text = "How to manage and reduce stress";
		link = "https://www.mentalhealth.org.uk/publications/how-manage-and-reduce-stress";
		relaxImg = "https://media3.giphy.com/media/2csuIJj6TmuKA/giphy.webp"

		showStressLevel = (
			<>
				<p className="score">Stress level is moderate</p>
				<p className="score">You have a moderate stress level. Need to work on a few things 🦾</p>
				{calculatePreviousDay(scoreFromServer, this.state)}
			</>
		)
	} else {
		text = "16 Simple Ways to Relieve Stress and Anxiety";
		link = "https://www.healthline.com/nutrition/16-ways-relieve-stress-anxiety";
		relaxImg = "https://media4.giphy.com/media/dDXZ3qU5nRBIe82Uit/giphy.gif"
	
		showStressLevel = (
			<>
				<p className="score">Stress level is hight</p>
				<p className="score">You need to relax, my friend! You have a high stress level 🤯</p>
				{calculatePreviousDay(scoreFromServer, this.state)}
			</>
		)
	}

    if (state !== undefined) {
      stats = (
        <Fragment>
          <p className="wrapper stats-wrapper">
            <p className="test-over">
              You have successfully completed the test ✅
            </p>
            <img className="relaxImg" src={relaxImg} alt="relax" />
            {showStressLevel}
            <div className="wrapper landing-footer-wrapper summary-footer-wrapper">
              <ul className="footer-nav-list">
                <label>Helpful links:</label>
                <a
                  href="https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/tips-to-reduce-stress/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <li className="footer-list-item">10 stress busters</li>
                </a>
                <a href={link} target="_blank" rel="noreferrer">
                  <li className="footer-list-item">{text}</li>
                </a>
              </ul>
            </div>
            <div className="stats-details">
              <div>
                <p>Total number of questions:{" " + state.numberOfQuestions}</p>
                <p>
                  Total number of questions answered:
                  {" " + state.numberOfAnsweredQuestions}
                </p>
              </div>
              <div>
                <Link to="/">
                  <button className="btn btn-form">Exit to Homepage</button>
                </Link>
              </div>
            </div>
		  </p>
        </Fragment>
      );
    } else {
      stats = (
        <Fragment>
          <div className="wrapper stats-wrapper">
            <h1>Test results not available</h1>
          </div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Helmet>
          <title>Stress Scale</title>
        </Helmet>
        <div className="container summary-container">{stats}</div>
      </Fragment>
    );
  }

}

export default Summary;
function calculatePreviousDay(result, state) {
	console.log("Result in calclcuate previous day", result)
	console.log("State in calclcuate previous day", state)
	if (localStorage.getItem("day") < 1) {
		// Sanity check
		alert("Day is less than 1");
	} else if (localStorage.getItem("day") == 1) {
		// Do nothing use the mesage below.
	} else {
		// More than 1 day compare previous day result
		if (result[result.length - 2].score > result[result.length - 1].score) {
			return (<p className="score">{"Well done 👍🏼 your score has gone down since yesterday by " + (result[result.length - 2].score - result[result.length - 1].score)}</p>)
		} else if (result[result.length - 2].score == state.score) {
			return (<p className="score">"Your score is equal to that of yesterday. Below are some links to help you with any stress you are having."</p>)
		} else {
			return (<p className="score">{"Your scores have increased by " + (result[result.length - 1].score - result[result.length - 2].score) + ". You need to take it easy by taking a walk or doing some breathing exercises"}</p>)
		}
	}
}

