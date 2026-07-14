from django.db import migrations

def seed_skills(apps, schema_editor):
    Skill = apps.get_model('projects', 'Skill')
    skills_data = [
        # Programming Languages
        {"name": "Python", "category": "Programming Languages", "color": "accent"},
        {"name": "Java", "category": "Programming Languages", "color": "accent"},
        {"name": "JavaScript", "category": "Programming Languages", "color": "accent"},
        {"name": "SQL", "category": "Programming Languages", "color": "accent"},
        # Full Stack
        {"name": "React.js", "category": "Full Stack", "color": "primary"},
        {"name": "Node.js", "category": "Full Stack", "color": "primary"},
        {"name": "Express.js", "category": "Full Stack", "color": "primary"},
        {"name": "Flask", "category": "Full Stack", "color": "primary"},
        {"name": "REST APIs", "category": "Full Stack", "color": "primary"},
        # Generative AI
        {"name": "OpenAI API", "category": "Generative AI", "color": "secondary"},
        {"name": "Prompt Engineering", "category": "Generative AI", "color": "secondary"},
        {"name": "LLM Integration", "category": "Generative AI", "color": "secondary"},
        {"name": "LangChain", "category": "Generative AI", "color": "secondary"},
        {"name": "AI Agents", "category": "Generative AI", "color": "secondary"},
        # Databases
        {"name": "MongoDB", "category": "Databases", "color": "accent"},
        {"name": "MySQL", "category": "Databases", "color": "accent"},
        # Developer Tools
        {"name": "Git", "category": "Developer Tools", "color": "primary"},
        {"name": "GitHub", "category": "Developer Tools", "color": "primary"},
        {"name": "Linux Command Line", "category": "Developer Tools", "color": "primary"},
        {"name": "Postman", "category": "Developer Tools", "color": "primary"},
        # Core Computer Science
        {"name": "Data Structures & Algorithms", "category": "Core Computer Science", "color": "secondary"},
        {"name": "Object-Oriented Programming", "category": "Core Computer Science", "color": "secondary"},
        {"name": "DBMS", "category": "Core Computer Science", "color": "secondary"},
        {"name": "Operating Systems", "category": "Core Computer Science", "color": "secondary"},
        # Practices
        {"name": "API Design", "category": "Practices", "color": "accent"},
        {"name": "Debugging", "category": "Practices", "color": "accent"},
        {"name": "Code Review", "category": "Practices", "color": "accent"},
        {"name": "Agile", "category": "Practices", "color": "accent"},
        {"name": "Unit Testing", "category": "Practices", "color": "accent"},
    ]
    for skill in skills_data:
        Skill.objects.get_or_create(
            name=skill["name"],
            defaults={"category": skill["category"], "color": skill["color"]}
        )

def unseed_skills(apps, schema_editor):
    Skill = apps.get_model('projects', 'Skill')
    Skill.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0002_skill'),
    ]

    operations = [
        migrations.RunPython(seed_skills, unseed_skills),
    ]
