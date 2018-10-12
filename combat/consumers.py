import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from rest_framework.renderers import JSONRenderer

from .models import Combatant
from .serializers import CombatantNoRequestSerializer


class CombatConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope.get('user')
        if user is None or not user.is_authenticated:
            return

        self.channel_group_name = f'{user.current_campaign.uuid}_combat'

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.channel_group_name,
            self.channel_name
        )

        ser = CombatantNoRequestSerializer(
            many=True,
            instance=Combatant.objects.of_user(user)
        )

        self.accept()
        self.respond(type='update', data={'combatants': ser.data})

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.channel_group_name,
            self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None):
        msg = json.loads(text_data)
        msg_id, msg_type, msg_data = msg.get('id'), msg.get('type'), msg.get('data')

        if msg_type == 'update':
            self.update(msg_id, msg_data)
        else:
            self.respond(type=msg_type, reply_to=msg_id, status=400)

    def respond(self, type=None, reply_to=None, status=200, data=None):
        if data is None:
            data = {}
        self.send(text_data=JSONRenderer().render({
            'type': type,
            'replyTo': reply_to,
            'status': status,
            'data': data
        }).decode())

    def update(self, msg_id, data_to_update):
        combatants = data_to_update.get('combatants', [])
        updated_combatants = []

        for combatant in combatants:
            instance = Combatant.objects.get(uuid=combatant.get('uuid'))
            ser = CombatantNoRequestSerializer(instance=instance, data=combatant, partial=True)
            if ser.is_valid():
                ser.save()
                updated_combatants.append(ser.data)
            else:
                self.respond(type="err", reply_to=msg_id, status=400, data={
                    'combatants': updated_combatants
                })
                return

        async_to_sync(self.channel_layer.group_send)(
            self.channel_group_name,
            {
                'type': 'combatants_update',
                'message': JSONRenderer().render({
                    'type': 'update',
                    'replyTo': msg_id,
                    'status': 200,
                    'data': {'combatants': updated_combatants}
                }).decode()
            }
        )

    def combatants_update(self, event):
        message = event.get('message')
        if message is None:
            return

        self.send(text_data=message)
