// New game
class BoggleGame{

    // game length set to 60 sec
    constructor(boardId, secs = 60){
        this.secs = secs;
        this.showTimer();

        this.score = 0;
        this.words = new Set();
        this.board = $('#' + boardId);
        // count every 1000ms
        this.timer = setInterval(this.tick.bind(this), 1000);

        $('.add_word', this.board).on('submit', this.handleSubmit.bind(this));
    }
    // Submitting word
    async handleSubmit(evt){
        evt.preventDefault();

        const term = $('.word', this.board);
        let word = term.val();

        if (!word) return;

        if (this.words.has(word)){
            this.showMessage(`Already found ${word}`, 'error');
            return;
        }
    
    // Check for valid word
        const response = await axios.get('/valid-word',{ params: {word: word}});
        if(response.data.result === 'not-word'){
            this.showMessage(` ${word} is not a valid word `, 'error');
        }
        else if (response.data.result === 'not-on-board'){
            this.showMessage(`${word} is not on the board`, 'error');
        }
        else{
        this.showWord(word);
        this.score += word.length;
        this.showScore();
        this.words.add(word);
        this.showMessage(`Added: ${word}`,'ok');

    }
        term.val('').focus();
    }

    // Shows the list of word typed
    showWord(word) {
        $(".words", this.board).append($('<li>', {text:word}));
    }

    // Shows message
    showMessage(msg,clas){
        $('.msg', this.board)
        .text(msg)
        .removeClass()
        .addClass(`msg ${clas}`);
    }

    // Shows your score
    showScore(){
        $('.score', this.board)
        .text(this.score);
    }

    // update timer 
    showTimer(){
        $('.timer', this.board).text(this.secs);
    }

    // handle second passing 
    async tick(){
        this.secs -= 1;
        this.showTimer();

        if(this.secs === 0){
            clearInterval(this.timer);
            await this.scoreGame();
        }
    }

    // Scores the game 
    async scoreGame(){
        $('.add_word', this.board).hide();
        const response = await axios.post('/post-score', {score: this.score});
        if(response.data.newRecord){
            this.showMessage(`New Record: ${this.score}`, 'ok');
        }
        else{
            this.showMessage(`Final Score: ${this.score}`, 'ok');
        }
    }
}



