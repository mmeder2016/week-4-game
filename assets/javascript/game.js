$(document).ready(function() {
	var fighterHasBeenChosen = false;
	var defenderHasBeenChosen = false;
	var enemyCount = 3;
	var gameStarted = false;

	/*
		Game object usage and rules
		For setting characters values must match indices of the
		character array: Curly = 0, Moe = 1, Larry = 2, Shemp = 3

		Start game button calls gameObj.startGame();

		Attack button calls: gameObj.getDefenderHP(), gameObj.getFighterHP(),
		 gameObj.getDefenderName(), gameObj.getFighterName(), 
		 gameObj.resetDefender()
	*/
	var hpClasses = [".hp-curly", ".hp-moe", ".hp-larry", ".hp-shemp"];
	var enemyDivs = [".div-curly-enemy", ".div-moe-enemy", ".div-larry-enemy", ".div-shemp-enemy"];
	var defenderDivs = [".div-curly-defender", ".div-moe-defender", ".div-larry-defender", ".div-shemp-defender"];

	/////////////////// SECTION 1 FRONT END CODE ///////////////////
	$("#id-start-game").click(function() {
		resetGame();
		gameStarted = true;
	});

	function resetGame() {
		$(".div-curly, .div-moe, .div-larry, .div-shemp").show();
		$(".div-curly-enemy, .div-moe-enemy, .div-larry-enemy, .div-shemp-enemy").hide();
		$(".div-curly-defender, .div-moe-defender, .div-larry-defender, .div-shemp-defender").hide();

		fighterHasBeenChosen = false;
		defenderHasBeenChosen = false;
		enemyCount = 3;

		gameObj.startGame();
		for (var i = 0; i < 4; i++) {
			$(hpClasses[i]).text("HP " + gameObj.getHP(i).toString());
		}
	}

	$(".button-attack").click(function() {
		if (fighterHasBeenChosen && defenderHasBeenChosen) {
			var ret = gameObj.attack();
			// Update healthPoints
			$(hpClasses[gameObj.defender]).text("HP " + gameObj.getDefenderHP().toString());
			$(hpClasses[gameObj.fighter]).text("HP " + gameObj.getFighterHP().toString());

			// Print message about the attack losses
			$(".p-attack-info-top").text("Fighter " + gameObj.getFighterName() + " lost " + gameObj.getDefenderCAPString() + " points.");
			$(".p-attack-info-bottom").text("Defender " + gameObj.getDefenderName() + " lost " + gameObj.getFighterAPString() + " points.");

			if (ret === 0) {
				// return 0 fighter is dead
				$(".p-attack-info-top").text("Fighter " + gameObj.getFighterName() + " lost to defender " + gameObj.getDefenderName() + ".");
				resetGame();

			} else if (ret === 1) {
				// return 1 fighter and defender are still alive
			} else {
				// return 2 defender is dead, fighter still has health points
				$(".p-attack-info-bottom").text("Fighter " + gameObj.getFighterName() + " defeated defender " + gameObj.getDefenderName() + ".");
				// This defender lost and needs to be invalidated
				defenderHasBeenChosen = false;
				$(defenderDivs[gameObj.defender]).hide();
				gameObj.resetDefender();
				enemyCount--;
				if (enemyCount === 0) {
					$(".p-attack-info-top").text("FIGHTER " + gameObj.getFighterName() + " DEFEATED ALL ENEMIES");
					$(".p-attack-info-bottom").text("PRESS START NEW GAME");
					resetGame();
				}
			}
		}
	});

	// Choose character functions
	$(".div-curly").click(function() {
		if (fighterHasBeenChosen === false && gameStarted === true) {
			$(".div-moe, .div-larry, .div-shemp").hide();
			$(".div-moe-enemy, .div-larry-enemy, .div-shemp-enemy").show();
			gameObj.fighter = 0;
			fighterHasBeenChosen = true;
		}
	});
	$(".div-moe").click(function() {
		if (fighterHasBeenChosen === false && gameStarted === true) {
			$(".div-curly, .div-larry, .div-shemp").hide();
			$(".div-curly-enemy, .div-larry-enemy, .div-shemp-enemy").show();
			gameObj.fighter = 1;
			fighterHasBeenChosen = true;
		}
	});
	$(".div-larry").click(function() {
		if (fighterHasBeenChosen === false && gameStarted === true) {
			$(".div-moe, .div-curly, .div-shemp").hide();
			$(".div-moe-enemy, .div-curly-enemy, .div-shemp-enemy").show();
			gameObj.fighter = 2;
			fighterHasBeenChosen = true;
		}
	});
	$(".div-shemp").click(function() {
		if (fighterHasBeenChosen === false && gameStarted === true) {
			$(".div-moe, .div-curly, .div-larry").hide();
			$(".div-moe-enemy, .div-curly-enemy, .div-larry-enemy").show();
			gameObj.fighter = 3;
			fighterHasBeenChosen = true;
		}
	});

	// Choose defender funtions
	$(".div-curly-enemy").click(function() {
		if (defenderHasBeenChosen === false) {
			$(".div-curly-enemy").hide();
			$(".div-curly-defender").show();
			gameObj.defender = 0;
			defenderHasBeenChosen = true;
		}
	});
	$(".div-moe-enemy").click(function() {
		if (defenderHasBeenChosen === false) {
			$(".div-moe-enemy").hide();
			$(".div-moe-defender").show();
			gameObj.defender = 1;
			defenderHasBeenChosen = true;
		}
	});
	$(".div-larry-enemy").click(function() {
		if (defenderHasBeenChosen === false) {
			$(".div-larry-enemy").hide();
			$(".div-larry-defender").show();
			gameObj.defender = 2;
			defenderHasBeenChosen = true;
		}
	});
	$(".div-shemp-enemy").click(function() {
		if (defenderHasBeenChosen === false) {
			$(".div-shemp-enemy").hide();
			$(".div-shemp-defender").show();
			gameObj.defender = 3;
			defenderHasBeenChosen = true;
		}
	});

	/////////////////// SECTION 2 GAME CODE ///////////////////
	// CHARACTER DATA
	var characters = [{
		stooge: "Curly",
		healthPoints: 145,
		attackBase: 8,
		attackPower: 16,
		counterAttackPower: 22,
		wins: 0 // Strictly for debugging statistics
	}, {
		stooge: "Moe",
		healthPoints: 176,
		attackBase: 6,
		attackPower: 10,
		counterAttackPower: 20,
		wins: 0 // Strictly for debugging statistics
	}, {
		stooge: "Larry",
		healthPoints: 160,
		attackBase: 7,
		attackPower: 20,
		counterAttackPower: 16,
		wins: 0 // Strictly for debugging statistics
	}, {
		stooge: "Shemp",
		healthPoints: 150,
		attackBase: 9,
		attackPower: 12,
		counterAttackPower: 18,
		wins: 0 // Strictly for debugging statistics
	}];


	// This button must be un-commented from index.html to work
	// It will run every permutation of fight orders and log
	// statistics to the console
	$("#id-test-game").click(function() {
		gameObj.startGame();
		gameObj.logCharacters();
		gameObj.createPermutations();
		gameObj.fightWithPermutations();
		console.log("All permutations completed.");
		gameObj.startGame();
	});


	var gameObj = {
		// indices into fighter array
		fighter: -1,
		defender: -1,

		resetFighter: function() {
			fighter = -1;
		},
		resetDefender: function() {
			defender = -1;
		},
		getHP(n) {
			if (n >= 0 && n < characters.length) {
				return characters[n].healthPoints;
			} else {
				return -10000;
			}
		},
		getFighterHP: function() {
			if (this.fighter >= 0 && this.fighter < characters.length) {
				return characters[this.fighter].healthPoints;
			} else {
				return -10000;
			}
		},
		getDefenderHP: function() {
			if (this.defender >= 0 && this.defender < characters.length) {
				return characters[this.defender].healthPoints;
			} else {
				return -10000;
			}
		},
		getFighterName: function() {
			if (this.fighter >= 0 && this.fighter < characters.length) {
				return characters[this.fighter].stooge;
			} else {
				return "INDEX OUT OF BOUNDS ERROR";
			}
		},
		getDefenderName: function() {
			if (this.defender >= 0 && this.defender < characters.length) {
				return characters[this.defender].stooge;
			} else {
				return "INDEX OUT OF BOUNDS ERROR";
			}
		},
		getFighterAPString: function() {
			if (this.fighter >= 0 && this.fighter < characters.length) {
				return characters[this.fighter].attackPower.toString();
			} else {
				return "INDEX OUT OF BOUNDS ERROR";
			}
		},

		getDefenderCAPString: function() {
			if (this.defender >= 0 && this.defender < characters.length) {
				return characters[this.defender].counterAttackPower.toString();
			} else {
				return "INDEX OUT OF BOUNDS ERROR";
			}
		},

		startGame: function() {
			this.fighter = -1;
			this.defender = -1;

			// We do not want to reset wins after every round for debugging purposes
			// FIGHTER WINS 2/3 of time, all fighters win equal number of times
			characters[0].healthPoints = 145;
			characters[0].attackBase = 8;
			characters[0].attackPower = 16;
			characters[0].counterAttackPower = 22;

			characters[1].healthPoints = 176;
			characters[1].attackBase = 6;
			characters[1].attackPower = 10;
			characters[1].counterAttackPower = 20;

			characters[2].healthPoints = 160;
			characters[2].attackBase = 7;
			characters[2].attackPower = 20;
			characters[2].counterAttackPower = 16;

			characters[3].healthPoints = 150;
			characters[3].attackBase = 9;
			characters[3].attackPower = 12;
			characters[3].counterAttackPower = 18;
		},

		attack: function() {
			// As the defender is attacked, his healthPoints are decreased by 
			// the attackPower of the fighter.
			characters[this.defender].healthPoints -= characters[this.fighter].attackPower;
			//this.logIndividualCharacter(this.fighter);
			//this.logIndividualCharacter(this.defender);
			// After the fighter attacks, if the defender's healthPoints are
			// not below zero, the fighters healthPoints are decreased by the
			// defender's counterAttackPoints
			if (characters[this.defender].healthPoints > 0) {
				characters[this.fighter].healthPoints -= characters[this.defender].counterAttackPower;
				//this.logIndividualCharacter(this.fighter);
				//this.logIndividualCharacter(this.defender);
			}
			// As the fighter attacks the defender his attackPower is increased
			// by the attackBase with each attack
			characters[this.fighter].attackPower += characters[this.fighter].attackBase;
			//this.logIndividualCharacter(this.fighter);
			//this.logIndividualCharacter(this.defender);
			// return 0 fighter is dead
			// return 1 fighter and defender are still alive
			// return 2 defender is dead, fighter still has health points
			if (characters[this.fighter].healthPoints < 0) {
				return 0;
			} else if (characters[this.defender].healthPoints > 0) {
				return 1;
			} else {
				return 2;
			}
		},

		/////////////////// SECTION 3 GAME OBJECT TESTING ///////////////////
		// BELOW ARE THE AUTOMATED TEST AND DEBUGGING FUNCTIONS. TO USE THE 
		// FOLLOWING CODE, UNCOMMENT THE test-game BUTTON IN INDEX.HTML. 
		// CLICKING ON THIS BUTTON WILL RUN EVERY PERMUTATION OF THE FIGHT
		// AND LOG THE RESULTS IN THE CONSOLE.

		fighterCount: 0,
		defenderCount: 0,

		createPermutations: function() {
			// Each group of 4 numbers (0 thru 3) is a permutation.
			// For 4 characters, there are 24 (4!) unique fighting orders
			// The first number will be the fighter, the next three numbers
			// will be the defenders in order. This allows us to test every 
			// possible combination of fight order.
			arr = [];
			for (var i = 0; i < 4; i++) {
				for (var j = 0; j < 4; j++) {
					if (j === i)
						continue;
					for (var k = 0; k < 4; k++) {
						if ((k === j) || (k === i))
							continue;
						for (var l = 0; l < 4; l++) {
							if ((l == i) || (l == j) || (l == k))
								continue;
							// var str = i.toString()+j.toString()+k.toString()+l.toString();
							arr.push(i);
							arr.push(j);
							arr.push(k);
							arr.push(l);
						}
					}
				}
			}

		},

		attackUntilDeath: function(f, d) {
			this.fighter = f;
			this.defender = d;
			var ret = this.attack();
			// while (fighter and defender are still alive)
			while (ret === 1) {
				var ret = this.attack();
			}
			//this.logIndividualCharacter(this.fighter);
			//this.logIndividualCharacter(this.defender);
			if (ret === 0) {
				// If defender wins return 0
				return 0;
			} else if (ret === 2) {
				// If fighter wins return 2
				return 2;
			}
		},

		fightWithPermutations: function() {

			var outcome = -1;
			// for each set of 4 numbers in permutations array
			for (var i = 0; i < arr.length / 4; i++) {

				var sp = " ";
				var str = "Permutation: " + i.toString() + " " +
					arr[i * 4].toString() + arr[(i * 4) + 1].toString() +
					arr[(i * 4) + 2].toString() + arr[(i * 4) + 3].toString() +
					" " + characters[arr[i * 4]].stooge +
					" " + characters[arr[i * 4 + 1]].stooge +
					" " + characters[arr[i * 4 + 2]].stooge +
					" " + characters[arr[i * 4 + 3]].stooge;

				console.log(str);
				// fighter - arr[0], defender - arr[1]
				outcome = this.attackUntilDeath(arr[i * 4], arr[(i * 4) + 1]);
				// if fighter wins
				if (outcome === 2) {
					// fighter - arr[0], defender - arr[2]
					outcome = this.attackUntilDeath(arr[i * 4], arr[(i * 4) + 2]);
					if (outcome === 2) {
						// fighter - arr[0], defender - arr[3]
						outcome = this.attackUntilDeath(arr[i * 4], arr[(i * 4) + 3]);
						if (outcome === 2) {
							console.log("  Fighter " + characters[this.fighter].stooge + " defeated all enemies.");
							characters[this.fighter].wins++;
							this.fighterCount++;
						} else {
							console.log("  Fighter " + characters[this.fighter].stooge + " lost to third defender " + characters[this.defender].stooge + ".");
							this.defenderCount++;
						}
					} else {
						console.log("  Fighter " + characters[this.fighter].stooge + " lost to second defender " + characters[this.defender].stooge + ".");
						this.defenderCount++;
					}
				} else {
					console.log("  Fighter " + characters[this.fighter].stooge + " lost to first defender " + characters[this.defender].stooge + ".");
					this.defenderCount++;
				}
				// Need to reset character values for next permutation
				gameObj.startGame();
			}
			console.log("Fighter won " + this.fighterCount + " times, Defender won " + this.defenderCount + " times.");
			for (var z = 0; z < 4; z++) {
				console.log(characters[z].stooge + " won " + characters[z].wins + " times.");
			}

		},

		logCharacters: function() {
			for (var i = 0; i < characters.length; i++) {
				this.logIndividualCharacter(i);
			}
		},

		logIndividualCharacter: function(n) {
			console.log(characters[n].stooge + "|" +
				characters[n].healthPoints + "|" +
				characters[n].attackPower + "|" +
				characters[n].counterAttackPower);
		},
	}
});