from django.test import TestCase, Client
from django.urls import reverse
from projects.models import ContactMessage, ProjectCategory

class ContactFormViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('contact_form')

    def test_contact_form_success(self):
        # Clear existing messages
        ContactMessage.objects.all().delete()
        
        payload = {
            "name": "Alex Mercer",
            "email": "alex.mercer@gentek.com",
            "message": "System integrity verification in progress."
        }
        
        response = self.client.post(self.url, data=payload, content_type='application/json')
        
        # Should succeed and save message to db
        self.assertEqual(response.status_code, 200)
        self.assertEqual(ContactMessage.objects.count(), 1)
        
        msg = ContactMessage.objects.first()
        self.assertEqual(msg.name, "Alex Mercer")
        self.assertEqual(msg.email, "alex.mercer@gentek.com")
        self.assertEqual(msg.message, "System integrity verification in progress.")

    def test_contact_form_missing_fields(self):
        payload = {
            "name": "Alex Mercer",
            "email": ""
        }
        response = self.client.post(self.url, data=payload, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn("required", response.json().get("detail", "").lower())

    def test_contact_form_invalid_email(self):
        payload = {
            "name": "Alex Mercer",
            "email": "invalid-email-format",
            "message": "Verify validation filters."
        }
        response = self.client.post(self.url, data=payload, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn("invalid email", response.json().get("detail", "").lower())

    def test_contact_form_honeypot_spam(self):
        payload = {
            "name": "SpamBot",
            "email": "bot@spam.com",
            "message": "Buy something!",
            "website": "http://spam-link.com"
        }
        response = self.client.post(self.url, data=payload, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn("spam", response.json().get("detail", "").lower())

    def test_cors_preflight_request(self):
        # Preflight OPTIONS request
        origin = "https://portfolio-v1-zeta-nine.vercel.app"
        headers = {
            "HTTP_ORIGIN": origin,
            "HTTP_ACCESS_CONTROL_REQUEST_METHOD": "POST",
            "HTTP_ACCESS_CONTROL_REQUEST_HEADERS": "content-type"
        }
        response = self.client.options(self.url, **headers)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers.get("Access-Control-Allow-Origin"), origin)
        self.assertIn("POST", response.headers.get("Access-Control-Allow-Methods", ""))

    def test_cors_rejected_origin(self):
        origin = "https://unauthorized-hacker-site.com"
        headers = {
            "HTTP_ORIGIN": origin,
            "HTTP_ACCESS_CONTROL_REQUEST_METHOD": "POST"
        }
        response = self.client.options(self.url, **headers)
        
        # Rejected origins should not return the Access-Control-Allow-Origin header matching the unauthorized origin
        self.assertNotEqual(response.headers.get("Access-Control-Allow-Origin"), origin)
