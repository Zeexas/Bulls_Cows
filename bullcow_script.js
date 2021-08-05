let vm = new Vue({
    el: '#app',
    data() {
        return {
            nums: [1,2,3,4,5,6,7,8,9,0],
            nums_mess: [],
            secret: '',
            guess: '',
            t_rows: 5,
            count: 0,
            moves: [],
            render: true,
            invalid: false,
            win: true,
            english: true,
        }
    },
    mounted() {
        this.draw_moves();
    },

    methods: {
        draw_moves() {
            for (let i = 0; i < this.t_rows; i++) {
                this.moves.push({num: '', bulls: '', cows: ''});
            }
        },

        new_game() {
            let numbers = [...this.nums];
            let first, second, temporary;
            for (let i = 0; i < 500; i++) {
                first = Math.floor(Math.random() * 10);
                second = Math.floor(Math.random() * 10);
                temporary = numbers[first];
                numbers[first] = numbers[second];
                numbers[second] = temporary;
            }
            this.nums_mess = numbers;
            this.secret = this.nums_mess.slice(0, 4).join('');
            // console.log(this.secret);
            this.guess = "";
            this.count = 0;
            this.t_rows = 5;
            this.moves = [];
            this.draw_moves();
            this.inputFocus();
            this.win = false;
            this.invalid = false;
            this.$refs.check_num.style.backgroundColor = 'rgba(0, 100, 220, 0.8)';
        },
        check_num() {
            if (!this.numValid()) {
                this.invalid = true;
                return;
            }
            this.invalid = false;

            let bulls = 0;
            let cows = 0;
            let secret = this.secret;
            for (let i = 0; i < 4; i++) {
                if (secret.includes(this.guess[i])) {
                    secret[i] === this.guess[i] ? bulls++ : cows++;
                }
            }
            // add rows if more than 10 tries
            if (this.count > this.t_rows - 2) {
                this.t_rows = this.count;
                this.moves.push({num: '', bulls: '', cows: ''});
            }
            
            this.record(bulls, cows);
            this.count++;

            if (secret === this.guess) {
                this.win = true;
                this.$refs.check_num.style.backgroundColor = 'lightgrey';
                if (this.english === true) {
                    this.moves[this.count]["num"] = 'Congratulations!!!';
                } else {
                    this.moves[this.count]["num"] = 'Поздравляем!!!';
                }
                // console.log('You win!');
            }

            this.rerender();
            this.inputFocus();
            this.guess = "";
        },

        numValid() {
            if (this.secret === '') {
                this.inputFocus();
                this.guess = "";
                return false;
            } else {
                if (this.guess === '') {
                    this.inputFocus();
                    return false;
                } else {
                    if (this.guess.length === 4 && /([0-9]{4})/.test(this.guess)) {
                        let check_guess = this.guess.split('').sort();
                        if (check_guess[0] === check_guess[1] ||
                            check_guess[1] === check_guess[2] ||
                            check_guess[2] === check_guess[3]) {
                            this.inputFocus();
                            this.guess = "";
                            return false; 
                        } else {return true};
                    } else {
                        this.inputFocus();
                        this.guess = "";
                        return false;
                    }
                }
            }
        },

        record(bulls, cows) {
            this.moves[this.count]["num"] = this.guess;
            this.moves[this.count]["bulls"] = bulls;
            this.moves[this.count]["cows"] = cows;
        },

        rerender() {
            // render DOM to remove renew data from Moves array
            this.render = false;
            this.$nextTick(()=> {
                this.render = true;
            });
        },

        inputFocus() {
            this.$refs.input_num.focus();
        },
        
        play() {
            let audio = this.$refs.music;
            if (audio.paused) {
                audio.volume = 0.2;
                audio.play();
                this.$refs.play.style.transform = 'rotateY(0)';
            } else {
                audio.pause();
                this.$refs.play.style.transform = 'rotateY(180deg)';
            }
        },
        language() {
            let lang = this.$refs.language;
            if (this.english) {
                this.english = false;
                lang.style.transform = 'rotateY(360deg)';
            } else {
                this.english = true;
                lang.style.transform = 'rotateY(0deg)';
            }
        },
    },
})