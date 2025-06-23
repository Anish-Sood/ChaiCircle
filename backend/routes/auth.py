from flask import Blueprint, request, jsonify
from models import User
import bcrypt
from flask_jwt_extended import create_access_token
from mongoengine.errors import NotUniqueError

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({"msg": "Name, email, and password are required"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        user = User(
            email=email,
            password=hashed_password.decode('utf-8'),
            name=name,
            bio=data.get('bio', ''),
            profile_picture=data.get('profilePicture', '')
        )
        user.save()
    except NotUniqueError:
        return jsonify({"msg": "Email already exists"}), 409
    except Exception as e:
        return jsonify({"msg": "An error occurred", "error": str(e)}), 500

    return jsonify({"msg": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    user = User.objects(email=email).first()

    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token), 200

    return jsonify({"msg": "Bad email or password"}), 401