import os
import json
from django.core.management.base import BaseCommand
from django.conf import settings
from projects.models import Project, Skill, Profile, MissionLog, Certification, ProjectCategory

class Command(BaseCommand):
    help = 'Idempotently seeds all default portfolio data (categories, projects, skills, profile, missions, certifications)'

    def handle(self, *args, **options):
        self.stdout.write("Starting idempotent database seeding...")

        # 1. Seed Categories
        categories = ["Frontend", "Backend", "Full-Stack", "Backend, Full-Stack", "Full-Stack, Backend"]
        for cat_name in categories:
            cat, created = ProjectCategory.objects.get_or_create(name=cat_name)
            if created:
                self.stdout.write(f"Created category: {cat_name}")
            else:
                self.stdout.write(f"Category already exists: {cat_name}")

        # 2. Seed Profile
        profile, created = Profile.objects.get_or_create(id=1, defaults={
            "logo_initials": "AG",
            "first_name": "Aniket",
            "last_name": "Goyal",
            "hero_title_p1": "I don't just build projects. ",
            "hero_title_p2": "I engineer systems.",
            "hero_subtitle": "Full Stack Developer · Systems Engineer",
            "github_url": "https://github.com/aniketgoyal12",
            "github_label": "github.com/aniketgoyal12",
            "linkedin_url": "https://linkedin.com/in/aniketgoyal-ag/",
            "linkedin_label": "linkedin.com/in/aniketgoyal-ag/",
            "bio_p1": "I am a Computer Science student and Full Stack Developer specialized in MERN stack and high-performance system design.",
            "bio_p2": "Focusing on systems engineering, API development, and software architecture.",
        })
        if created:
            self.stdout.write("Created default system profile configuration.")
        else:
            self.stdout.write("System profile configuration already exists.")

        # 3. Seed Skills
        skills_data = [
            {"name": "Python", "category": "Programming Languages", "color": "accent"},
            {"name": "Java", "category": "Programming Languages", "color": "accent"},
            {"name": "JavaScript", "category": "Programming Languages", "color": "accent"},
            {"name": "SQL", "category": "Programming Languages", "color": "accent"},
            {"name": "React.js", "category": "Full Stack", "color": "primary"},
            {"name": "Node.js", "category": "Full Stack", "color": "primary"},
            {"name": "Express.js", "category": "Full Stack", "color": "primary"},
            {"name": "Flask", "category": "Full Stack", "color": "primary"},
            {"name": "REST APIs", "category": "Full Stack", "color": "primary"},
            {"name": "OpenAI API", "category": "Generative AI", "color": "secondary"},
            {"name": "Prompt Engineering", "category": "Generative AI", "color": "secondary"},
            {"name": "LLM Integration", "category": "Generative AI", "color": "secondary"},
            {"name": "LangChain", "category": "Generative AI", "color": "secondary"},
            {"name": "AI Agents", "category": "Generative AI", "color": "secondary"},
            {"name": "MongoDB", "category": "Databases", "color": "accent"},
            {"name": "MySQL", "category": "Databases", "color": "accent"},
            {"name": "Git", "category": "Developer Tools", "color": "primary"},
            {"name": "GitHub", "category": "Developer Tools", "color": "primary"},
            {"name": "Linux Command Line", "category": "Developer Tools", "color": "primary"},
            {"name": "Postman", "category": "Developer Tools", "color": "primary"},
            {"name": "Data Structures & Algorithms", "category": "Core Computer Science", "color": "secondary"},
            {"name": "Object-Oriented Programming", "category": "Core Computer Science", "color": "secondary"},
            {"name": "DBMS", "category": "Core Computer Science", "color": "secondary"},
            {"name": "Operating Systems", "category": "Core Computer Science", "color": "secondary"},
            {"name": "API Design", "category": "Practices", "color": "accent"},
            {"name": "Debugging", "category": "Practices", "color": "accent"},
            {"name": "Code Review", "category": "Practices", "color": "accent"},
            {"name": "Agile", "category": "Practices", "color": "accent"},
            {"name": "Unit Testing", "category": "Practices", "color": "accent"},
        ]
        for skill in skills_data:
            s, created = Skill.objects.get_or_create(
                name=skill["name"],
                defaults={"category": skill["category"], "color": skill["color"]}
            )
            if created:
                self.stdout.write(f"Created skill: {skill['name']}")

        # 4. Seed Mission Logs
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

        # 5. Seed Certifications
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

        # 6. Seed Projects from fixture
        fixture_path = os.path.join(settings.BASE_DIR, 'projects', 'fixtures', 'initial_projects.json')
        if os.path.exists(fixture_path):
            with open(fixture_path, 'r', encoding='utf-8') as f:
                projects_data = json.load(f)
                for item in projects_data:
                    fields = item['fields']
                    proj, created = Project.objects.get_or_create(
                        slug_id=fields['slug_id'],
                        defaults={
                            "name": fields['name'],
                            "codename": fields['codename'],
                            "description": fields['description'],
                            "long_description": fields['long_description'],
                            "live_link": fields['live_link'],
                            "repo_link": fields['repo_link'],
                            "image": fields.get('image', ''),
                            "category": fields['category'],
                            "tech_stack": fields['tech_stack'],
                            "highlights": fields['highlights'],
                            "featured": fields.get('featured', False),
                        }
                    )
                    if created:
                        self.stdout.write(f"Created project: {fields['name']}")
                    else:
                        self.stdout.write(f"Project already exists: {fields['name']}")
        else:
            self.stdout.write("Projects fixture not found, skipping projects seeding.")

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully."))
