from django.apps import AppConfig


class GatehouseConfig(AppConfig):
    name = "gatehouse"

    def ready(self):
        from gatehouse import signals  # noqa: F401  connects the receivers
