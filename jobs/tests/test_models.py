
from django.utils import timezone
from jobs.models import JobPost, UserManager, User
import pytest
 
# JobPost Test Suite
@pytest.mark.django_db
class TestJobPost:
    def test_jobpost_model(self):
        self.company_name = 'Google MERN'
        self.title = 'Software Engineer'
        self.description = 'Program in MERN stack'
        self.job_location = 'Las Vegas'
        self.requirements = 'Must work in MERN stack for at least a year'
        self.min_salary = 60000
        self.max_salary = 80000
        self.is_active = True
        self.tags = 'javascript, mongodb, sql, express.js'
        self.created_date = timezone.now()
        self.published_date = timezone.now()

        self.test_jobpost = JobPost.objects.create(
            title = self.title,
            description = self.description,
            job_location = self.job_location,
            requirements = self.requirements,
            min_salary = self.min_salary,
            max_salary = self.max_salary,
            is_active = self.is_active,
            tags = self.tags,
            created_date = self.created_date,
            published_date = self.published_date,
        )

        def test_publish_jobpost(self):
            assert isinstance(self.publish, JobPost)
        
        def test_str(self):
            assert self.__str__ == self.title


# UserManager Test Suite
class TestUserManager:
    def test__create_user(self):
        testUserManager = UserManager()
        assert testUserManager._create_user == testUserManager.user

    def test_create_user(self):
        testUserManager = UserManager()
        assert testUserManager.create_user == testUserManager._create_user

    def test_create_superuser(self):
        testUserManager = UserManager()
        assert testUserManager._create_user == testUserManager._create_user

class TestUser:
    def test_user_model(self):
        self.is_employer = True
        self.email = 'example_email@gmail.com'
        self.password = 'example_password'
        self.is_active = True
        self.is_staff = True
        self.company_name = 'Example Company'
        self.company_logo = '<img src=\'#\' alt=\'example\'>'
        self.company_description = "An example company description for the company"
        self.application_inbox = 'javascript, mongodb, sql, express.js'
        self.first_name = "Example"
        self.profile_photo = '<img src=\'#\' alt=\'example\'>'
        self.created_date = timezone.now()
        self.jwt_secret = '{12345678-1234-5678-1234-567812345678}'

        self.test_user = User.objects.create(
            is_employer = self.is_employer,
            email = self.email,
            password = self.password,
            is_active = self.is_active,
            is_staff = self.is_staff,
            company_name = self.company_name,
            company_logo = self.company_logo,
            company_description = self.company_description,
            application_inbox = self.application_inbox,
            first_name = self.first_name,
            profile_photo = self.profile_photo,
            created_date = self.created_date,
            jwt_secret = self.jwt_secret,
        )

        def test_str(self):
            assert self.__str__ == self.email
"""
class User(AbstractBaseUser, PermissionsMixin):
    is_employer = models.BooleanField(default=False)
    email = models.EmailField(
        verbose_name='email address', max_length=255, unique=True)
    password = models.CharField(max_length=100, default="", null=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    company_name = models.CharField(max_length=200, blank=True)
    company_logo = models.FileField(
        upload_to='company_logo/%Y/%m/%d/', blank=True, null=True)
    company_summary = models.CharField(max_length=6000, blank=True)
    application_inbox = models.EmailField(blank=True, default='')
    first_name = models.CharField(max_length=200, blank=True)
    last_name = models.CharField(max_length=200, blank=True)
    profile_photo = models.ImageField(
        upload_to='profile_photo/%Y/%m/%d/', blank=True, null=True)
    created_date = models.DateTimeField(default=timezone.now, editable=False)
    jwt_secret = models.UUIDField(default=uuid.uuid4)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = []

    class Meta:
        ordering = ['created_date']

    def __str__(self):
        return self.email
"""
