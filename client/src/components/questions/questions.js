import { React, Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Axios from "axios";

import questions from "../../data.json";
import checkBlank from "../../utils/checkBlank";

import keepGoingImg from "./images/keepGoing.jpeg";
import smileyImg from "./images/smiley.jpeg";
import axios from "axios";

class QuestionsPage extends Component {
  constructor(props) {
    super(props);

    /* Creating the state and declaring it's variables */
    this.state = {
      questions: questions,
      currentQuestionIndex: 0,
      currentQuestion: {},
      nextQuestion: {},
      previousQuestion: {},
      nextButtonDisabled: false,
      previousButtonDisabled: false,
      numberOfQuestions: questions.length,
      numberOfAnsweredQuestions: 0,
      score: 0,
      saveScore: 0,
      closeModal: 0,
    };
  }

  componentDidMount() {
    /* Extracting variables from state and showing the questions */
    const { questions, currentQuestion, nextQuestion, previousQuestion } =
      this.state;
    this.showQuestions(
      questions,
      currentQuestion,
      nextQuestion,
      previousQuestion
    );
  }

  /* Defining the showQuestions function */
  showQuestions(
    questions = this.state.questions,
    currentQuestion,
    nextQuestion,
    previousQuestion
  ) {
    if (!checkBlank(this.state.questions)) {
      let currentQuestionIndex = this.state.currentQuestionIndex;
      questions = this.state.questions;
      currentQuestion = questions[currentQuestionIndex];
      nextQuestion = questions[currentQuestionIndex + 1];
      previousQuestion = questions[currentQuestionIndex - 1];

      /* Changing/setting the state */
      this.setState({
        currentQuestion,
        nextQuestion,
        previousQuestion,
      });
    } else {
      alert("Blank/undefined data!");
    }
  }

  /* Creating the endTest() function for finishing test */
  endTest = () => {
    const { state } = this;
	// First we add the score
	
	Axios.post("api/addScore", {
		userId: localStorage.getItem("userId"),
		dailyScore: state.score,
		day: localStorage.getItem("day")
	}).then(async (response) => {
		// After the score is added return all the days(if any)
		const response_1 = await Axios.post("/api/showScore", {
			userId: localStorage.getItem("userId"),
			dailyScore: state.score,
			day: localStorage.getItem("day")
		});
		console.log("reposne from show score ", response_1);
		/* Setting the local storage variable for 'scoreMessage */
		if (response_1.data.scoreMessage) {
			localStorage.setItem("scoreMessage", response_1.data.scoreMessage);
		} else {
			// Sanity check
			alert("No score from server");
			localStorage.setItem("scoreMessage", null);
		}
		console.log(JSON.parse(localStorage.getItem("scoreMessage")));
		alert("The test has concluded.");
	})


    /* Setting timeout of 500ms so that the incoming data cna be loaded */
    setTimeout(() => {
      const userStats = {
        userId: localStorage.getItem("userId"),
        score: state.score,
        numberOfQuestions: state.numberOfQuestions,
        numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
        scoreMessage: JSON.parse(localStorage.getItem("scoreMessage")),
      };
      console.log(userStats);
      this.props.history.push("/summary", userStats);
      localStorage.removeItem("userId");
    }, 500);
  };

  /* Handaling the clicks on different options with handleOptionClick() */
  handleOptionClick = (e) => {
    let element = e.target;
    if (element.innerHTML === "never") {
      if (element.id.split("__")[1] === "false") {
        this.saveScore = 0;
      } else {
        this.saveScore = 4;
      }
    } else if (element.innerHTML === "almost never") {
      if (element.id.split("__")[1] === "false") {
        this.saveScore = 1;
      } else {
        this.saveScore = 3;
      }
    } else if (element.innerHTML === "sometimes") {
      if (element.id.split("__")[1] === "false") {
        this.saveScore = 2;
      } else {
        this.saveScore = 2;
      }
    } else if (element.innerHTML === "fairly often") {
      if (element.id.split("__")[1] === "false") {
        this.saveScore = 3;
      } else {
        this.saveScore = 1;
      }
    } else if (element.innerHTML === "very often") {
      if (element.id.split("__")[1] === "false") {
        this.saveScore = 4;
      } else {
        this.saveScore = 0;
      }
    }

    /* Showing or hiding modal */
    if (this.state.numberOfAnsweredQuestions % 3 === 0) {
      document.getElementById("modal").className = "show";
    } else {
      document.getElementById("modal").className = "hide";
    }

    /* Handling different images for different scenarios */
    if (this.state.score >= 26) {
      this.modalImg = keepGoingImg;
    } else if (this.state.score >= 13 && this.state.score < 26) {
      this.modalImg = smileyImg;
    } else if (this.state.score > 8 && this.state.score < 13) {
      this.modalImg = smileyImg;
    }

    /* Setting the state */
    this.setState(
      (prevState) => ({
        score: prevState.score + this.saveScore,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
      }),
      /* Exisiting the questions page */
      () => {
        if (this.state.nextQuestion === undefined) {
          this.endTest();
        } else {
          this.showQuestions(
            this.state.questions,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      }
    );
    // }
  };

  /* Handaling closing modal on clicking close(x) button */
  closeModalFn = (e) => {
    document.getElementById("modal").className = "hide";
  };

  /* Handaling 'Exit' button click */
  handleButtonClick = (e) => {
    switch (e.target.id) {
      case "exit-button":
        this.handleExitButtonClick();
        break;
      default:
        break;
    }
  };

  /* Handaling 'Exit' button click */
  handleExitButtonClick = () => {
    window.confirm("Are you sure you want to exit out of the stress test?");
    this.endTest();
  };

  render() {
    const { currentQuestion } = this.state;
    if (localStorage.getItem("userId") !== null) {
      return (
        <Fragment>
          <Helmet>
            <title>Stress Scale</title>
          </Helmet>
          <div className="container questions-container">
            <div
              id="modal"
              style={{
                visibility: this.modalVisibility,
                opacity: this.modalOpacity,
              }}
            >
              <span className="modal-close" onClick={this.closeModalFn}>
                X
              </span>
              <div className="modalImg">
                {this.modalImg ? (
                  <img src={this.modalImg} alt="#" className="modalPic" />
                ) : (
                  ``
                )}
              </div>
            </div>
            <div className="wrapper">
              <div className="question-block">
                <p
                  id={currentQuestion.id}
                  className="question"
                  title={currentQuestion.question}
                >
                  {currentQuestion.question}
                </p>
              </div>
              <div className="answer-block">
                <p
                  id={
                    currentQuestion.id +
                    "-" +
                    currentQuestion.optionA +
                    "__" +
                    currentQuestion.reverse
                  }
                  className="option"
                  onClick={this.handleOptionClick}
                >
                  {currentQuestion.optionA}
                </p>
                <p
                  id={
                    currentQuestion.id +
                    "-" +
                    currentQuestion.optionB +
                    "__" +
                    currentQuestion.reverse
                  }
                  className="option"
                  onClick={this.handleOptionClick}
                >
                  {currentQuestion.optionB}
                </p>
                <p
                  id={
                    currentQuestion.id +
                    "-" +
                    currentQuestion.optionC +
                    "__" +
                    currentQuestion.reverse
                  }
                  className="option"
                  onClick={this.handleOptionClick}
                >
                  {currentQuestion.optionC}
                </p>
                <p
                  id={
                    currentQuestion.id +
                    "-" +
                    currentQuestion.optionD +
                    "__" +
                    currentQuestion.reverse
                  }
                  className="option"
                  onClick={this.handleOptionClick}
                >
                  {currentQuestion.optionD}
                </p>
                <p
                  id={
                    currentQuestion.id +
                    "-" +
                    currentQuestion.optionE +
                    "__" +
                    currentQuestion.reverse
                  }
                  className="option"
                  onClick={this.handleOptionClick}
                >
                  {currentQuestion.optionE}
                </p>
              </div>
              <div className="buttons-block">
                <button
                  id="exit-button"
                  className="btn btn-close"
                  onClick={this.handleButtonClick}
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <Helmet>
            <title>Stress Scale</title>
          </Helmet>
          <div className="container questions-container">
            <h1>
              You are not logged in! Please <Link to="/">go to homepage</Link>{" "}
              and login to continue.
            </h1>
          </div>
        </Fragment>
      );
    }
  }
}

export default QuestionsPage;
