from django.apps import AppConfig


class PlotConfig(AppConfig):
    name = 'plot'

    def ready(self):
        import plot.rules
