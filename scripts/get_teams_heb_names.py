import requests
import json
from time import sleep

def get_heb_name(team_id):
    url = f"https://webws.365scores.com/web/competitors/?appTypeId=5&langId=2&timezoneName=Asia/Jerusalem&userCountryId=6&competitors={team_id}&withSeasons=true"
    response = requests.get(url)
    data = response.json()
    print(data)
    return data["competitors"][0]["name"]

def get_names(team_ids):
    res = {}
    for team in team_ids:
        name = get_heb_name(team)
        print(f"Got: {name}")
        res[team] = name
    with open('heb_names.json', 'w') as f:
        f.write(json.dumps(res))


teams = [
    331,
    1824,
    945,
    105,
    104,
    725,
    481,
    135,
    392,
    131,
    895,
    234,
    224,
    1739,
    154,
    888,
    134,
    754,
    691,
    236,
    227,
    341,
    116,
    480,
    1139,
    8957,
    110,
    7171,
    132,
    887,
    1191,
    1955,
]

get_names(teams)