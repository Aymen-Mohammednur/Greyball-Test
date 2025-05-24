# GreyBall Test - MMA Fighter and Event Management Platform

A full-featured backend system for managing mixed martial arts (MMA) fighters, events, statistics, rankings, and fight cards. Done as part of vetting process for Greyball.

Built using **NestJS**, **GraphQL**, **TypeORM**, and **PostgreSQL**, adhering to **CLEAN Architecture** principles.

---

## Features

### Fighter Management
- Create, update, delete fighters
- Personal details: name, nickname, weight class, height, nationality, date of birth, etc...
- Real-time ranking and statistics tracking
- Fight history with outcomes, methods, and opponents

### Fight Management
- Create fights under an event
- Assign fighters, winner, method (KO, Submission, Decision)
- Automatically update fighter stats

### Event Management
- Schedule events with location and date
- Manage fight cards (fights + participants)
- Query upcoming events with full card listings

### Rankings System
- Points-based ranking plus activity multiplier (see below for details)
- Rankings auto-update using a background cron job

---

## Architecture

This project follows **CLEAN Architecture**:

```

src/
├── domain/               # Core business logic (e.g. ranking service)
├── application/          # Use-cases (create/update/query logic)
├── infrastructure/       # DB entities and TypeORM implementations
├── presentation/         # GraphQL resolvers, DTOs, validation

````


## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- npm or yarn

### Install dependencies

```bash
npm install
````

### Configure environment

```bash
cp .env.example .env
# Then edit .env with DB credentials
```

### Start the dev server

```bash
npm run start:dev
```

---

## GraphQL API Usage

Visit GraphQL Apollo Server: `http://localhost:3000/graphql`

---

### Create a Fighter

```graphql
mutation {
  createFighter(input: {
    firstName: "Jon"
    lastName: "Jones"
    nickname: "Bones"
    weightClass: "Heavyweight"
    dateOfBirth: "1987-07-19"
    gender: "male"
    heightCm: 193
    nationality: "USA"
  }) {
    id
    nickname
  }
}
```

---

### Get Fighter Profile (Stats + History)

```graphql
query {
  getFighterProfile(id: "fighter-uuid") {
    nickname
    rank
    rankingPoints
    winPercentage
    fightHistory {
      fightId
      opponent {
        nickname
      }
      method
      result
      fightDate
    }
  }
}
```

---

### Record Fight Result

```graphql
mutation {
  recordFightResult(input: {
    fightId: "fight-uuid"
    winnerId: "fighter-uuid"
    method: "ko"
    resultSummary: "Left hook KO in round 7"
  }) {
    id
    roundCount
    completed
    winner {
      firstName
      lastName
      nickname
    }
  }
}
```

---

### Get Upcoming Events + Fight Cards

```graphql
query {
  getUpcomingEvents {
    name
    eventDate
    fightCount
    fights {
      participants {
        corner
        fighter {
          nickname
          weightClass
        }
      }
    }
  }
}
```

---

### Get Top Ranked Fighters

```graphql
query {
  getTopRankedFighters(weightClass: "Lightweight", limit: 5) {
    nickname
    rank
    rankingPoints
  }
}
```

---
### Rest of the APIs in the system

| API Name               | Function                                                     |
| ---------------------- | ------------------------------------------------------------ |
| `createFighter`        | Create a new fighter profile                                 |
| `updateFighter`        | Update an existing fighter                                   |
| `deleteFighter`        | Delete a fighter                                             |
| `getFighterProfile`    | Retrieve fighter statistics and full fight history           |
| `getTopRankedFighters` | Get top fighters in a weight class based on dynamic rankings |
| `triggerRankingUpdate` | Manually trigger full fighter rankings recalculation         |
| `createEvent`          | Create a new event                                           |
| `updateEvent`          | Update event details (date, location, name)                  |
| `deleteEvent`          | Delete an event                                              |
| `getAllEvents`         | List all events (past and future)                            |
| `getUpcomingEvents`    | List only future events with their fight cards               |
| `createFight`          | Create a fight and assign participants                       |
| `updateFight`          | Update fight method/result summary before completion         |
| `deleteFight`          | Delete a fight                                               |
| `getAllFights`         | Retrieve all fights in the system                            |
| `getFightById`         | Retrieve a single fight with participants                    |
| `recordFightResult`    | Record outcome of a fight and trigger ranking update         |


---

## Ranking Algorithm Explained

Fighter rankings are computed using a point-based performance model with an activity multiplier. This allows the system to reflect both skill and recency of performance, rewarding fighters who win impressively and stay active.

### Base Points
Each fighter earns a base score depending on the outcome of their recorded fights. These are accumulated across all fights. This rewards not only winning, but how they win.



| Result Type       | Points |
| ----------------- | ------ |
| KO/Submission Win | 5      |
| Decision Win      | 3      |
| Draw              | 1      |
| Loss              | 0      |

### Activity Multiplier
To encourage consistent competition and prevent rank inflation by inactivity, each fighter’s base score is multiplied by an activity factor derived from their last fight date. This ensures fighters who win but stop competing get demoted gradually and fighters who stay active climb the rankings fast.

| Days Since Last Fight | Multiplier |
| --------------------- | ---------- |
| 0–30 days             | ×1.2       |
| 31–90 days            | ×1.0       |
| 91–180 days           | ×0.8       |
| 180+ days             | ×0.5       |

This ensures our ranking system is robust and tie's don't happen often.

### Tiebreaker Logic

If still multiple fighters have the same score, their rank is determined by their `win percentage`. On the very rare occasion that even after their win percentage the fighters are tied then nicknames are used as a final fallback to guarantee deterministic ranking.

---

## Background Jobs

The system automatically recalculates fighter rankings every hour using a background cron job. Ensures fighters are ranked consistently over time, even if no recent rankings were made manually.

- **Job:** `@Cron(EVERY_HOUR)`
- **Fallback:** A manual mutation `triggerRankingUpdate()` is available for instant recalculation

---

* The SQL scripts to create the tables can be found in the root directory under the name `schema.sql` or you can click [here](https://github.com/Aymen-Mohammednur/greyball-test/schema.sql).
* The `ER Diagram` to view the relationships between the entities in the database can be found in the root directory under the name `ER Diagram.pdf` or you can click [here](https://lucid.app/lucidchart/f474a44b-43f1-4417-a1c5-b741e4788732/view).

**Made with ❤️ by Aymen**