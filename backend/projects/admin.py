from django.contrib import admin
from .models import Project, Skill, Profile, MissionLog, Certification, ProjectCategory, ContactMessage

admin.site.register(Project)
admin.site.register(Skill)
admin.site.register(Profile)
admin.site.register(MissionLog)
admin.site.register(Certification)
admin.site.register(ProjectCategory)
admin.site.register(ContactMessage)
