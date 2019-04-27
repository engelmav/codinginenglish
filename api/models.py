from peewee import *


db = MySQLDatabase("cie",
                       host="localhost",
                       port=3306,
                       user="appuser",
                       password="appuser")


class User(Model):
    first_name = CharField()
    last_name = CharField()
    google_sub_id = BigIntegerField(default=0)
    created_date = DateTimeField()

    class Meta:
        database = db
