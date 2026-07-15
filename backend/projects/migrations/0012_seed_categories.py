from django.db import migrations

def seed_categories(apps, schema_editor):
    ProjectCategory = apps.get_model('projects', 'ProjectCategory')
    categories = ["Frontend", "Backend", "Full-Stack", "Backend, Full-Stack", "Full-Stack, Backend"]
    for cat_name in categories:
        ProjectCategory.objects.get_or_create(name=cat_name)

def rollback_categories(apps, schema_editor):
    # Non-destructive rollback: pass to preserve user edits/categories
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0011_certification_link'),
    ]

    operations = [
        migrations.RunPython(seed_categories, rollback_categories),
    ]
