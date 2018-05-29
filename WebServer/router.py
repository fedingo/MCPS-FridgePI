
import MongoDBConnector as mdbc
import ImageRec as ir
import skimage.io
import numpy as np
import TensorRetrained as tr
import Recipes_Finder as rf
from PIL import Image, ImageFilter, ImageEnhance

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

    blurred_image = fields['image'].filter(ImageFilter.GaussianBlur(radius=3))
    enhancer = ImageEnhance.Brightness(blurred_image)
    blurred_image = enhancer.enhance(2)
    blurred_image = np.array(blurred_image)
    image = np.array(fields['image'])

    recognizer = ir.ImageRec()

    result = recognizer.recognize(blurred_image)
    arrayData = result['objects']
    array = []

    for (border,label) in zip(result['rois'],result['objects']):

        sizes = image.shape

        print (label)
        top = border[0]
        bottom = border[2]
        left = border[1]
        right = border[3]
        subimage = image[top:bottom,left:right]

        (label, prob) = tr.analyse_image(subimage)
        print(label)

        array.append(label)

    connector.updateStorage(shelf, array)

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
