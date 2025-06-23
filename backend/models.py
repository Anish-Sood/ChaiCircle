from mongoengine import Document, StringField, IntField, DateTimeField, ReferenceField, EmailField
from datetime import datetime

class User(Document):
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    name = StringField(required=True, max_length=50)
    profile_picture = StringField() 
    bio = StringField(max_length=500)
    created_at = DateTimeField(default=datetime.utcnow)

class Post(Document):
    author = ReferenceField(User, required=True)
    content = StringField(required=True)
    image = StringField()
    likes = IntField(default=0)
    created_at = DateTimeField(default=datetime.utcnow)