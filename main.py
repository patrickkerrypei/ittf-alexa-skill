import requests
from bs4 import BeautifulSoup
from flask import Flask
from flask_ask import Ask, statement, question, convert_errors

app = Flask(__name__)
ask = Ask(app, '/')
session = requests.Session()
headers = {
    'Accept-Encoding': 'gzip, deflate, sdch',
    'Accept-Language': 'en-US,en;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
}
# Append M for men, W for women
base_url = 'http://old.ittf.com/ittf_ranking/WR_Table_3_A2.asp?year1=2017&month1=1&Category=100'


@ask.launch
def launched():
    introduction = 'Hello, you can ask me about Men\'s and Women\'s table tennis world rankings. ' \
                   'In the future, I will support more complex queries.'
    return statement(introduction)


@ask.intent('PlayerRankingIntent',
            mapping={'rank': 'Rank',
                     'gender': 'Gender'},
            convert={'rank': int})
def player_ranking(rank, gender):
    return statement('The number {} ranked {} is {}'
                     .format(rank, gender, get_single_player_ranking(rank, gender)))


def get_single_player_ranking(rank, gender):
    m_keywords = ['male', 'males', 'men', 'man', 'guys', 'guy']
    w_keywords = ['girl', 'girls', 'lady', 'ladies', 'female', 'females', 'women', 'woman']

    suffix = None
    if gender in m_keywords:
        suffix = 'M'
    elif gender in w_keywords:
        suffix = 'W'
    endpoint = base_url + suffix
    response = session.get(endpoint)

    soup = BeautifulSoup(response.text, 'html.parser')
    tables = soup.find_all('table')[0].find_all('table')

    rankings_table = tables[10]
    player_rows = [row for row in rankings_table.find_all('tr') if
                   row.find('td', {'align': 'center'}) and row.find('td').has_attr('bgcolor')]
    index = rank - 1
    player_row = player_rows[index]
    name_with_utf8 = player_row.find_all('td')[2].find('font').text
    name = ''.join(list(name_with_utf8.encode('utf-8'))[:-7])

    return name.title()


if __name__ == '__main__':
    app.run(debug=True)
