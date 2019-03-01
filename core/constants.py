from typing import Union


class Size:
    TINY, SMALL, MEDIUM, LARGE, HUGE, GARGANTUAN, COLOSSAL = 1, 2, 3, 4, 5, 6, 7
    MODEL_CHOICES = [
        (TINY, 'Tiny'), (SMALL, 'Small'), (MEDIUM, 'Medium'), (LARGE, 'Large'), (HUGE, 'Huge'),
        (GARGANTUAN, 'Gargantuan'), (COLOSSAL, 'Colossal'),
    ]


class Alignment:
    UNALIGNED = 0
    LAWFUL_GOOD, NEUTRAL_GOOD, CHAOTIC_GOOD = 1, 2, 3
    LAWFUL_NEUTRAL, NEUTRAL, CHAOTIC_NEUTRAL = 4, 5, 6
    LAWFUL_EVIL, NEUTRAL_EVIL, CHAOTIC_EVIL = 7, 8, 9

    MODEL_CHOICES = [
        (LAWFUL_GOOD, 'lawful good'), (NEUTRAL_GOOD, 'neutral good'), (CHAOTIC_GOOD, 'chaotic good'),
        (LAWFUL_NEUTRAL, 'lawful neutral'), (NEUTRAL, 'neutral'), (CHAOTIC_NEUTRAL, 'chaotic neutral'),
        (LAWFUL_EVIL, 'lawful evil'), (NEUTRAL_EVIL, 'neutral evil'), (CHAOTIC_EVIL, 'chaotic evil'),
        (UNALIGNED, 'unaligned')
    ]


class Die:
    d2 = 2
    d4 = 4
    d6 = 6
    d8 = 8
    d10 = 10
    d12 = 12
    d20 = 20
    d100 = 100
    MODEL_CHOICES = [
        (d4, 'd4'),
        (d6, 'd6'),
        (d8, 'd8'),
        (d10, 'd10'),
        (d12, 'd12'),
        (d20, 'd20'),
        (d100, 'd100'),
    ]

    @staticmethod
    def expected_value(die_size: Union[int, str], num=1):
        if type(die_size) == str:
            die_size = int(die_size.split('d')[-1])
        return int((num * ((die_size + 1) / 2.0)) // 1)
