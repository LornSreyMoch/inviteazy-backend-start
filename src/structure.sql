CREATE TABLE invitees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id),
    user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50),
    qr_code TEXT,
    is_checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO public.invitees(
	id, event_id, user_id, status, qr_code, is_checked_in, checked_in_at, created_at)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id SERIAL NOT NULL REFERENCES users(id),
    event_name VARCHAR(255) NOT NULL,
    event_datetime TIMESTAMP NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO public.events(
	id, user_id, event_name, event_datetime, event_location, event_description, created_at, updated_at)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?);
INSERT INTO public.events(
user_id, event_name, event_datetime, event_location, event_description)
VALUES (1, 'WEDDING', '2025-06-10 14:00:00', 'PP CAMBODIA', NULL);


CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    profile_picture TEXT,
    address TEXT
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);