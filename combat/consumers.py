import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from rest_framework.renderers import JSONRenderer

from accounts.models import Campaign
from accounts.serializers import CampaignSerializer
from .models import Combatant
from .serializers import CombatantSerializer


ACTION = "SOCKET_DATA"


class CombatConsumer(WebsocketConsumer):
    allowed_verbs = ['PUT']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.channel_group_name = None

    def connect(self):
        user = self.scope.get('user')
        if user is None or not user.is_authenticated:
            return

        if user.current_campaign is not None:
            self.join_channel_group(f'{user.current_campaign.uuid}')

        self.accept()

    def leave_channel_group(self):
        if self.channel_group_name is not None:
            async_to_sync(self.channel_layer.group_discard)(
                self.channel_group_name,
                self.channel_name
            )
        self.channel_group_name = None

    def join_channel_group(self, channel_group_name):
        self.leave_channel_group()
        self.channel_group_name = channel_group_name
        async_to_sync(self.channel_layer.group_add)(
            self.channel_group_name,
            self.channel_name
        )

    def disconnect(self, code):
        self.leave_channel_group()

    def receive(self, text_data=None, bytes_data=None):
        msg = json.loads(text_data)
        msg_id = msg.get('id')
        msg_verb: str = msg.get('verb')
        msg_data: dict = msg.get('data', {})

        if msg_verb in self.allowed_verbs:
            getattr(self, msg_verb.lower())(msg_id, msg_data)
        elif msg_verb == 'join_campaign_group':
            user = self.scope.get('user')
            if user and user.current_campaign:
                self.join_channel_group(f'{user.current_campaign.uuid}')
        else:
            self.respond(reply_to=msg_id, status=405)

    def get(self, msg_id, msg_data):
        successful_gets = {}
        for namespace in msg_data:
            uuids = msg_data.get(namespace, [])
            model_class = self.KEY_2_MODEL_CLASS[namespace]
            serializer_class = self.KEY_2_SERIALIZER_CLASS[namespace]
            qs = model_class.objects.of_user(self.scope.get('user')).filter(uuid__in=uuids)
            ser = serializer_class(
                many=True,
                instance=qs,
                user=self.scope.get('user')
            )
            successful_gets[namespace] = ser.data
        self.respond(reply_to=msg_id, data=successful_gets)

    def put(self, msg_id, msg_data):
        if len(msg_data) > 1:
            print(
                'Websocket will send multiple replies to one request. '
                'Unexpected behavior may occur.'
            )
        for namespace in msg_data:
            self.update_model(msg_id, namespace, msg_data.get(namespace, []))

    def respond(self, reply_to=None, status=200, data=None):
        if data is None:
            data = {}
        self.send(text_data=JSONRenderer().render({
            'replyTo': reply_to,
            'status': status,
            'data': data
        }).decode())

    KEY_2_MODEL_CLASS = {
        'combatant': Combatant,
        'campaign': Campaign,
    }
    KEY_2_SERIALIZER_CLASS = {
        'combatant': CombatantSerializer,
        'campaign': CampaignSerializer,
    }

    def update_model(self, msg_id: str, model_namespace: str, data: list):
        successful_data = []
        model_class = self.KEY_2_MODEL_CLASS[model_namespace]
        serializer_class = self.KEY_2_SERIALIZER_CLASS[model_namespace]

        for obj in data:
            try:
                instance = model_class.objects.of_user(self.scope.get('user')).get(uuid=obj.get('uuid'))
            except model_class.DoesNotExist:
                continue
            ser = serializer_class(
                instance=instance,
                data=obj,
                partial=True,
                user=self.scope.get('user')
            )
            if ser.is_valid():
                ser.save()
                successful_data.append(ser.data)

        async_to_sync(self.channel_layer.group_send)(
            self.channel_group_name,
            {
                'type': 'data_update',
                'text_data': JSONRenderer().render({
                    'replyTo': msg_id,
                    'status': 200,
                    'data': successful_data,
                    'action': ACTION,
                    'namespace': model_namespace
                }).decode()
            }
        )

    def data_update(self, event):
        text_data = event.get('text_data')
        if text_data is None:
            return

        self.send(text_data=text_data)
