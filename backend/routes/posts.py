from flask import Blueprint, request, jsonify
from models import Post, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from mongoengine.errors import DoesNotExist

posts_bp = Blueprint('posts', __name__)

@posts_bp.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    data = request.get_json()
    content = data.get('content')
    
    if not content:
        return jsonify({'error': 'Content is required'}), 400

    user = User.objects.get(id=user_id)
    post = Post(
        author=user,
        content=content,
        image=data.get('image')
    )
    post.save()
    return jsonify({'message': 'Post created successfully', 'post_id': str(post.id)}), 201

@posts_bp.route('/posts', methods=['GET'])
def get_posts():
    posts = Post.objects.order_by('-created_at')
    result = []
    for post in posts:
        result.append({
            '_id': str(post.id),
            'content': post.content,
            'image': post.image,
            'likes': post.likes,
            # Ensure proper UTC ISO format with 'Z' suffix
            'created_at': post.created_at.isoformat() + 'Z' if not post.created_at.isoformat().endswith('Z') else post.created_at.isoformat(),
            'author': {
                'id': str(post.author.id),  # Make sure this line is present
                'name': post.author.name,
                'profile_picture': post.author.profile_picture
            }
        })
    return jsonify(result), 200

@posts_bp.route('/posts/user/<user_id>', methods=['GET'])
def get_user_posts(user_id):
    try:
        user = User.objects.get(id=user_id)
        posts = Post.objects(author=user).order_by('-created_at')
        result = []
        for post in posts:
            result.append({
                '_id': str(post.id),
                'content': post.content,
                'image': post.image,
                'likes': post.likes,
                'created_at': post.created_at.isoformat() + 'Z' if not post.created_at.isoformat().endswith('Z') else post.created_at.isoformat(),
                'author': {
                    'id': str(post.author.id),
                    'name': post.author.name,
                    'profile_picture': post.author.profile_picture
                }
            })
        return jsonify(result), 200
    except DoesNotExist:
        return jsonify({'error': 'user not found'}), 404

@posts_bp.route('/posts/my-posts', methods=['GET'])
@jwt_required()
def get_my_posts():
    try:
        user_id = get_jwt_identity()
        user = User.objects.get(id=user_id)
        posts = Post.objects(author=user).order_by('-created_at')
        result = []
        for post in posts:
            result.append({
                '_id': str(post.id),
                'content': post.content,
                'image': post.image,
                'likes': post.likes,
                'created_at': post.created_at.isoformat() + 'Z' if not post.created_at.isoformat().endswith('Z') else post.created_at.isoformat(),
                'author': {
                    'id': str(post.author.id),
                    'name': post.author.name,
                    'profile_picture': post.author.profile_picture
                }
            })
        return jsonify(result), 200
    except DoesNotExist:
        return jsonify({'error': 'sser not found'}), 404

@posts_bp.route('/posts/<post_id>/like', methods=['POST'])
def like_post(post_id):
    try:
        post = Post.objects.get(id=post_id)
        post.update(inc__likes=1)
        post.reload()
        return jsonify({'message': 'post liked successfully', 'likes': post.likes}), 200
    except DoesNotExist:
        return jsonify({'error': 'post not found'}), 404

@posts_bp.route('/posts/<post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    try:
        user_id = get_jwt_identity()
        post = Post.objects.get(id=post_id)
        
        # Check if the current user is the author of the post
        if str(post.author.id) != user_id:
            return jsonify({'error': 'you can only delete your own posts'}), 403
        
        post.delete()
        return jsonify({'message': 'post deleted successfully'}), 200
    except DoesNotExist:
        return jsonify({'error': 'post not found'}), 404
    except Exception as e:
        return jsonify({'error': 'failed to delete post'}), 500