function register(voxaApp) {
  const CHOICES = ["rock", "paper", "scissors"];

  voxaApp.onIntent("LaunchIntent", () => {
    return {
      flow: "continue",
      reply: "Welcome",
      to: "askHowManyWins",
    };
  });

  voxaApp.onState("askHowManyWins", voxaEvent => {
    voxaEvent.model.userWins = 0;
    voxaEvent.model.alexaWins = 0;

    return {
      flow: "yield",
      reply: "AskHowManyWins",
      to: "getHowManyWins",
    };
  });

  voxaApp.onState("getHowManyWins", voxaEvent => {
    if (voxaEvent.intent.name === "MaxWinsIntent") {
      voxaEvent.model.wins = voxaEvent.intent.params.wins;

      if (voxaEvent.model.wins > 10) {
        return {
          flow: "yield",
          reply: "ConfirmUserChoice",
          to: "confirmChoice",
        };
      } else {
        return {
          flow: "continue",
          reply: "StartGame",
          to: "askUserChoice",
        };
      }
    }
  });

  voxaApp.onState("confirmChoice", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return {
        flow: "continue",
        to: "askUserChoice",
      };
    }

    if (voxaEvent.intent.name === "NoIntent") {
      return {
        flow: "continue",
        to: "askHowManyWins",
      };
    }
  });

  voxaApp.onState("askUserChoice", voxaEvent => {
    const userWon = parseInt(voxaEvent.model.userWins) >= parseInt(voxaEvent.model.wins);
    const alexaWon = parseInt(voxaEvent.model.alexaWins) >= parseInt(voxaEvent.model.wins);

    if(userWon) {
      return {
        flow: "continue",
        reply: "UserWinsTheGame",
        to: "askIfStartANewGame",
      };
    }

    if(alexaWon) {
      return {
        flow: "continue",
        reply: "AlexaWinsTheGame",
        to: "askIfStartANewGame",
      };
    }

    const min = 0;
    const max = CHOICES.length - 1;

    voxaEvent.model.userChoice = undefined;
    voxaEvent.model.alexaChoice = Math.floor(Math.random() * (max - min + 1)) + min;

    return {
      flow: "yield",
      reply: "AskUserChoice",
      to: "getUserChoice",
    };
  });

  voxaApp.onState("getUserChoice", voxaEvent => {
    if (voxaEvent.intent.name === "RockIntent") {
      voxaEvent.model.userChoice = "rock";
    } else if (voxaEvent.intent.name === "PaperIntent") {
      voxaEvent.model.userChoice = "paper";
    } else if (voxaEvent.intent.name === "ScissorsIntent") {
      voxaEvent.model.userChoice = "scissors";
    }

    if (voxaEvent.model.userChoice) {
      return {
        flow: "continue",
        to: "processWinner",
      };
    }
  });

  voxaApp.onState("processWinner", voxaEvent => {
    const alexaChoice = CHOICES[voxaEvent.model.alexaChoice];
    const { userChoice } = voxaEvent.model;
    let reply = "TiedResult";
  
    if (alexaChoice === userChoice) {
      return {
        flow: "continue",
        reply,
        to: "askUserChoice",
      };
    }
  
    if (alexaChoice === "rock") {
      if (userChoice === "paper") {
        voxaEvent.model.userWins += 1;
        reply = "UserWins";
      }
  
      if (userChoice === "scissors") {
        voxaEvent.model.alexaWins += 1;
        reply = "AlexaWins";
      }
    }
  
    if (alexaChoice === "paper") {
      if (userChoice === "scissors") {
        voxaEvent.model.userWins += 1;
        reply = "UserWins";
      }
  
      if (userChoice === "rock") {
        voxaEvent.model.alexaWins += 1;
        reply = "AlexaWins";
      }
    }
  
    if (alexaChoice === "scissors") {
      if (userChoice === "rock") {
        voxaEvent.model.userWins += 1;
        reply = "UserWins";
      }
  
      if (userChoice === "paper") {
        voxaEvent.model.alexaWins += 1;
        reply = "AlexaWins";
      }
    }
  
    return {
      flow: "continue",
      reply,
      to: "askUserChoice",
    };
  });

  voxaApp.onState("askIfStartANewGame", () => {
    return {
      flow: "yield",
      reply: "AskIfStartANewGame",
      to: "shouldStartANewGame",
    };
  });

  voxaApp.onState("shouldStartANewGame", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return {
        flow: "continue",
        reply: "RestartGame",
        to: "askHowManyWins",
      };
    }

    if (voxaEvent.intent.name === "NoIntent") {
      return {
        flow: "terminate",
        reply: "Bye",
      };
    }
  });

  voxaApp.onIntent("CancelIntent", () => {
    return {
      flow: "terminate",
      reply: "Bye",
    };
  });

  voxaApp.onIntent("StopIntent", () => {
    return {
      flow: "terminate",
      reply: "Bye",
    };
  });

  voxaApp.onIntent("ScoreIntent", voxaEvent => {
    if(voxaEvent.model.userWins > 0 || voxaEvent.model.alexaWins > 0) {
      return {
        flow: "continue",
        reply: "SayScore",
        to: "askIfContinueGame",
      };
    } else {
      return {
        flow: "continue",
        reply: "SayNullScore",
        to: "askIfStartANewGame",
      };
    }
  });

  voxaApp.onState("askIfContinueGame", () => {
    return {
      flow: "yield",
      reply: "ContinueGame",
      to: "canYouContinueTheGame",
    };
  });

  voxaApp.onState("canYouContinueTheGame", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return {
        flow: "continue",
        to: "askUserChoice",
      };
    }

    if (voxaEvent.intent.name === "NoIntent") {
      return {
        flow: "terminate",
        reply: "Bye",
      };
    }
  });

  voxaApp.onIntent("NewGameIntent", () => {
    return {
      flow: "yield",
      reply: "StartNewGame",
      to: "restartGame",
    };
  });

  voxaApp.onState("restartGame", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return {
        flow: "continue",
        to: "askHowManyWins",
      };
    }

    if (voxaEvent.intent.name === "NoIntent") {
      return {
        flow: "continue",
        to: "askUserChoice",
      };
    }
  });

  voxaApp.onIntent("FallbackIntent", () => {
    return {
      flow: "continue",
      reply: "CatchError",
      to: "SayHelp",
    };
  });

  voxaApp.onIntent("HelpIntent", () => {
    return {
      flow: "continue",
      to: "SayHelp",
    }
  });

  voxaApp.onState("SayHelp", voxaEvent => {
    if (voxaEvent.model.wins > 0) {
      return {
        flow: "continue",
        reply: "HelpInformation",
        to: "askUserChoice",
      };
    } else {
      return {
        flow: "continue",
        reply: "HelpInformation",
        to: "askHowManyWins",
      };
    }
  });
}

module.exports = register;
