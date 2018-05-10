

import router
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json

def findRecipes(username, password, max_results):


    fields = {"username":username, "password":password}

    available = router.fetchStorage(fields)
    ingredients = []

    for shelf in available:
        ingredients += shelf['list']

    ingred_params = ""

    for item in ingredients:
        ingred_params += item + ","

    ingred = ingred_params[:-1]

    host = "http://food2fork.com/api/search"
    api_key = "42fdbda9d0108cfcc9793dcc8051cd7f"

    post_fields = { "key": api_key,
                    "q" : ingred,
    }
    request = Request(host, urlencode(post_fields).encode(), headers={'User-Agent': 'Mozilla/5.0'})
    response = urlopen(request).read().decode()

    return json.loads(response)['recipes'][0:max_results]
