from flask import Blueprint, request, jsonify
from models import User
from flask_jwt_extended import jwt_required, get_jwt_identity

users_bp = Blueprint('users', __name__)

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = User.objects.get(id=user_id)
    return jsonify({
        'id': str(user.id),
        'name': user.name,
        'email': user.email,
        'profilePicture': user.profile_picture,
        'bio': user.bio
    }), 200

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    user_id = get_jwt_identity()
    data = request.get_json()

    user = User.objects.get(id=user_id)
    user.name = data.get('name', user.name)
    user.profile_picture = data.get('profilePicture', user.profile_picture)
    user.bio = data.get('bio', user.bio)
    user.save()

    return jsonify({'message': 'Profile updated successfully'}), 200