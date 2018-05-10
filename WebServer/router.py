
import MongoDBConnector as mdbc
import ImageRec as ir
import skimage.io
import numpy as np
import TensorRetrained as tr
import Recipes_Finder as rf

def function1(fields):
    print("function 1 called")
    for (key,val) in fields.items():
        print (type(val))

def function2(fields):
    print("function 2 called")

def authenticate(fields):
    username = fields['username']
    password = fields['password']
    connector = mdbc.MongoDBConnector()
    connector.autenticate(username, password)
    return "OK"

def register(fields):
    username = fields['username']
    password = fields['password']
    connector = mdbc.MongoDBConnector()
    connector.createUser(username, password)
    return "OK"

def fetchStorage(fields):
    username = fields['username']
    password = fields['password']
    connector = mdbc.MongoDBConnector()
    connector.autenticate(username, password)
    arrayData = connector.fetchStorage()

    return arrayData

def sendImage(fields):

    deviceID = fields['device']
    connector = mdbc.MongoDBConnector()
    result = connector.getUserFromDevice(deviceID)

    shelf = result['shelfName']
    image = np.array(fields['image'])

    recognizer = ir.ImageRec()

    result = recognizer.recognize(image)
    arrayData = result['objects']

    for (border,label) in zip(result['rois'],result['objects']):

        sizes = image.shape

        print (label)
        top = border[0]
        if top-sizes[0]*0.1 >=0:
            top = int (top-sizes[0]*0.1)

        bottom = border[2]
        if bottom+sizes[0]*0.1 < sizes[0]:
            bottom = int(bottom+sizes[0]*0.1)

        left = border[1]
        if left-sizes[1]*0.1 >=0:
            left = int(left-sizes[1]*0.1)

        right = border[3]
        if right+sizes[1]*0.1 < sizes[1]:
            right = int(right+sizes[1]*0.1)


        subimage = image[top:bottom,left:right]

        print(tr.analyse_image(subimage))

    #tr.analyse_image(float_img)

    connector.updateStorage(shelf, arrayData)

    return "OK"

def connectDevice(fields):

    username = fields['username']
    password = fields['password']
    shelfName = fields['shelfName']
    deviceID = fields['deviceID']

    connector = mdbc.MongoDBConnector()
    connector.addDevice(username, password, shelfName, deviceID)

    return "OK"

def suggestRecipes(fields):

    username = fields['username']
    password = fields['password']
    if 'maxResults' in fields:
        max_results = int(fields['maxResults']) # max 30
    else:
        max_results = 5

    max_results = min(30, max_results)

    return rf.findRecipes(username,password,max_results)

def route_request (path, fields):

    # Here we define the mapping of the functions and the endpoints
    options = { 'function1': function1,
                'function2': function2,
                'authenticate' : authenticate,
                'register' : register,
                'fetchStorage' : fetchStorage,
                'sendImage' : sendImage,
                'connectDevice' : connectDevice,
                'suggestRecipes' : suggestRecipes,
              }

    if path not in options:
        if path == '':
            raise ValueError(400, "BadRequest: Path is empty")
        else:
            raise ValueError(400, "BadRequest: " + path + " is not available")

    return options[path](fields)
