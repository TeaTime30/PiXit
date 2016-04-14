class User():
    def __init__(self , email, password, firstname, lastname, year_of_birth):
        self.email = email
        self.password = password
        self.firstname = firstname
        self.lastname = lastname
        self.year_of_birth = year_of_birth

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.email)

