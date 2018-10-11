from channels.generic.websocket import WebsocketConsumer
import json
from rest_framework.renderers import JSONRenderer

from .models import Combatant
from .serializers import CombatantNoRequestSerializer


class CombatConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope.get('user')
        if user is None or not user.is_authenticated:
            return

        self.accept()
        combatants_pre_json = CombatantNoRequestSerializer(
            many=True,
            instance=Combatant.objects.of_user(user)
        ).data

        self.send(text_data=JSONRenderer().render({
            'combatants': combatants_pre_json
        }).decode())

    def disconnect(self, code):
        pass

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        combatants = text_data_json['combatants']

        for combatant in combatants:
            instance = Combatant.objects.get(uuid=combatant.get('uuid'))
            ser = CombatantNoRequestSerializer(instance=instance, data=combatant, partial=True)
            if ser.is_valid():
                ser.save()
