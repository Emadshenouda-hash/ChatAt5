import os
from flask import current_app
from flask_mail import Mail, Message
from jinja2 import Template
from datetime import datetime

mail = Mail()

class EmailService:
    def __init__(self):
        self.admin_email = os.getenv('ADMIN_EMAIL', 'admin@chatat.org')
        self.admin_name = os.getenv('ADMIN_NAME', 'ChatAT Admin')
    
    def send_prayer_request_notification(self, prayer_request):
        """Send email notification for new prayer request"""
        try:
            # Admin notification
            admin_subject = f"New Prayer Request - {prayer_request.category.title()}"
            admin_body = self._render_prayer_admin_template(prayer_request)
            
            self._send_email(
                to=self.admin_email,
                subject=admin_subject,
                body=admin_body,
                is_html=True
            )
            
            # User confirmation (only if not anonymous)
            if not prayer_request.is_anonymous and prayer_request.email:
                user_subject = "Prayer Request Received - ChatAT"
                user_body = self._render_prayer_confirmation_template(prayer_request)
                
                self._send_email(
                    to=prayer_request.email,
                    subject=user_subject,
                    body=user_body,
                    is_html=True
                )
            
            return True
            
        except Exception as e:
            current_app.logger.error(f"Failed to send prayer request notification: {str(e)}")
            return False
    
    def send_contact_notification(self, contact_submission):
        """Send email notification for new contact submission"""
        try:
            # Admin notification
            admin_subject = f"New Contact: {contact_submission.subject}"
            admin_body = self._render_contact_admin_template(contact_submission)
            
            self._send_email(
                to=self.admin_email,
                subject=admin_subject,
                body=admin_body,
                is_html=True
            )
            
            # User confirmation
            user_subject = "Message Received - ChatAT"
            user_body = self._render_contact_confirmation_template(contact_submission)
            
            self._send_email(
                to=contact_submission.email,
                subject=user_subject,
                body=user_body,
                is_html=True
            )
            
            return True
            
        except Exception as e:
            current_app.logger.error(f"Failed to send contact notification: {str(e)}")
            return False
    
    def _send_email(self, to, subject, body, is_html=False):
        """Send email using Flask-Mail"""
        msg = Message(
            subject=subject,
            recipients=[to],
            sender=(self.admin_name, self.admin_email)
        )
        
        if is_html:
            msg.html = body
        else:
            msg.body = body
        
        mail.send(msg)
    
    def _render_prayer_admin_template(self, prayer_request):
        """Render admin notification template for prayer requests"""
        template = Template("""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #555; }
                .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #667eea; }
                .anonymous { color: #e74c3c; font-style: italic; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>New Prayer Request Received</h2>
                    <p>{{ datetime.now().strftime('%B %d, %Y at %I:%M %p') }}</p>
                </div>
                <div class="content">
                    {% if prayer_request.is_anonymous %}
                    <div class="field">
                        <div class="label">Submission Type:</div>
                        <div class="value anonymous">Anonymous Request</div>
                    </div>
                    {% else %}
                    <div class="field">
                        <div class="label">Name:</div>
                        <div class="value">{{ prayer_request.name }}</div>
                    </div>
                    <div class="field">
                        <div class="label">Email:</div>
                        <div class="value">{{ prayer_request.email }}</div>
                    </div>
                    {% endif %}
                    
                    <div class="field">
                        <div class="label">Category:</div>
                        <div class="value">{{ prayer_request.category.title() }}</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">Language:</div>
                        <div class="value">{{ 'English' if prayer_request.language == 'en' else 'Arabic' }}</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">Prayer Request:</div>
                        <div class="value">{{ prayer_request.request }}</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">Submitted:</div>
                        <div class="value">{{ prayer_request.created_at.strftime('%B %d, %Y at %I:%M %p UTC') }}</div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """)
        
        return template.render(prayer_request=prayer_request, datetime=datetime)
    
    def _render_prayer_confirmation_template(self, prayer_request):
        """Render user confirmation template for prayer requests"""
        template = Template("""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .message { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; }
                .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Prayer Request Received</h2>
                    <p>Thank you for sharing your heart with us</p>
                </div>
                <div class="content">
                    <div class="message">
                        <p>Dear {{ prayer_request.name }},</p>
                        
                        <p>We have received your prayer request and want you to know that you are not alone. Our community believes in the power of prayer and we are honored that you've shared your needs with us.</p>
                        
                        <p><strong>Your prayer request category:</strong> {{ prayer_request.category.title() }}</p>
                        
                        <p>We will be praying for you and your situation. Remember that God hears every prayer and cares deeply about what concerns you.</p>
                        
                        <p><em>"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus." - Philippians 4:6-7</em></p>
                        
                        <p>If you need immediate support or have additional prayer requests, please don't hesitate to reach out to us.</p>
                        
                        <p>Blessings and peace,<br>
                        The ChatAT Community</p>
                    </div>
                    
                    <div class="footer">
                        <p>This is an automated confirmation. If you have questions, please contact us through our website.</p>
                        <p>Submitted on {{ prayer_request.created_at.strftime('%B %d, %Y at %I:%M %p UTC') }}</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """)
        
        return template.render(prayer_request=prayer_request)
    
    def _render_contact_admin_template(self, contact_submission):
        """Render admin notification template for contact submissions"""
        template = Template("""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #20b2aa 0%, #2e8b57 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #555; }
                .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #20b2aa; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>New Contact Message</h2>
                    <p>{{ datetime.now().strftime('%B %d, %Y at %I:%M %p') }}</p>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="label">Name:</div>
                        <div class="value">{{ contact_submission.name }}</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">Email:</div>
                        <div class="value">{{ contact_submission.email }}</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">Subject:</div>
                        <div class="value">{{ contact_submission.subject }}</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">Language:</div>
                        <div class="value">{{ 'English' if contact_submission.language == 'en' else 'Arabic' }}</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">Message:</div>
                        <div class="value">{{ contact_submission.message }}</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">Submitted:</div>
                        <div class="value">{{ contact_submission.created_at.strftime('%B %d, %Y at %I:%M %p UTC') }}</div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """)
        
        return template.render(contact_submission=contact_submission, datetime=datetime)
    
    def _render_contact_confirmation_template(self, contact_submission):
        """Render user confirmation template for contact submissions"""
        template = Template("""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #20b2aa 0%, #2e8b57 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .message { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #20b2aa; }
                .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Message Received</h2>
                    <p>Thank you for reaching out to us</p>
                </div>
                <div class="content">
                    <div class="message">
                        <p>Dear {{ contact_submission.name }},</p>
                        
                        <p>Thank you for contacting ChatAT. We have received your message and appreciate you taking the time to reach out to us.</p>
                        
                        <p><strong>Your message subject:</strong> {{ contact_submission.subject }}</p>
                        
                        <p>We typically respond to messages within 24 hours during business days. If your inquiry is urgent, please don't hesitate to follow up with us.</p>
                        
                        <p>We value your connection with our community and look forward to assisting you.</p>
                        
                        <p>Blessings,<br>
                        The ChatAT Team</p>
                    </div>
                    
                    <div class="footer">
                        <p>This is an automated confirmation. We will respond to your message soon.</p>
                        <p>Submitted on {{ contact_submission.created_at.strftime('%B %d, %Y at %I:%M %p UTC') }}</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """)
        
        return template.render(contact_submission=contact_submission)

