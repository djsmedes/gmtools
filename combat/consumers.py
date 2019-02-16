import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from rest_framework.renderers import JSONRenderer

from accounts.models import Campaign
from accounts.serializers import CampaignSerializer
from .models import Combatant
from .serializers import CombatantSerializer


class CombatConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope.get('user')
        if user is None or not user.is_authenticated:
            return

        self.channel_group_name = f'{user.current_campaign.uuid}_combat'

        async_to_sync(self.channel_layer.group_add)(
            self.channel_group_name,
            self.channel_name
        )

        ser = CombatantSerializer(
            many=True,
            instance=Combatant.objects.of_user(user),
            user=user
        )

        self.accept()

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
        data = {}

        combatants = self.update_combatants(data_to_update)
        if combatants:
            data['combatants'] = combatants
        campaign = self.update_campaign(data_to_update)
        if campaign:
            data['campaign'] = campaign

        async_to_sync(self.channel_layer.group_send)(
            self.channel_group_name,
            {
                'type': 'data_update',
                'text_data': JSONRenderer().render({
                    'type': 'update',
                    'replyTo': msg_id,
                    'status': 200,
                    'data': data
                }).decode()
            }
        )

    def data_update(self, event):
        text_data = event.get('text_data')
        if text_data is None:
            return

        self.send(text_data=text_data)

    def update_combatants(self, data_to_update):
        combatants = []
        failed_combatants = []
        for combatant in data_to_update.get('combatants', []):
            instance = Combatant.objects.get(uuid=combatant.get('uuid'))
            ser = CombatantSerializer(
                instance=instance,
                data=combatant,
                partial=True,
                user=self.scope.get('user')
            )
            if ser.is_valid():
                ser.save()
                combatants.append(ser.data)
            else:
                failed_combatants.append(instance.uuid)
        return combatants

    def update_campaign(self, data_to_update):
        campaign = data_to_update.get('campaign')
        if campaign:
            instance = Campaign.objects.get(uuid=campaign.get('uuid'))
            ser = CampaignSerializer(
                instance=instance,
                data=campaign,
                partial=True,
                user=self.scope.get('user')
            )
            if ser.is_valid():
                ser.save()
                return ser.data
