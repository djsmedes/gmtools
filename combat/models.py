from random import randint
from django.db import models
from django.conf import settings

from core.models import CampaignOwnedModel, UserOwnedModel
from core.constants import Size, Alignment, Die


class Combatant(CampaignOwnedModel):
    name = models.CharField(max_length=31)

    initiative = models.IntegerField(null=True, blank=True)
    initiative_bonus = models.IntegerField(default=0, blank=True)
    hp = models.IntegerField(null=True, blank=True)
    max_hp = models.IntegerField(null=True, blank=True)
    temp_hp = models.IntegerField(default=0, blank=True)

    loot = models.TextField(null=True, blank=True)
    buffs = models.TextField(null=True, blank=True)
    debuffs = models.TextField(null=True, blank=True)
    others = models.TextField(null=True, blank=True)

    encounter = models.ForeignKey(
        'plot.Encounter',
        on_delete=models.CASCADE,
        null=True, blank=True,
    )

    player_editors = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="editable_combatants"
    )

    statblock = models.ForeignKey(
        'combat.Statblock',
        on_delete=models.SET_NULL,
        null=True
    )

    def __str__(self):
        return self.name


class GMScreenTab(UserOwnedModel):
    title = models.CharField(max_length=31)
    content = models.TextField()
    order = models.IntegerField(null=True, blank=True)


class Statblock(CampaignOwnedModel):
    name = models.CharField(max_length=255, default="", blank=True)
    _generic_name = models.CharField(max_length=255, db_column='generic_name', null=True, blank=True)
    proficiency = models.PositiveSmallIntegerField(null=True, blank=True)
    challenge = models.CharField(
        max_length=3,
        choices=[
            '0', '1/8', '1/4', '1/2'
        ].extend([f'{num!s}' for num in range(1, 31)]),
        null=True, blank=True
    )

    size = models.PositiveSmallIntegerField(choices=Size.MODEL_CHOICES, null=True, blank=True)
    type = models.CharField(max_length=255, null=True, blank=True)
    alignment = models.PositiveSmallIntegerField(choices=Alignment.MODEL_CHOICES, null=True, blank=True)
    armor_class = models.PositiveSmallIntegerField(null=True, blank=True)
    armor_kind = models.CharField(max_length=255, null=True, blank=True)

    hit_points = models.PositiveSmallIntegerField(null=True, blank=True)
    num_hit_die = models.PositiveSmallIntegerField(default=1, blank=True)
    speed = models.CharField(max_length=100, null=True, blank=True)

    str = models.PositiveSmallIntegerField(default=0, blank=True)
    dex = models.PositiveSmallIntegerField(default=0, blank=True)
    con = models.PositiveSmallIntegerField(default=0, blank=True)
    int = models.PositiveSmallIntegerField(default=0, blank=True)
    wis = models.PositiveSmallIntegerField(default=0, blank=True)
    cha = models.PositiveSmallIntegerField(default=0, blank=True)

    @property
    def hit_die_size(self):
        size_die_crosswalk = {1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 20}
        return size_die_crosswalk.get(self.size)

    @property
    def str_mod(self):
        return (self.str - 10) // 2

    @property
    def dex_mod(self):
        return (self.dex - 10) // 2

    @property
    def con_mod(self):
        return (self.con - 10) // 2

    @property
    def int_mod(self):
        return (self.int - 10) // 2

    @property
    def wis_mod(self):
        return (self.wis - 10) // 2

    @property
    def cha_mod(self):
        return (self.cha - 10) // 2

    saving_throws = models.CharField(max_length=50, null=True, blank=True)
    skills = models.CharField(max_length=255, null=True, blank=True)
    senses = models.CharField(max_length=255, null=True, blank=True)

    damage_vulnerabilities = models.TextField(null=True, blank=True)
    damage_resistances = models.TextField(null=True, blank=True)
    damage_immunities = models.TextField(null=True, blank=True)
    condition_immunities = models.TextField(null=True, blank=True)
    languages = models.TextField(null=True, blank=True)

    def get_rolled_hp(self):
        return sum(
            max(randint(1, (self.hit_die_size or 0)) + self.con_mod, 1)
            for _ in range((self.num_hit_die or 0))
        )

    @property
    def avg_hp(self):
        con_mod_piece = self.num_hit_die * self.con_mod
        hit_die_piece = Die.expected_value(self.hit_die_size, self.num_hit_die)
        return max(int(con_mod_piece + hit_die_piece), 1)

    @property
    def generic_name(self):
        return self._generic_name or self.name.lower()

    @generic_name.setter
    def generic_name(self, value):
        self._generic_name = value

    def __str__(self):
        return self.name


