from django.core.management.base import BaseCommand
from fakerdata import UserFactory, JobPostFactory
from random import randint, choice
from taggit.managers import TaggableManager
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from jobs import models
# from faker import Faker
# fake = Faker()
import factory


User = get_user_model()

skills_list = [
'JavaScript', 'Python', 'Node.js', 
'SQL', 'MongoDB', 'Linux',
'C', 'Agile','React',
'Django', 'Ruby on Rails', 'Java'
]

company_logos = [
'media_default_images/auto-speed.png',
'media_default_images/baby-swim.png',
'media_default_images/beauty-box.png',
'media_default_images/cheshire-county-hygiene-services.png',
'media_default_images/crofts-accountants.png',
'media_default_images/fast-banana.png',
'media_default_images/greens-food-suppliers.png',
'media_default_images/james-and-sons.png',
'media_default_images/petes-blinds.png',
'media_default_images/space-cube.png',
'media_default_images/the-dance-studio.png',
'media_default_images/the-web-works.png',
'media_default_images/yoga-baby.png'
]


class Command(BaseCommand):

    for entry in range(20):

        email = factory.Faker('safe_email')
        password = make_password('TESTACCOUNT')
        is_employer = factory.Faker('boolean', chance_of_getting_true=40)

        if is_employer:
            company_name = factory.Faker('company')
            company_logo = choice(company_logos)
            company_summary = factory.Faker('paragraph', nb_sentences=3, variable_nb_sentences=True, ext_word_list=None)
            application_inbox = factory.Faker('safe_email')
        else:
            company_name = ""
            company_logo = ""
            company_summary = ""
            application_inbox = ""

        new_user = UserFactory(
            email=email,
            password=password,
            is_employer=is_employer,
            company_name=company_name,
            company_logo=company_logo,
            company_summary=company_summary,
            application_inbox=application_inbox
        )

        new_user.save()
        print(new_user)

# User model fields:

# is_employer
# email
# password
# is_active
# is_staff
# company_name
# company_logo
# company_summary
# application_inbox
# first_name
# last_name
# profile_photo
# created_date
# jwt_secret

    companies = models.User.objects.exclude(is_employer=False)

    for entry in range(100):

        # Create publish state
        published = factory.Faker('boolean', chance_of_getting_true=60)
        company = choice(companies)
        print(company)

        if published:
            published_date = factory.Faker('past_datetime')

        new_jobpost = JobPostFactory(
            company=company,
            company_name=factory.Faker('company'),
            title=factory.Faker('job'),
            description=factory.Faker('paragraph', nb_sentences=5, variable_nb_sentences=True, ext_word_list=None),
            job_location=factory.Faker('city'),
            requirements=factory.Faker('text', max_nb_chars=200, ext_word_list=None),
            min_salary=factory.Faker('random_int', min=29999, max=69999),
            max_salary=factory.Faker('random_int', min=70000, max=179999),
            is_active=factory.Faker('boolean', False),
            created_date=factory.Faker('past_date'),
            published_date=published_date
        )

        new_jobpost.save()
        print(new_jobpost)



    job_posts = models.JobPost.objects.all()

    for post in job_posts:

        # Create Tags
        count = 0
        tag_count = randint(1, 7)
        tags = []
        while count < tag_count:
            tags.append(choice(skills_list))
            count += 1

        print(tags)
        for tag in tags:
            post.tags.add(tag)

        post.save()

# Job Posts fields:

# company
# company_name
# title
# company_logo
# description
# job_location
# requirements
# min_salary
# max_salary
# is_active
# tags
# created_date
# published_date
