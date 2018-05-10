

import pymongo

class MongoDBConnector:

    host_uri = 'mongodb://server_user:12345678@ds115740.mlab.com:15740/users'
    userID = '' # Autentication UserID

    def __init__ (self):

        self.client = pymongo.MongoClient(self.host_uri)
        self.database = self.client.users


    def createUser (self, userID, password):

        collection = self.database.UsersData
        check_user = collection.find_one({"userID": userID})

        if check_user is None:
            dataToInsert = {"userID" : userID,
                            "password" : password}
            result = collection.insert_one(dataToInsert)
            return True

        raise ValueError(400,"Username not available!")

    def autenticate (self, userID, password):

        collection = self.database.UsersData
        user = collection.find_one({"userID": userID,"password": password})

        if user is not None:
            self.userID = userID
            return True

        raise ValueError(401,"Wrong username or password!")

    def fetchStorage (self):

        if self.userID == '':
            raise ValueError(401, "Missing Autentication")

        collection = self.database.UserStorage
        cursorStorage = collection.find({"userID": self.userID})
        userStorage = []

        for doc in cursorStorage:
            obj = {}
            obj['name'] = doc['shelf']
            obj['list'] = doc['list']
            userStorage.append(obj)

        return userStorage

    def updateStorage (self, shelf, itemList):

        if self.userID == '':
            raise ValueError(401, "Missing Autentication")

        collection = self.database.UserStorage
        userStorage = collection.find_one({"userID": self.userID,
                                            "shelf": shelf})

        if userStorage is None:
            userStorage = {"userID" : self.userID}
            userStorage['shelf'] = shelf
            userStorage['list'] = itemList
            collection.insert_one(userStorage)
        else:
            userStorage['list'] = itemList
            collection.update({"userID" : self.userID, "shelf": shelf}, userStorage)

    def getUserFromDevice (self, deviceID):

        collection = self.database.DeviceMapping
        userData = collection.find_one({"deviceID": deviceID})

        self.userID = userData['userID']

        return userData

    def addDevice (self, userID, password, shelfName, deviceID):

        self.autenticate(userID, password)

        collection = self.database.DeviceMapping

        checkDevice = collection.find_one({"deviceID": deviceID})
        if checkDevice is not None:
            raise ValueError(400, "DeviceID has already been assigned")

        checkUser = collection.find_one({"userID": userID,
                                         "shelfName": shelfName})
        if checkUser is not None:
            raise ValueError(400, "Shelf Name has already been used")

        dataToInsert = {"deviceID": deviceID,
                        "shelfName": shelfName,
                        "userID" : userID}
        result = collection.insert_one(dataToInsert)
