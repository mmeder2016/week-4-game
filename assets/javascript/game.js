$(document).ready(function() {


    $("#id-test-game").click(function() {
        gameObj.startGame();
        gameObj.logCharacters();
        // gameObj.fighter = 2;
        // gameObj.defender = 0;
        gameObj.createPermutations();
        gameObj.fightWithPermutations();
        //gameObj.attackUntilDeath(3, 0);

    });

    var characters = [{
        stooge: "Curly",
        healthPoints: 0,
        attackBase: 0,
        attackPower: 0,
        counterAttackPower: 0,
        wins: 0 // Strictly for debugging statistics
    }, {
        stooge: "Moe",
        healthPoints: 0,
        attackBase: 0,
        attackPower: 0,
        counterAttackPower: 0,
        wins: 0 // Strictly for debugging statistics
    }, {
        stooge: "Larry",
        healthPoints: 0,
        attackBase: 0,
        attackPower: 0,
        counterAttackPower: 0,
        wins: 0 // Strictly for debugging statistics
    }, {
        stooge: "Shemp",
        healthPoints: 0,
        attackBase: 0,
        attackPower: 0,
        counterAttackPower: 0,
        wins: 0 // Strictly for debugging statistics
    }];


    var gameObj = {
        // indices into fighter array
        fighter: -1,
        defender: -1,

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

        fighterWins: function() {
            //console.log("fighter wins");
        },
        defenderWins: function() {
            //console.log("defender wins");
        },

        // BELOW ARE THE AUTOMATED TEST AND DEBUGGING FUNCTIONS. TO USE THE 
        // FOLLOWING CODE, UNCOMMENT THE test-game BUTTON IN INDEX.HTML. 
        // CLICKING ON THIS BUTTON WILL RUN EVERY PERMUTATION OF THE FIGHT
        // AND LOGG THE RESULTS IN THE CONSOLE.
        fighterCount: 0,
        defenderCount: 0,
        moeWins: 0,
        larryWins: 0,
        curlyWins: 0,
        shempWins: 0,

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
                this.defenderWins();
                // If defender wins return 0
                return 0;
            } else if (ret === 2) {
                // If fighter wins return 2
                this.fighterWins();
                return 2;
            }
        },

        fightWithPermutations: function() {

            var outcome = -1;
            // for each set of 4 numbers in permutations array
            for(var i = 0; i < arr.length / 4; i++) {

            	var sp = " ";
            	var str = "Permutation: " + i.toString() + " " 
            	+ arr[i * 4].toString() + arr[(i * 4) + 1].toString() 
            	+ arr[(i * 4) + 2].toString() + arr[(i * 4) + 3].toString()
            	+ " " + characters[arr[i * 4]].stooge
            	+ " " + characters[arr[i * 4 + 1]].stooge
            	+ " " + characters[arr[i * 4 + 2]].stooge
            	+ " " + characters[arr[i * 4 + 3]].stooge;

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
                        if(outcome === 2)
                        {
                        	console.log("  Fighter "+ characters[this.fighter].stooge +" defeated all enemies.");
                        	characters[this.fighter].wins++;
                        	this.fighterCount++;
                        } else {
	                		console.log("  Fighter "+ characters[this.fighter].stooge +" lost to third defender "+ characters[this.defender].stooge +".");
	                		this.defenderCount++;
	                	}
                    }
                     else {
                		console.log("  Fighter "+ characters[this.fighter].stooge +" lost to second defender "+ characters[this.defender].stooge +".");
                		this.defenderCount++;
                	}
                } else {
                	console.log("  Fighter "+ characters[this.fighter].stooge +" lost to first defender "+ characters[this.defender].stooge +".");
                	this.defenderCount++;
                }
                // Need to reset character values for next permutation
                gameObj.startGame();
            }
            console.log("Fighter won " + this.fighterCount + " times, Defender won " + this.defenderCount + " times.");
            for(var z = 0; z < 4; z++)
            {
            	console.log(characters[z].stooge + " won " + characters[z].wins + " times." );
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