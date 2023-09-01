# taskwizard
![lastcommit](https://img.shields.io/github/last-commit/eding888/taskwizard/main)
![issues](https://img.shields.io/github/issues/eding888/taskwizard)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
![GitHub all releases](https://img.shields.io/github/downloads/eding888/taskwizard/total)
![taskwizard](https://i.ibb.co/5F9p1T9/logo-no-background.png)


An adaptive, innovative and easy to use task management website encouraging consistency and discouraging procrastination.

Allows users to create tasks for certain days of the week. These tasks can be fufilled daily by either fufilling the time or count requirement. These tasks can either be recurring weekly tasks with a certain goal time for each week, or specific deadline tasks with an allotment for how long one will spend working on the task. Any unused or uncompleted time for these tasks will be 'in debt', and will be allocated spread over future days.

Also allows users to add each other a friends, allowing them to view each others weekly tasks, as well as a live view of what tasks they are accomplishing/working on currently thanks to the use of Socket.io.

Utilizes React for the frontend and Node, Express and Mongodb for the backend.
Incorporates various security measures to prevent common web attacks:
 - DOMPurify is used for every user input to prevent XSS. There are also sanitzation measures on the backend to ensure nothing gets through.
 - CSRF tokens are given every session to prevent CSRF attacks.
 - Cookies are stored with secure and httponly headers.
 - Cors headers are properly set.
 - Auth tokens and refresh tokens are used.
