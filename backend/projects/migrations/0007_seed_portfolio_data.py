from django.db import migrations

def seed_data(apps, schema_editor):
    Profile = apps.get_model('projects', 'Profile')
    MissionLog = apps.get_model('projects', 'MissionLog')
    Certification = apps.get_model('projects', 'Certification')

    # 1. Update/Ensure Profile singleton contains correct seed defaults
    profile, created = Profile.objects.get_or_create(id=1)
    profile.logo_initials = "AG"
    profile.first_name = "Aniket"
    profile.last_name = "Goyal"
    profile.hero_title_p1 = "I don't just build projects. "
    profile.hero_title_p2 = "I engineer systems."
    profile.hero_subtitle = "Full Stack Developer · Systems Engineer"
    profile.github_url = "https://github.com/aniketgoyal12"
    profile.github_label = "github.com/aniketgoyal12"
    profile.linkedin_url = "https://linkedin.com/in/aniketgoyal-ag/"
    profile.linkedin_label = "linkedin.com/in/aniketgoyal-ag/"
    profile.save()

    # 2. Seed Mission Logs
    MissionLog.objects.get_or_create(
        role="Full Stack Developer Intern",
        organization="Tech Organization",
        period="2026",
        defaults={
            "contributions": [
                "Developed RESTful APIs for a Project Management System using Node.js and Express",
                "Implemented role-based access control with JWT authentication",
                "Designed project and task modules with auto-generated code logic and MongoDB",
                "Structured and documented APIs to streamline intern-manager task workflow"
            ],
            "order": 1
        }
    )

    # 3. Seed Certifications
    Certification.objects.get_or_create(
        title="Meta Front-End Developer Professional Certificate",
        issuer="Coursera",
        defaults={"status": "UNLOCKED", "order": 1}
    )
    Certification.objects.get_or_create(
        title="GenAI Bootcamp",
        issuer="Coding Blocks",
        defaults={"status": "UNLOCKED", "order": 2}
    )

def rollback_data(apps, schema_editor):
    MissionLog = apps.get_model('projects', 'MissionLog')
    Certification = apps.get_model('projects', 'Certification')
    MissionLog.objects.all().delete()
    Certification.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0006_certification_missionlog_profile_first_name_and_more'),
    ]

    operations = [
        migrations.RunPython(seed_data, rollback_data),
    ]
