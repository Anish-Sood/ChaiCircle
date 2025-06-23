import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from mongoengine import connect
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
mongo_uri = os.getenv("MONGO_URI")

jwt = JWTManager(app)
connect(host=mongo_uri, alias='default')


from routes.auth import auth_bp
from routes.posts import posts_bp
from routes.users import users_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(posts_bp, url_prefix='/api')
app.register_blueprint(users_bp, url_prefix='/api/users')

@app.route('/')
def index():
    return "backend running!"

if __name__ == "__main__":
    app.run(debug=True)