class CreatureProp(CampaignOwnedModel):
    ABILITY_SCORE_CHOICES = [(x, x) for x in ['str', 'dex', 'con', 'int', 'wis', 'cha']]

    statblock_set = models.ManyToManyField(
        'combat.Statblock',
        through='combat.StatblockProp',
        blank=True,
    )

    title = models.TextField()
    description = models.TextField(null=True, blank=True)
    save_dc_override = models.PositiveSmallIntegerField(null=True, blank=True)
    save_source_ability = models.CharField(max_length=3, choices=ABILITY_SCORE_CHOICES, null=True, blank=True)
    save_ability = models.CharField(max_length=3, choices=ABILITY_SCORE_CHOICES, null=True, blank=True)

    PROPERTY = 1
    ACTION = 2
    LEGENDARY_ACTION = 3
    REACTION = 4
    PROP_TYPE_CHOICES = [
        (PROPERTY, 'creature property'),
        (ACTION, 'action'),
        (LEGENDARY_ACTION, 'legendary action'),
        (REACTION, 'reaction'),
    ]

    prop_type = models.PositiveSmallIntegerField(choices=PROP_TYPE_CHOICES, default=ACTION, blank=True)

    # attack fields (should all allow null since many props won't use them) #
    MELEE_WEAPON_ATTACK = 1
    RANGED_WEAPON_ATTACK = 2
    MELEE_SPELL_ATTACK = 3
    RANGED_SPELL_ATTACK = 4
    ATTACK_TYPE_CHOICES = [
        (MELEE_WEAPON_ATTACK, 'melee weapon attack'),
        (RANGED_WEAPON_ATTACK, 'ranged weapon attack'),
        (MELEE_SPELL_ATTACK, 'melee spell attack'),
        (RANGED_SPELL_ATTACK, 'ranged spell attack'),
    ]

    attack_type = models.PositiveSmallIntegerField(choices=ATTACK_TYPE_CHOICES, null=True, blank=True)
    uses_ability_mod = models.CharField(
        max_length=3,
        choices=ABILITY_SCORE_CHOICES,
        null=True, blank=True
    )
    tohit_bonus_override = models.PositiveSmallIntegerField(null=True, blank=True)
    reach_range = models.PositiveSmallIntegerField(null=True, blank=True)
    range_second = models.PositiveSmallIntegerField(null=True, blank=True)
    num_targets = models.PositiveSmallIntegerField(null=True, blank=True)

    hit_num_damage_dice = models.PositiveSmallIntegerField(null=True, blank=True)
    hit_die_size = models.PositiveSmallIntegerField(null=True, blank=True)
    hit_damage_type = models.TextField(null=True, blank=True)

    hit_extra_damage_dice = models.PositiveSmallIntegerField(null=True, blank=True)
    hit_extra_damage_die_size = models.PositiveSmallIntegerField(null=True, blank=True)
    hit_extra_damage_type = models.TextField(null=True, blank=True)
    # end attack fields #

    def __str__(self):
        return f"{self.title} ({self.uuid})"


class StatblockProp(CampaignOwnedModel):
    creature_prop = models.ForeignKey(
        'combat.CreatureProp',
        on_delete=models.CASCADE
    )
    statblock = models.ForeignKey(
        'combat.Statblock',
        on_delete=models.CASCADE
    )
    manual_ordering = models.SmallIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.creature_prop.title} of {self.statblock.name}"
