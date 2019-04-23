from peewee import *


cie_db = SqliteDatabase('coding_in_english.db')


class User(Model):
    first_name = CharField()
    last_name = CharField()
    google_sub_id = BigIntegerField(default=0)
    created_date = DateField()

    class Meta:
        database = cie_db

cie_db.create_tables([User])