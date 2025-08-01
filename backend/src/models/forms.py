from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class PrayerRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)  # Can be null for anonymous requests
    email = db.Column(db.String(120), nullable=True)  # Can be null for anonymous requests
    request = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False, default='general')
    is_anonymous = db.Column(db.Boolean, default=False)
    language = db.Column(db.String(10), default='en')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_processed = db.Column(db.Boolean, default=False)
    admin_notes = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f'<PrayerRequest {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name if not self.is_anonymous else 'Anonymous',
            'email': self.email if not self.is_anonymous else None,
            'request': self.request,
            'category': self.category,
            'is_anonymous': self.is_anonymous,
            'language': self.language,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_processed': self.is_processed,
            'admin_notes': self.admin_notes
        }

class ContactSubmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(10), default='en')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_responded = db.Column(db.Boolean, default=False)
    admin_notes = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f'<ContactSubmission {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'subject': self.subject,
            'message': self.message,
            'language': self.language,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_responded': self.is_responded,
            'admin_notes': self.admin_notes
        }

