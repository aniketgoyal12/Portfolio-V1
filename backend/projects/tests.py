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


class ProjectViewTests(TestCase):
    def setUp(self):
        from django.contrib.auth.models import User
        from projects.models import Project
        self.client = Client()
        self.user = User.objects.create_superuser(username="admin", password="password", email="admin@example.com")
        self.project = Project.objects.create(
            slug_id="test-project",
            name="Test Project",
            codename="SYS-001",
            description="Short desc",
            long_description="Long desc",
            category="Frontend",
            tech_stack=["React"],
            highlights=["Highlight 1"],
            featured=False
        )
        self.client.login(username="admin", password="password")

    def test_update_project_put_multipart(self):
        from django.conf import settings
        from rest_framework_simplejwt.tokens import RefreshToken
        
        # Authenticate via JWT cookie
        refresh = RefreshToken.for_user(self.user)
        self.client.cookies[settings.SIMPLE_JWT_ACCESS_COOKIE] = str(refresh.access_token)
        
        # Get CSRF token
        csrf_res = self.client.get(reverse('csrf_token'))
        csrf_token = self.client.cookies['csrftoken'].value
        
        url = reverse('project-detail', kwargs={'pk': self.project.id})
        
        from django.test.client import MULTIPART_CONTENT, encode_multipart
        
        payload = {
            "name": "Updated Project Name",
            "slug_id": "test-project",
            "codename": "SYS-001",
            "description": "Short desc",
            "long_description": "Long desc",
            "category": "Frontend",
            "tech_stack": '["React", "Django"]',
            "highlights": '["Highlight 1", "Highlight 2"]',
            "featured": "false"
        }
        
        # Encode as multipart manually because Django Client.put doesn't auto-encode dicts as multipart
        boundary = "BoUnDaRyStRiNg"
        encoded_data = encode_multipart(boundary, payload)
        
        self.project.image = "projects/test_image.png"
        self.project.save()
        
        response = self.client.put(
            url, 
            data=encoded_data, 
            content_type=f'multipart/form-data; boundary={boundary}',
            HTTP_X_CSRFTOKEN=csrf_token
        )
        self.assertEqual(response.status_code, 200)
        
        self.project.refresh_from_db()
        self.assertEqual(self.project.name, "Updated Project Name")
        self.assertEqual(self.project.tech_stack, ["React", "Django"])
        self.assertEqual(self.project.image.name, "projects/test_image.png")




