from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.forms import PrayerRequest, ContactSubmission
from src.services.email_service import EmailService
import re
from datetime import datetime

forms_bp = Blueprint('forms', __name__)
email_service = EmailService()

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_input(text):
    """Basic input sanitization"""
    if not text:
        return ""
    # Remove any potential HTML/script tags
    text = re.sub(r'<[^>]*>', '', str(text))
    # Limit length to prevent abuse
    return text[:5000]

@forms_bp.route('/prayer-request', methods=['POST'])
def submit_prayer_request():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        request_text = data.get('request', '').strip()
        if not request_text:
            return jsonify({'error': 'Prayer request text is required'}), 400
        
        is_anonymous = data.get('isAnonymous', False)
        name = data.get('name', '').strip() if not is_anonymous else None
        email = data.get('email', '').strip() if not is_anonymous else None
        
        # Validate non-anonymous submissions
        if not is_anonymous:
            if not name:
                return jsonify({'error': 'Name is required for non-anonymous requests'}), 400
            if not email:
                return jsonify({'error': 'Email is required for non-anonymous requests'}), 400
            if not validate_email(email):
                return jsonify({'error': 'Invalid email format'}), 400
        
        # Sanitize inputs
        request_text = sanitize_input(request_text)
        name = sanitize_input(name) if name else None
        category = sanitize_input(data.get('category', 'general'))
        language = data.get('language', 'en')
        
        # Create prayer request
        prayer_request = PrayerRequest(
            name=name,
            email=email,
            request=request_text,
            category=category,
            is_anonymous=is_anonymous,
            language=language
        )
        
        db.session.add(prayer_request)
        db.session.commit()
        
        # Send email notifications
        email_sent = email_service.send_prayer_request_notification(prayer_request)
        
        response_data = {
            'success': True,
            'message': 'Prayer request submitted successfully',
            'id': prayer_request.id
        }
        
        if not email_sent:
            response_data['warning'] = 'Prayer request saved but email notification failed'
        
        return jsonify(response_data), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@forms_bp.route('/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        if not name:
            return jsonify({'error': 'Name is required'}), 400
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        if not subject:
            return jsonify({'error': 'Subject is required'}), 400
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Sanitize inputs
        name = sanitize_input(name)
        subject = sanitize_input(subject)
        message = sanitize_input(message)
        language = data.get('language', 'en')
        
        # Create contact submission
        contact_submission = ContactSubmission(
            name=name,
            email=email,
            subject=subject,
            message=message,
            language=language
        )
        
        db.session.add(contact_submission)
        db.session.commit()
        
        # Send email notifications
        email_sent = email_service.send_contact_notification(contact_submission)
        
        response_data = {
            'success': True,
            'message': 'Contact form submitted successfully',
            'id': contact_submission.id
        }
        
        if not email_sent:
            response_data['warning'] = 'Contact form saved but email notification failed'
        
        return jsonify(response_data), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@forms_bp.route('/prayer-requests', methods=['GET'])
def get_prayer_requests():
    """Admin endpoint to view prayer requests"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        prayer_requests = PrayerRequest.query.order_by(
            PrayerRequest.created_at.desc()
        ).paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'prayer_requests': [pr.to_dict() for pr in prayer_requests.items],
            'total': prayer_requests.total,
            'pages': prayer_requests.pages,
            'current_page': page
        })
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@forms_bp.route('/contact-submissions', methods=['GET'])
def get_contact_submissions():
    """Admin endpoint to view contact submissions"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        submissions = ContactSubmission.query.order_by(
            ContactSubmission.created_at.desc()
        ).paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'submissions': [sub.to_dict() for sub in submissions.items],
            'total': submissions.total,
            'pages': submissions.pages,
            'current_page': page
        })
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@forms_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    })

