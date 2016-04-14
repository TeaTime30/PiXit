import os
from app import app, mysql, login_manager
from flask import Flask, abort, request, jsonify, g, url_for, render_template, redirect, flash
from .forms import SignUpForm, LoginForm, IngredientForm, RecipeForm
from .models import User
from flask.ext.login import login_user, current_user, logout_user, login_required

@app.route('/')
def home():
    return render_template("home.html")


@app.route('/signup' ,methods=['GET' , 'POST'])
def signup():
    form = SignUpForm(csrf_enabled=False)
    choices = [(str(x),x) for x in reversed(range(1900,2004))]
    form.year_of_birth.choices = choices
    if request.method == 'POST': 
        if form.validate_on_submit():
            email = form.email.data
            password = form.password.data
            firstname = form.firstname.data
            lastname = form.lastname.data
            year_of_birth = form.year_of_birth.data
            try:
                cur = mysql.cursor()
                cur.execute('''insert into users values ('%s', '%s', '%s','%s', %d)''' % (email , password,firstname, lastname, int(year_of_birth)))
                mysql.commit()
                user = User(email, password, firstname, lastname, year_of_birth)
                login_user(user)
                return redirect(url_for('add_ingredient'))
            except Exception as e:
                flash(str(e))
                return render_template('signup.html', form=form)
        else:
            flash('Error signing up')
            render_template('signup.html' , form=form)
    else:
        return render_template('signup.html', form=form)

@app.route('/login' , methods=['GET' , 'POST'])
def login():
    form = LoginForm(csrf_enabled=False)
    if request.method == 'POST':
        if form.validate_on_submit():
            email = form.email.data
            password = form.password.data
            try:
                cursor = mysql.cursor()
                cursor.execute('''select * from users where email="%s" and password="%s"''' % (email , password))
                result = cursor.fetchall()
                if not result:
                     flash('Invalid login credentials')
                     return render_template('login.html', form=form)
                else:
                    user = User(result[0][0], result[0][1], result[0][2], result[0][3], result[0][4])
                    login_user(user)
                    return 'LoggedIn'
            except Exception as e:
                return str(e)
        else:
           return render_template('login.html' , form=form)
    else:
        return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return 'Logged Out'

@app.route('/add_ingredient', methods=['GET' , 'POST'])
@login_required
def add_ingredient():
    form = IngredientForm(csrf_enabled=False)
    cursor = mysql.cursor()
    cursor.execute('''select unit_name from units''')
    units = cursor.fetchall()
    choices = [(unit[0], unit[0].capitalize()) for unit in units]
    form.unit_name.choices = choices
    if request.method == 'POST':
        if form.validate_on_submit():
            product_name = form.product_name.data
            calories_per_unit = form.calories_per_unit.data
            stock = form.stock.data
            cost = form.cost.data
            unit_name = form.unit_name.data
            email = current_user.email
            try:
                cursor.execute('''insert into ingredients (product_name, unit_name, email, calories_per_unit, stock, cost) values ("%s", "%s", "%s", %d, %d, %0.2f)''' % (product_name, unit_name, email, calories_per_unit, stock, cost))
                mysql.commit()
                return 'Added'
            except Exception as e:
                flash(str(e))
                return render_template('add_ingredient.html', form=form)
        else:
            flash('Error adding ingredient')
            return render_template('add_ingredient.html', form=form)
    else:
        return render_template('add_ingredient.html', form=form)

@app.route('/kitchen')
@login_required
def kitchen():
    cursor = mysql.cursor()
    cursor.execute('''select product_name, calories_per_unit, stock from ingredients where email="%s"''' % (current_user.email))
    result = cursor.fetchall()
    ingredients = []
    if result:
        ingredients = [{'product_name': ingredient[0], 'calories': ingredient[1], 'stock': ingredient[2]} for ingredient in result]
    return render_template('kitchen.html', ingredients=ingredients)

@app.route('/add_recipe', methods=['GET' , 'POST'])
@login_required
def add_recipie():
    form = RecipeForm()
    if request.method == 'GET':
        cursor = mysql.cursor()
        cursor.execute('''select ingredients_id, product_name from ingredients where email="%s"''' % (current_user.email))
        results = cursor.fetchall()
        choices = [(ingredient[0], ingredient[1].capitalize()) for ingredient in results]
        form.ingredients.choices = choices
        return render_template('add_recipe.html', form=form)   
    else:
        cursor = mysql.cursor()
        recipe_name = form.recipe_name.data
        calories = form.calories.data
        image = form.image.data
        filename = image.filename
        image.save(os.path.join('app/static/images', filename))
        url = 'app/static/images/%s' % (filename)
        steps = form.instructions.data
        instruction1 = steps[0]['instruction1']
        instruction2 = steps[0]['instruction2']
        instruction3 = steps[0]['instruction3']
        instruction4 = steps[0]['instruction4']

        cursor.execute('''insert into recipes (email, recipe_name, calories, image_url) values ("%s", "%s", %d, "%s")''' % (current_user.email, recipe_name, calories, url))
        cursor.execute('''insert into instructions (recipe_id, order_of_action, action) values (LAST_INSERT_ID(), 1, "%s")''' % instruction1)
        cursor.execute('''insert into instructions (recipe_id, order_of_action, action) values (LAST_INSERT_ID(), 2, "%s")''' % instruction2)
        cursor.execute('''insert into instructions (recipe_id, order_of_action, action) values (LAST_INSERT_ID(), 3, "%s")''' % instruction3)
        cursor.execute('''insert into instructions (recipe_id, order_of_action, action) values (LAST_INSERT_ID(), 4, "%s")''' % instruction4)
        mysql.commit()
        
        return 'works'


@app.route('/add_recipe' , methods=['POST'])
@login_required
def set_units():
    return 'Hello'


@login_manager.user_loader
def load_user(email):
    try:
        cursor = mysql.cursor()
        cursor.execute('''select * from users where email="%s"''' % (email))
        result = cursor.fetchall()
        if not result:
            return None
        user = User(result[0][0], result[0][1], result[0][2], result[0][3], result[0][4])
        return user
    except Exception as e:
        print str(e)
        return None
