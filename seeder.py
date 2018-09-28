from django.core.management.base import BaseCommand
from django.conf import settings
import datetime
from random import randint, choice
from faker import Faker
fake = Faker()

from django.contrib.auth import get_user_model
from jobs.models import JobPost

User = get_user_model()

skills_list = [
'JavaScript', 'Python', 'Node.js', 
'SQL', 'MongoDB', 'Linux',
'C', 'Agile','React',
'Django', 'Ruby on Rails', 'Java'
]

class Command(BaseCommand):

    for entry in range(10):
        title = fake.job()
        description = fake.text(max_nb_chars=200, ext_word_list=None)
        job_location = fake.city()
        requirements = fake.text(max_nb_chars=200, ext_word_list=None)
        min_salary = fake.random_int(min=59999, max = 69999)
        max_salary = fake.random_int(min=70000, max=99999)
        created_date = fake.past_date()
        published_date = fake.past_date()

        count = 0 
        tag_count = randint(1, 4)
        tags = []
        while count <= tag_count:
            tags.append(choice(skills_list))
            count += 1 
        tags = ", ".join(str(x) for x in tags)

        new_jobpost, _ = JobPost.objects.get_or_create(
            title=title,
            description=description,
            job_location=job_location,
            requirements=requirements,
            min_salary=min_salary,
            max_salary=max_salary,
            created_date=created_date,
            published_date=published_date 
        )
         
        new_jobpost.tags.add(tags)
        new_jobpost.save()
        # print(new_jobpost)
