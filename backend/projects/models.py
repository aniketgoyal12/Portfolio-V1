from django.db import models
from .validators import validate_image_file

class Project(models.Model):
    slug_id = models.CharField(max_length=100, unique=True, db_index=True)
    name = models.CharField(max_length=200)
    codename = models.CharField(max_length=50)
    description = models.TextField()
    long_description = models.TextField()
    live_link = models.CharField(max_length=255, blank=True)
    repo_link = models.CharField(max_length=255, blank=True)
    image = models.FileField(upload_to='projects/', null=True, blank=True, validators=[validate_image_file])
    category = models.CharField(max_length=100)
    tech_stack = models.JSONField()
    highlights = models.JSONField()
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=100)
    color = models.CharField(max_length=50, default="accent")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.category})"


class Profile(models.Model):
    bio_p1 = models.TextField()
    bio_p2 = models.TextField()
    stack = models.CharField(max_length=100, default="MERN")
    experience = models.CharField(max_length=100, default="Full Stack — 1 yr projects")
    availability = models.CharField(max_length=100, default="Open to internships")
    status = models.CharField(max_length=100, default="Active")
    owner_email = models.EmailField(default="goyalaniket2006@gmail.com")
    default_from_email = models.EmailField(default="goyalaniket2006@gmail.com")

    # New brand & landing content
    logo_initials = models.CharField(max_length=10, default="AG")
    first_name = models.CharField(max_length=100, default="Aniket")
    last_name = models.CharField(max_length=100, default="Goyal")
    hero_title_p1 = models.CharField(max_length=255, default="I don't just build projects. ")
    hero_title_p2 = models.CharField(max_length=255, default="I engineer systems.")
    hero_subtitle = models.CharField(max_length=255, default="Full Stack Developer · Systems Engineer")

    # Social links
    github_url = models.CharField(max_length=255, default="https://github.com/aniketgoyal12")
    github_label = models.CharField(max_length=255, default="github.com/aniketgoyal12")
    linkedin_url = models.CharField(max_length=255, default="https://linkedin.com/in/aniketgoyal-ag/")
    linkedin_label = models.CharField(max_length=255, default="linkedin.com/in/aniketgoyal-ag/")

    def __str__(self):
        return "System Profile Config"


class MissionLog(models.Model):
    role = models.CharField(max_length=200)
    organization = models.CharField(max_length=200)
    period = models.CharField(max_length=100)
    contributions = models.JSONField(default=list)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.role} @ {self.organization}"


class Certification(models.Model):
    title = models.CharField(max_length=250)
    issuer = models.CharField(max_length=200)
    status = models.CharField(max_length=100, default="UNLOCKED")
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.issuer})"
