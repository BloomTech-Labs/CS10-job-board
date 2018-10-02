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

### Using ant-design

To overwrite an ant-design class, use the `AntDesignOverride.css` file in `frontend/src/css/`.

For ant-design inline styles use `camelCase` (ie. `marginTop`, `fontSize`)
refer to https://reactjs.org/docs/dom-elements.html#style

# Backend

[Deployed database](https://job-board-backend.herokuapp.com/)

To push the latest changes to Heroku, push from a local master branch of this repo using `git push heroku master` with a properly authenticated Heroku account.

### Jobs API

- `/api/jobs` returns a limited view of the 10 most recent jobs, sorted by publishing date in descending order (latest published first). It only accepts a GET request.
- `/api/addjob` accepts a POST request to create a new Job.
- `/api/jobs/:id` returns a specific job, and accepts PUT, and DELETE requests.

## Dependencies:

###  Faker: generating job post data: [DOCS](https://faker.readthedocs.io/en/master/)

> NB:  If data models have changed, make migrations or delete development database and migration folder, and run migrations commands.

*To create data:*

    > pipenv shell
    > ./manage.py shell
    >>> import seeder
    >>> exit()

`seeder.py` contains the data configuration.

