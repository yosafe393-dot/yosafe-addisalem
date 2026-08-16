Django REST Framework Backend (Python 3.11 / PostgreSQL)
University of Gondar Legal Affairs Management System (UoG-LAMS)
===============================================================

This folder contains the complete, ready-to-run Django REST Framework backend codebase.

Folder Structure:
-----------------
backend/
├── manage.py
├── requirements.txt
├── config/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── legal_affairs/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── serializers.py
    ├── views.py
    ├── permissions.py
    └── urls.py

How to Run Locally:
-------------------
1. cd backend
2. python -m venv venv
3. source venv/bin/activate  (or `venv\Scripts\activate` on Windows)
4. pip install -r requirements.txt
5. python manage.py migrate
6. python manage.py runserver 0.0.0.0:8000
