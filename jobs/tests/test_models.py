
from django.utils import timezone
from jobs.models import JobPost, UserManager
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
class UserManagerTest:
    def test__create_user(self):
        testUserManager = UserManager()
        assert testUserManager._create_user == testUserManager.user

    def test_create_user(self):
        testUserManager = UserManager()
        assert testUserManager.create_user == testUserManager._create_user

    def test_create_superuser(self):
        testUserManager = UserManager()
        assert testUserManager._create_user == testUserManager._create_user


"""
class UserManager(BaseUserManager):

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
    
        Create and save a user with the given email and password.
    
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        is_employee = models.BooleanField(default=False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)
"""


# class User(AbstractBaseUser, PermissionsMixin):
#     is_employer = models.BooleanField(default=False)
#     email = models.EmailField(
#         verbose_name='email address', max_length=255, unique=True)
#     password = models.CharField(max_length=100, default="", null=False)
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)
#     company_name = models.CharField(max_length=200, blank=True)
#     company_logo = models.FileField(
#         upload_to='company_logo/%Y/%m/%d/', blank=True, null=True)
#     company_summary = models.CharField(max_length=6000, blank=True)
#     application_inbox = models.EmailField(blank=True, default='')
#     first_name = models.CharField(max_length=200, blank=True)
#     last_name = models.CharField(max_length=200, blank=True)
#     profile_photo = models.ImageField(
#         upload_to='profile_photo/%Y/%m/%d/', blank=True, null=True)
#     created_date = models.DateTimeField(default=timezone.now, editable=False)
#     jwt_secret = models.UUIDField(default=uuid.uuid4)

#     objects = UserManager()

#     USERNAME_FIELD = 'email'
#     # REQUIRED_FIELDS = []

#     class Meta:
#         ordering = ['created_date']

#     def __str__(self):
#         return self.email
