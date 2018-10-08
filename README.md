# We Don't Need No Education

_Description_ - Job board for students without college degrees

---

| Students      |
| ------------- |
| Holly Giang   |
| Calum Groover |
| Mason Morrow  |
| Dixie Korley  |
| Sagar Desai   |

---

# Frontend

[Deployed site](https://sharp-bhabha-303aff.netlify.com/)

Netlify is configured to deploy from the master branch of this repo.
Any merge into the master will be tested and deployed if the build is successful.

### Using numeral.js Number formatting

```import numeral from "numeral";```


```numeral().format('')```
Note - props of the number type can be called within `numeral()`
Possible formats for reference - http://numeraljs.com/#format


### Using ant-design

To overwrite an ant-design class, use the `AntDesignOverride.css` file in `frontend/src/css/`.

For ant-design inline styles use `camelCase` (ie. `marginTop`, `fontSize`)
refer to https://reactjs.org/docs/dom-elements.html#style

# Backend

[Deployed database](https://job-board-backend.herokuapp.com/)

### Heroku

To push the latest changes to Heroku, push from a local master branch of this repo using `git push heroku master` with a properly authenticated Heroku account.

### Workflow in Django

>When adding dependencies with `pip install`, make sure to add the dependency to the `requirements.txt`, with specific version.

#### When downloading a newer version of the app with added dependencies:
1.  delete the `Pipfile` and `Pipfile.lock`
2.  use the command `pipenv install -r requirements.txt`
3.  Manually change the `python_version` in the newly generated `Pipfile` to `3.6.6` 
4.  Run `pipenv install` to update the lock file
5.  Run python migration commands in `pipenv shell`: 
    `./manage.py makemigrations` \
    `./manage.py makemigrations jobs` \
    `./manage.py migrate`


### Jobs API

[Notes on models](jobs/notes/MODELS.md)

- `/api/jobs/` returns a limited view of the 10 most recent jobs, sorted by publishing date in descending order (most rencetly published is first). It only accepts a GET request.
- `/api/addjob/` accepts a POST request to create a new Job.
- `/api/jobs/:id/` returns a specific job, and accepts PUT, and DELETE requests.
- `/api/company/jobs/` returns a a list of jobs posted by an authenticated company user, in descending order (most rencently published is first)


### Auth Routes

*Dependency: **djoser_views***
- `/api/register/` Creates a new User, using Djoser to handle activation email. Required fields: `email` & `password`

*Dependency: **`rest_framework_jwt.views`***
- `/api/login/` Generates a new token. Required fields: `email` & `password`
- `/api/login/refresh/` Refreshes existing valid token. Refresdelta is set at a maximum of 7 days, before invalidatinoriginal token. Required fields: `token`
- `/api/login/verify/` Verifies token validity. Required fields: `token`
- `/api/logout/all/` Creates a new JWT secret signature field on a User instance, which invalidates all existing tokens signed by previous secret. No required field. Request object must have the User requesting logout to be authenticated when accessing this API route. 

## Dependencies:

###  Faker: generating job post data: [DOCS](https://faker.readthedocs.io/en/master/)

> NB:  If data models have changed, make migrations or delete development database and migration folder, and run migrations commands.

*To create data:*

    > pipenv shell
    > ./manage.py shell
    >>> import seeder
    >>> exit()

`seeder.py` contains the data configuration.

### Running Tests

[Notes on tests goals](jobs/notes/TESTS.md)
1. Django-pytest
2. Enzyme