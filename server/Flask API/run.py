from flask import Flask,request,jsonify
from bs4 import BeautifulSoup
import requests
from requests.models import requote_uri

app = Flask(__name__)

@app.route('/imdbDetails',methods=['POST'])
def imdbDetails():
    params = request.json
    print(params['imdb_id'])

    url = requests.get(f"https://www.imdb.com/title/{params['imdb_id']}/").text

    soup = BeautifulSoup(url,'lxml')

    rating = soup.find_all('span',class_='AggregateRatingButton__RatingScore-sc-1ll29m0-1 iTLWoV')
    imdb = rating[0].text

    duration = soup.find_all('li',class_="ipc-inline-list__item")
    movieTime = duration[2].text

    # make an array of objects of cast.. [{photo:"",real-name:"",movie-name:""},{},{}]
    cast = []

    data = {
        'imdb' : imdb,
        'time' : movieTime,
        'cast' : cast
    }
    print(data)
    return jsonify(data)

if __name__ == '__main__':
    app.run()
