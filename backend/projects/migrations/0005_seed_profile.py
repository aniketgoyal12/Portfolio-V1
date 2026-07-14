from django.db import migrations

def seed_profile(apps, schema_editor):
    Profile = apps.get_model('projects', 'Profile')
    Profile.objects.get_or_create(
        id=1,
        defaults={
            "bio_p1": "Computer Science student and Full Stack Developer who approaches every project like building a high-performance system. Specializing in the MERN stack with a deep focus on scalable architecture, secure authentication, and production-grade engineering.",
            "bio_p2": "From audit management platforms to real-time expense trackers, every system I build prioritizes reliability, modularity, and clean engineering. I don't just write code — I architect solutions that scale under pressure.",
            "stack": "MERN",
            "focus": "Full Stack",
            "approach": "System Design",
            "status": "Active",
            "owner_email": "goyalaniket2006@gmail.com",
            "default_from_email": "goyalaniket2006@gmail.com"
        }
    )

def unseed_profile(apps, schema_editor):
    Profile = apps.get_model('projects', 'Profile')
    Profile.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0004_profile'),
    ]

    operations = [
        migrations.RunPython(seed_profile, unseed_profile),
    ]
