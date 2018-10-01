from django.core.management.base import BaseCommand
from random import randint, choice
from jobs.models import JobPost
from django.contrib.auth import get_user_model
from faker import Faker
fake = Faker()

User = get_user_model()

skills_list = [
'JavaScript', 'Python', 'Node.js', 
'SQL', 'MongoDB', 'Linux',
'C', 'Agile','React',
'Django', 'Ruby on Rails', 'Java'
]


class Command(BaseCommand):

    for entry in range(40):
        title = fake.job()
        description = fake.text(max_nb_chars=200, ext_word_list=None)
        job_location = fake.city()
        requirements = fake.text(max_nb_chars=200, ext_word_list=None)
        min_salary = fake.random_int(min=29999, max=69999)
        max_salary = fake.random_int(min=70000, max=179999)
        created_date = fake.past_date()

        # Create publish state
        published = fake.boolean(chance_of_getting_true=60)

        # Create Tags
        count = 0
        tag_count = randint(1, 7)
        tags = []
        while count < tag_count:
            tags.append(choice(skills_list))
            count += 1

        new_jobpost, _ = JobPost.objects.get_or_create(
            title=title,
            description=description,
            job_location=job_location,
            requirements=requirements,
            min_salary=min_salary,
            max_salary=max_salary,
            created_date=created_date
        )

        # Loop through tags list, save each tag to get the correct separation
        for tag in tags:
            new_jobpost.tags.add(tag)
        # Set publish date if boolean is True
        if published:
            new_jobpost.published_date = fake.past_date()

        new_jobpost.save()
        print(new_jobpost)
