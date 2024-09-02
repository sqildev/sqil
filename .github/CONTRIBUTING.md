# How to Contribute?
Thanks for you interest in being a part of our mission!
Please review [Making and Submitting Changes](#making-and-submitting-changes) to learn how to properly contribute to Sqil's frontend, backend, or resolving bugs. Or, simply report a bug!<br />

Also, [join our Slack](https://join.slack.com/t/sqilworkspace/shared_invite/zt-2ptm4ft9u-ecqBBSNMolnZGQWbCL8NbA) to contact us! This is the easiest way to communicate with us.

**Ways to contribute:**
- [Frontend](#contributing-to-frontend)
- [Backend](#contributing-to-backend)
- [Reporting Bugs](#reporting-bugs)
- [Resolving Bugs](#resolving-bugs)
# Please Read Before Submitting Changes!
While you may start up the frontend individually while developing, to test this application as a whole, you MUST install Docker Desktop. Additionally, backend development requires Docker since this is how the database and code compiler is run. [Follow these instructions to install](https://docs.docker.com/desktop/). <br /> <br />
Make sure that you have tested the website to ensure that it works as intended before submitting any changes. You can build the website with Docker by running:
```bash
cd /sqil
docker compose -f compose-dev.yaml build
docker compose -f compose-dev.yaml up
```
Go to http://localhost:3000 and test your changes! If it works as intended, you are ready to [submit your changes](#push-changes-to-github).

# Making and Submitting Changes
## Fork this repository
Click the fork button on the top of the page to create a copy of this repository in your account. <br />
![Fork](img/fork.png)

## Clone this repository
Open a terminal and run the following git command:
```bash
git clone https://github.com/username/sqil.git
```
Ensure that `username` is the username of the account you just forked this repository from.

## Create a branch
Change repository directory:
```bash
cd sqil
```
Create a branch to make changes:
```bash
git switch -c your-new-branch-name
```
Ensure that `your-new-branch-name` is relevant to your contribution. <br />


## Make changes and commit
```bash
git commit -m "Add sqil contribution"
```
Ensure that your commit meets the [Commit Message Guidelines](https://gist.github.com/robertpainsi/b632364184e70900af4ab688decf6f53).

## Push changes to GitHub
```bash
git push -u origin your-new-branch-name
```
Ensure that `your-new-branch-name` matches the branch you created earlier.

## Submit your changes for review
Click `Compare & pull request`. <br /> <br />
![Fork](img/Pull_Request.png)

Now, follow the guidelines for [Submitting changes to frontend](#contributing-to-frontend), [Submitting changes to backend](#contributing-to-backend), or [Resolving Bugs](#resolving-bugs), depending on your contribution.

# Contributing to Frontend
## Submitting changes to frontend
When submitting a pull request, please give us a thorough description of your contribution:
- Write a clear and descriptive title for the feature added or the issue resolved.
- List the pages or components you added or modified.

You are now ready to submit your pull request. We will review it as soon as possible! Thanks for your contribution.

# Contributing to Backend
The backend api is written in Python, using the Flask framework and SQLAlchemy for PostgreSQL queries.
To start up the backend, you must have Docker installed and running. Review [Please Read Before Submitting Changes!](#please-read-before-submitting-changes) if you have not already done so.

The backend can be started with the following commands:
```bash
cd /sqil
docker compose -f compose-dev.yaml build api
docker compose -f compose-dev.yaml up api
```
Once the container is running, you should be able to send api requests to any route with the base URL http://localhost:5000.

It is strongly recommended that you download the [Postman app](https://www.postman.com/downloads/) for testing api routes.

### JWT Authentication
Most routes are protected by JWT tokens. These tokens are stored in a cookie on the browser when the user logs in or registers.

Therefore, when testing you must register a new user or login with an existing user to obtain a JWT token to  use other routes. You can do this in Postman like so:

![Register](img/Register.png)

We never send raw data. You must go to https://jwt.io/ to decode the jwt token data. Paste the response you get from Postman, and you should see the JWT authentication token upon logging in or registering.

![Authentication](img/Authentication.png)

You may now copy and use this token while testing routes for as long as this container is running. For example, if I am testing the /course api route to see the list of programming courses, I must first go the **Authorization** tab in postman, select **Bearer Token** for **Auth Type**, and paste the JWT authentication token here.

![Courses](img/Courses.png)

After clicking the **Send** button, the response should proceed and not raise a "Missing Authorization Header" message.

### Questions?
Don't forget that we have a [Slack](https://join.slack.com/t/sqilworkspace/shared_invite/zt-2ptm4ft9u-ecqBBSNMolnZGQWbCL8NbA)! If you have trouble testing the backend, please reach out to `@Krish Kapoor` for help.

## Submitting changes to backend
When submitting a pull request, please give us a thorough description of your contribution:
- Write a clear and descriptive title for the feature added or issue resolved.
- List the api routes you added or modified.

You are now ready to submit your pull request. We will review it as soon as possible! Thanks for your contribution.

# Reporting Bugs 
![Bug](img/Bug.png)
- Apply the "bug", "backend" or "frontend," and any other fitting labels.
- Write a clear and descriptive title for the issue.
- State whether you are resolving the issue or simply reporting it.
  - If you are resolving the issue yourself, assign yourself to "Assignees"
- Describe the steps which produce the problem.
- Describe the incorrect behavior.
- Explain the expected behavior.

Click **Submit new issue**!

# Resolving Bugs
- Reply to the issue you are working on fixing. Do not work on an issue someone is already working on.
- Follow the instructions for [Making and Submitting Changes](#making-and-submitting-changes) and either [Contributing to Frontend](#contributing-to-frontend) or [Contributing to Backend](#contributing-to-backend), depending on the issue.
- Title your Pull Request "Fix: `issue`", where `issue` is the exact title of the issue you are resolving.

We will review your changes as soon as possible!