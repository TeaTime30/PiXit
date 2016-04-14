from flask import Flask
import MySQLdb
from flask.ext.login import LoginManager

HOST = 'localhost'
USER = 'root'
PASSWORD = ''
DATABASE = 'meal_plan'

app = Flask(__name__)
app.config['SECRET_KEY'] = 'THIS IS THE BEST KEY I EVER HAD'
mysql = MySQLdb.connect(HOST, USER, PASSWORD ,DATABASE)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = 'strong'
login_manager.login_view = "login"

import views
