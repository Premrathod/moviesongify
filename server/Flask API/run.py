from flask import Flask,request,jsonify
from bs4 import BeautifulSoup
import requests
from requests.models import requote_uri
app = Flask(__name__)

def myFunc(obj):
    if obj.photo == None:
        return False
    else :
        return True

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

    real_name=soup.find_all('a',class_='StyledComponents__ActorName-y9ygcu-1 eyqFnv')
    photo=soup.find_all('div',class_='ipc-avatar ipc-avatar--base ipc-avatar--dynamic-width')
    movie_name=soup.find_all('span',class_='StyledComponents__CharacterNameWithoutAs-y9ygcu-5 iaZZDn')
    ans = []
    arr=[]
    img=[]
    for i in range(len(photo)):
        arr.append(photo[i].img)

    for i in range(len(photo)):
        if arr[i]!=None :
            img.append(arr[i]['src'])
        else:
            img.append(None)

    for i in range(len(real_name)):
        ans.append({'photo':img[i],'real_name':real_name[i].text,'movie_name':movie_name[i].text})  

    cast = []
    for i in ans:
        if i['photo'] != None:
            cast.append(i)

    data = {
        'imdb' : imdb,
        'time' : movieTime,
        'cast' : cast
    }

    return jsonify(data)

if __name__ == '__main__':
    app.run()
