from boggle import Boggle

from flask import Flask, render_template, session, request, jsonify
from flask_debugtoolbar import DebugToolbarExtension


boggle_game = Boggle()

app = Flask(__name__) 
app.debug = True
app.config["SECRET_KEY"] = "Secretkey1!"

debug = DebugToolbarExtension(app)


@app.route('/')
def generating_board():

    board = boggle_game.make_board()
    session["board"] = board
    highscore = session.get('highscore', 0)
    numplays = session.get('numplays', 0)

    return render_template('board.html',
                            board=board, 
                           highscore=highscore,
                            numplays=numplays)

@app.route('/valid-word')
def valid_word():

    word = request.args['word']
    board = session['board']
    result = boggle_game.check_valid_word(board,word)

    return jsonify({'result': result})

@app.route('/post-score', methods=['POST'])
def show_score():

    score = request.json['score']
    highscore = session.get('highscore', 0)
    numplays = session.get('numplays', 0)

    session['highscore'] = max(score,highscore)
    session['numplays'] = numplays + 1

    return jsonify(newRecord=score > highscore)

