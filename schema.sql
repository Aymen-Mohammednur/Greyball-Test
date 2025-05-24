CREATE TABLE fighters
(
    id uuid NOT NULL DEFAULT uuid_generate(),
    "firstName" character NOT NULL,
    "lastName" character NOT NULL,
    "nickname" character NOT NULL,
    "weightClass" character NOT NULL,
    "wins" integer NOT NULL DEFAULT 0,
    "losses" integer NOT NULL DEFAULT 0,
    "draws" integer NOT NULL DEFAULT 0,
    "knockouts" integer NOT NULL DEFAULT 0,
    "submissions" integer NOT NULL DEFAULT 0,
    "createdAt" timestamp without time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp without time zone NOT NULL DEFAULT now(),
    "heightCm" integer NOT NULL,
    "dateOfBirth" timestamp without time zone NOT NULL,
    "rankingPoints" integer NOT NULL DEFAULT 0,
    "rank" integer NOT NULL DEFAULT 0,
    "lastFightDate" timestamp without time zone,
    "decisions" integer NOT NULL DEFAULT 0,
    CONSTRAINT PRIMARY KEY (id)
)

CREATE TABLE fights
(
    id uuid NOT NULL DEFAULT uuid_generate(),
    "eventId" uuid NOT NULL,
    "roundCount" integer NOT NULL,
    "method" character,
    "resultSummary" character,
    "winnerId" uuid,
    "completed" boolean NOT NULL DEFAULT false,
    CONSTRAINT PRIMARY KEY (id),
    CONSTRAINT FOREIGN KEY ("winnerId") REFERENCES public.fighters (id)
    CONSTRAINT FOREIGN KEY ("eventId") REFERENCES public.events (id) ON DELETE CASCADE
)

CREATE TABLE events (
    id uuid NOT NULL DEFAULT uuid_generate(),
    "name" character NOT NULL,
    "location" character NOT NULL,
    "eventDate" timestamp without time zone NOT NULL,
    CONSTRAINT PRIMARY KEY (id)
)

CREATE TABLE fight_participants (
    id uuid NOT NULL DEFAULT uuid_generate(),
    "fightId" uuid NOT NULL,
    "fighterId" uuid NOT NULL,
    "corner" character NOT NULL,
    "isWinner" boolean,
    CONSTRAINT PRIMARY KEY (id),
    CONSTRAINT FOREIGN KEY ("fighterId") REFERENCES fighters (id)
    CONSTRAINT FOREIGN KEY ("fightId") REFERENCES fights (id) ON DELETE CASCADE
)
