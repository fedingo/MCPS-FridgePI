
import requests


def send(ip, dev):
        url = 'http://'+str(ip)+'/sendImage'
        files = {'image': open('image.jpg', 'rb'), 'device': dev}
        requests.post(url, files=files)





 
