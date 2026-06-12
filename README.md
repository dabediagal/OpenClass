# Virtual Classroom

A web application for managing a virtual classroom environment. It allows an admin to manage users (teachers and students) and subjects, while teachers and students can view the subjects they belong to along with their topics and attached materials.

## Features

- **Role-based access**: three user roles — `admin`, `teacher`, and `student`
- **Subject management**: create, edit, and delete subjects; add or remove users from them
- **Topic management**: add, edit, and delete topics within a subject, with optional PDF attachments
- **User management**: create and delete users; view user profiles
- **Cookie-based authentication**: sessions handled via HTTP-only cookies
- **Mustache templates**: server-side HTML rendering with `mustache-express`

## Tech Stack

- [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/)
- [Mustache Express](https://github.com/bryanburgers/node-mustache-express) for server-side templating
- [Multer](https://github.com/expressjs/multer) for PDF file uploads
- [OpenVidu Meet](https://openvidu.io/) for per-subject video call rooms
- [Nodemon](https://nodemon.io/) for development auto-reload

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm
- [Docker](https://www.docker.com/) (required for OpenVidu)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd proyecto-practicas
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

### Setting up OpenVidu

Each subject has a video call room powered by [OpenVidu Meet](https://openvidu.io/). You need Docker installed and the OpenVidu container running before starting the app.

Pull and run the OpenVidu Meet container:

```bash
docker run -d \
  --name openvidu \
  -p 9080:9080 \
  -e SERVER_API_KEY=meet-api-key \
  openvidu/openvidu-local-deployment:latest
```

The app connects to OpenVidu using the following environment variables (defaults shown):

| Variable | Default | Description |
|---|---|---|
| `OV_MEET_SERVER_URL` | `http://localhost:9080/meet` | Base URL of the OpenVidu Meet server |
| `OV_MEET_API_KEY` | `meet-api-key` | API key for authenticating requests |

You can override these by creating a `.env` file at the project root:

```env
OV_MEET_SERVER_URL=http://localhost:9080/meet
OV_MEET_API_KEY=your-api-key
```

### Running the app

**Development** (auto-reloads on file changes):

```bash
npm run watch
```

**Production**:

```bash
npm start
```

The server will start at [http://localhost:3000](http://localhost:3000).

## Default Seed Data

On startup the app seeds itself with demo data — no database setup needed. You can log in with any of the following accounts (all share the same password):

| Name | Email | Role | Password |
|---|---|---|---|
| Admin | admin@email.com | admin | 1234 |
| Ada Lovelace | adalovelace@email.com | teacher | 1234 |
| Alan Turing | alanturing@email.com | teacher | 1234 |
| Carlos Pérez | carlosperez@email.com | student | 1234 |
| Lucía Fernández | luciafernandez@email.com | student | 1234 |

> The admin account can see and manage all subjects and users. Teachers and students only see the subjects they are enrolled in.
