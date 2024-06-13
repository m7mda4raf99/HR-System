# HR System
## Project Setup - Django (Windows)

**Clone the Repository**
   ``` bash
   git clone https://github.com/m7mda4raf99/HR-System
   cd backend
   ```
### Running locally
1. Install virtualenv package with
``` bash
pip install virtualenv
```
2. Create and activate a virtual environment
``` bash
python -m venv env
./env/Scripts/activate
```
3. Install packages with
``` bash
pip install -r requirements.txt
```
4. Start the server
```
python manage.py runserver
```

### API Endpoints

The API documentation is available [here](https://documenter.getpostman.com/view/13334663/2sA3XPDNnD).

#### Employee Endpoints

- Login: POST /login
- Get all employees: GET /get-employees
- Add a new employee: POST /add-employee
- Edit employee: PUT /edit-employee/:id
- Get employee's attendances: GET /get-employee-attendances/:id
- Add a new employee attendance: POST /add-attendance



## Project Setup - AngularJS (Windows)

**Clone the Repository**
   ``` bash
   git clone https://github.com/m7mda4raf99/HR-System
   cd frontend
   ```
### Running locally
1. Install packages with
``` bash
npm install --force
```
2. Start the server
```
ng serve
```
3. Login with these credentials
- email: 
```
admin@admin.com
```
- password:
```
admin
```
