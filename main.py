from flask import Flask
from flask_ask import Ask, statement, question, convert_errors

app = Flask(__name__)
ask = Ask(app, '/')


@ask.launch
def launched():
    introduction = 'Hello, you can ask me about Men\'s and Women\'s table tennis world rankings. ' \
                   'In the future, I will support more complex queries.'
    return statement(introduction)


@ask.intent('HelloIntent')
def hello():
    introduction = 'Hello, you can ask me about Men\'s and Women\'s table tennis world rankings. ' \
                   'In the future, I will support more complex queries.'
    return statement(introduction)


@ask.intent('PlayerRankingIntent',
            mapping={'rank': 'Rank',
                     'gender': 'Gender'},
            convert={'rank': int})
def player_ranking(rank, gender):
    return statement('Received rank number {} and gender {}'.format(rank, gender))


def get_single_player_ranking(rank, gender):
    pass


if __name__ == '__main__':
    app.run(debug=True)
