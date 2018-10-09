# We Don't Need No Education

_A Job board for people without college degrees_

[Visit Site](https://sharp-bhabha-303aff.netlify.com/)

---

| Contributors  |
| ------------- |
| Holly Giang   |
| Calum Groover |
| Mason Morrow  |
| Dixie Korley  |
| Sagar Desai   |
| *Your name here*|

---

## Contributing

If you'd like to add to the project, take a look at our currently opened [issues](https://github.com/Lambda-School-Labs/CS10-job-board/issues), or submit an issue.

    Development Environment:
    pip 18.0
    Python 3.6.6
    Django 2.1.1
    React 16.5.0

A full list of server dependencies can be found in [requirements.txt](https://github.com/Lambda-School-Labs/CS10-job-board/blob/master/requirements.txt)

Client dependencies can be found in [package.json](https://github.com/Lambda-School-Labs/CS10-job-board/blob/master/frontend/package.json)

### Workflow in Django
> Run `pipenv install`, `pipenv shell` to create virtual env  
  Run \
  `./manage.py makemgrations` \
  `/.manage.py makemigrations jobs`\
  `/.manage.py migrate` \
  to create tables in sqllite3 databse file \
  Run `/manage.py runserver` to start development server


NB:

> Make sure pipenv python version is 3.6.6 with `pipenv install --python3.6.6`

>When adding dependencies with `pip install`, make sure to add the dependency to the `requirements.txt`, with a specific version.

#### When downloading a newer version of the app with modified dependencies:
1.  delete the `Pipfile` and `Pipfile.lock`
2.  use the command `pipenv install -r requirements.txt`
3.  Manually change the `python_version` in the newly generated `Pipfile` to `3.6.6` 
4.  Run `pipenv install` to update the lock file
5.  Run python migration commands in `pipenv shell`:

    `./manage.py makemigrations` \
    `./manage.py makemigrations jobs` \
    `./manage.py migrate`

### Workflow in React

>Run `yarn install` & `yarn start` in `/frontend` to start a development server.

---
# Frontend


Netlify is configured to deploy from the master branch of this repo.
Any merge into the master will be tested by Netlify's CI.

### Numeral.js | [docs](http://numeraljs.com/)

```import numeral from "numeral";```


```numeral().format('')```
Note - props of the number type can be called within `numeral()`
[Possible formats](http://numeraljs.com/#format) for reference


### Ant Design | [docs](https://ant.design/docs/react/introduce)

To overwrite an ant-design class, use the `AntDesignOverride.css` file in `frontend/src/css/`.

For ant-design inline styles use `camelCase` (ie. `marginTop`, `fontSize`)
refer to https://reactjs.org/docs/dom-elements.html#style

#### Forms in Ant Design:
NB:
> If `<FormInput>` is wrapped in { getFieldDecorator }, must use ant-d `this.props.form.setFields()` to control state. 



---
# Backend

[Deployed database](https://job-board-backend.herokuapp.com/)

### Heroku

To push the latest changes to Heroku, push from a local master branch of this repo using `git push heroku master` with a properly authenticated Heroku account. An automated deploy script should make all necessary migrations on the connected PostgreSQL databse.

**If problems arise during deployment:**
>1. Make sure you are deploying from the master branch 
>2. If you want to deploy from a branch, run:
`git push heroku branchname:master`.
>3. Start a heroku bash: `heroku run bash`: \
>
>    `./manage.py makemigrations` \
>    `./manage.py makemigrations jobs` \
>    `./manage.py migrate` \
>    _To create Faker data_ in Heroku shell: \
>    `/manage.py shell` \
>    `/manage.py import seeder`


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