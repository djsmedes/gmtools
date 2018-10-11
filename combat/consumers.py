from channels.generic.websocket import WebsocketConsumer
import json


class CombatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(self.scope['user'])
        self.send(text_data=json.dumps({
            'message': 'Connection established.'
        }))

    def disconnect(self, code):
        pass

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        self.send(text_data=json.dumps({
            'message': message + '\nThis is the reply.'
        }))
