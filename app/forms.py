from flask.ext.wtf import Form
from wtforms import TextField, SelectField, PasswordField, IntegerField, FloatField, FieldList, FormField, SelectMultipleField

from flask_wtf.file import FileField

class SignUpForm(Form):
    email = TextField('email')
    firstname = TextField('firstname')
    lastname = TextField('lastname')
    password = PasswordField('password')
    year_of_birth = SelectField('year_of_birth')

    choices = [(str(x),x) for x in range(1950,2016)]
    year_of_birth.choices = choices

class LoginForm(Form):
    email = TextField('email')
    password = PasswordField('password')

class IngredientForm(Form):
    product_name = TextField('product_name')
    unit_name = SelectField('unit_name')
    calories_per_unit =  IntegerField('calories_per_unit')
    cost = FloatField('cost')
    stock = IntegerField('stock')


class InstructionForm(Form):
    instruction1=TextField('Step 1')
    instruction2=TextField('Step 2')
    instruction3=TextField('Step 3')
    instruction4=TextField('Step 4')

class RecipeForm(Form):
    recipe_name = TextField('recipe_name')
    calories = IntegerField('calories')
    instructions = FieldList(FormField(InstructionForm), min_entries=1)
    ingredients = SelectMultipleField('ingredients')
    image = FileField('Recipe Picture')
