import requests
from bs4 import BeautifulSoup

url = 'http://old.ittf.com/ittf_ranking/WR_Table_3_A2.asp?year1=2017&month1=1&Category=100M'
session = requests.Session()
headers = {
    'Accept-Encoding': 'gzip, deflate, sdch',
    'Accept-Language': 'en-US,en;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
}
response = session.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

tables = soup.find_all('table')[0].find_all('table')

# for index, table in enumerate(tables):
#     if str(table).find('hendong') > -1:
#         print table
#         print index
#         break
# print len(tables)

rankings_table = tables[10]
player_rows = [row for row in rankings_table.find_all('tr') if row.find('td', {'align': 'center'}) and row.find('td').has_attr('bgcolor')]

for row in player_rows:
    name = row.find_all('td')[2].find('font').text
    print ''.join(list(name.encode('utf-8'))[:-7]).title()
# name = player_rows[0].find_all('td')[2].find('font').text
# print list(name.encode('utf-8'))
