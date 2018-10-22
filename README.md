# We Don't Need No Education

_A Job board for people without college degrees_

[Visit Site](https://www.openjobsource.com/)

[Demo](https://www.youtube.com/watch?v=eSk4lympLVg&feature=share)

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

If you would like to add to the project, take a look at our currently opened [issues](https://github.com/Lambda-School-Labs/CS10-job-board/issues), or submit an issue.

**Make sure to always pull the latest master branch before submitting a PR.**
- - -

    Development Environment:
    pip 18.0
    Python 3.6.6
    Django 2.1.1
    React 16.5.0

A full list of server dependencies can be found in [requirements.txt](https://github.com/Lambda-School-Labs/CS10-job-board/blob/master/requirements.txt)

Client dependencies can be found in [package.json](https://github.com/Lambda-School-Labs/CS10-job-board/blob/master/frontend/package.json)

### Workflow in Django
 1. Run `pipenv install`, `pipenv shell` to create a virtual environment
 2. Run inside virtural environment: \
  `./manage.py makemgrations` \
  `/.manage.py makemigrations jobs`\
  `/.manage.py migrate` \
  to create tables in SQLite3 database file `db.sqlite3` 
 3. Run `/manage.py runserver` to start the development server


_**NB:**_

Python 3.6.6:
> Make sure pipenv python version is 3.6.6 by running `python --version` inside virtual environment
> - If python version is different, you can install 3.6.6 with `pipenv install --python3.6.6`. Make sure to have python3.6.6 installed on your local machine before attempting this command. [Download Python3.6.6](https://www.python.org/downloads/release/python-366/)

Adding Dependencies:

>When adding dependencies with `pip install`, make sure to add the dependency to the `requirements.txt`, with a specific version.

#### When downloading a newer version of the app with modified dependencies:
1.  delete the `Pipfile` and `Pipfile.lock`
2.  use the command `pipenv install -r requirements.txt`
3.  Check the `python_version` in the newly generated `Pipfile` to make sure it is `3.6.6`. If not manually change it, and run `pipenv install` to update the lock file.
4.  Run python migration commands in `pipenv shell`:

    `./manage.py makemigrations` \
    `./manage.py makemigrations jobs` \
    `./manage.py migrate`

### Workflow in React

>Run `yarn install` & `yarn start` in `/frontend` to start a development server.

---
# Frontend


Netlify is configured to deploy from the `deployed_live_site` branch of this repo.
Any pull request made to the project will be tested by Netlify's CI.

### Architecture & Components

#### Export / Import
##### _Components_
- All components are exported from `src/components/index.js`
- To import a component inside another component, import directly from this `index.js` file. ie. `import { Example } from '../'`. If components are in the same directory, still import from index.js instead of `'./'`.
- Use single quotes for imports, ie `from 'react'`.
- Avoid nesting folders more than one level inside `src/components/`
 ##### _CSS_
- All CSS files are imported into `src/css/index.css`
- `index.css` is then imported into `App.js`
- _No need to import CSS files directly into a component at all._

#### Naming Convention
- Avoid plural component names, i.e. `Jobs`; instead add a qualifier or none at all. For `Jobs`, instead choose `JobList`.
- Avoid using `View` qualifier, if possible, because it is too vague. For `JobView`, choose `Job` instead. \
 **Exception:** `TagView` is used in this project because ant-design has an existing `Tag` Component we are using, and you cannot have duplicate component names.
- Folder names correspond to use case or user type.
- Any component relating to only a company user, should begin with `Company`
- Naming convention:
    - `Thing` 
    
        > _Choose a default name (unqualified name) wisely - good rule of thumb is make the default view the most complete view, in terms of data._ 
    - `ThingView` if multiple views exist of a `Thing` 
        > ie `Job` and `JobList`/ `JobPreview`
    - `UserThing` in the case of `Company`. 
        > _The default user for this project is a Job Seeker; a component without a `User` is assumed to be the default_
    - `UserThingView` if multiple views exist of a `UserThing`

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

Heroku is configured to deploy directly from this repository. The branch `deployed_live_site` is reserved for this purpose.

The `master` branch should contain the latest features, while the `deployed_live_site` branch should be the latest stable release.

To push the latest stable changes to Heroku:

 1. `git checkout deployed_live_site`  (NO `-b` flag)
 2. `git pull` from `deployed_live_site` to pull all changes not updated on local machine
 3. `git pull origin master` to pull in changes from the `master`
 4. `git push` to upload to branch
 5. In the Heroku app dashboard, navigate to the `Deploy` tab. At the bottom is the option `Manual Deploy`. Select the branch `deployed_live_site`, and click the `Deploy Branch` button. 

**If problems arise during deployment:**
>
>- Start a heroku bash: `heroku run bash -a job-board-backend` after loggin in to Heroku CLI with an autheticated account: 
>
>    `./manage.py makemigrations` \
>    `./manage.py makemigrations jobs` \
>    `./manage.py migrate` 
>- **_Last resort_**: reset DB data: \
>   Click on `Resources` tab \
>   Click on `Heroku Postgres :: Database` \
>   Click on `Settings` in new window pop up \
>   Click `Reset Database` (deletes all data)

**Adding Faker data in Heroku:**

>- Start a heroku bash: `heroku run bash -a job-board-backend` after loggin in to Heroku CLI with an autheticated account: \
>    `./manage.py shell` \
>   `./manage.py import seeder`
>


### Jobs API

[Notes on models](jobs/notes/MODELS.md)

- `/api/jobs/` returns a limited view of the 10 most recent jobs, sorted by publishing date in descending order (most recently published is first). 

    >Accepts GET requests from both authenticated and       non-authenticated users.
- `/api/jobs/:id/` returns a specific job. 

    >Accepts GET requests from both authenticated and non-authenticated users.
    
- `/api/company/jobs/` returns a list of jobs posted by a user, in descending order (most recently published is first). 

    >Accepts GET and POST requests from authenticated users. 
- `/api/company/jobs/:id/` returns a specific job. 

    >Accepts GET requests from any authenticated user. \
    >Accepts PUT, PATCH, and DELETE requests from authenticated users whose id matches the `company` id field on the returned job.

### User API

- `/api/account/:id` returns a specific user.
    >Accepts GET, PATCH, DELETE requests from authenticated users whose id matches the id of the user.

### Auth API

*Dependency: **djoser_views***
- `/api/register/` Creates a new User, using Djoser to handle activation email. Required fields: `email` & `password`

*Dependency: **rest_framework_jwt***
- `/api/login/` Generates a new token. Required fields: `email` & `password`
- `/api/login/refresh/` Refreshes existing valid token. Refresh delta is set at a maximum of 7 days, before invalidating the original token. Required fields: `token`
- `/api/login/verify/` Verifies token validity. Required fields: `token`
- `/api/logout/all/` Creates a new JWT secret signature field on a User instance, which invalidates all existing tokens signed by previous secret. Accepts a POST request with an empty object. Request object must have the User requesting logout to be authenticated when accessing this API route. 

## Dependencies:

###  Factory Boy: generating job post data: [DOCS](https://factoryboy.readthedocs.io/en/latest/)
###  Faker: generating job post data: [DOCS](https://faker.readthedocs.io/en/master/)


> NB:  If data models have changed, make migrations or delete development database and migration folder, and run migrations commands.

*To create data:*

    > pipenv shell
    > ./manage.py shell
    >>> import seeder
    >>> exit()

`seeder.py` contains the data configuration.
`fakerdata.py` creates classes with `factory-boy` to create classes

### Running Tests

[Notes on tests goals](jobs/notes/TESTS.md)
1. Django-pytest
2. Enzyme
