ALTER TABLE members
    ADD COLUMN IF NOT EXISTS tw_name VARCHAR(255) DEFAULT '',
    ADD COLUMN IF NOT EXISTS "tw_userName" VARCHAR(255) DEFAULT '',
    ADD COLUMN IF NOT EXISTS "tw_AvatarUrl" VARCHAR(255) DEFAULT '',
    ADD COLUMN IF NOT EXISTS tw_score VARCHAR(64) DEFAULT '0',
    ADD COLUMN IF NOT EXISTS tw_reward VARCHAR(64) DEFAULT '0',
    ADD COLUMN IF NOT EXISTS invite_code VARCHAR(64) DEFAULT '',
    ADD COLUMN IF NOT EXISTS invited_code VARCHAR(64) DEFAULT '';

CREATE INDEX IF NOT EXISTS member_invited_code_idx ON members (invited_code);
CREATE INDEX IF NOT EXISTS member_invite_code_idx ON members (invite_code);

CREATE TABLE IF NOT EXISTS invitation_log (
    id BIGSERIAL PRIMARY KEY,
    invited_address VARCHAR(255) NOT NULL,
    rewards BIGINT NOT NULL DEFAULT 0,
    created_time BIGINT NOT NULL DEFAULT 0,
    type BIGINT NOT NULL DEFAULT 0,
    creator_address VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS invitation_log_creator_address_idx ON invitation_log (creator_address);
CREATE INDEX IF NOT EXISTS invitation_log_invited_address_idx ON invitation_log (invited_address);
CREATE INDEX IF NOT EXISTS invitation_log_created_time_idx ON invitation_log (created_time);

CREATE TABLE IF NOT EXISTS trade_log (
    id BIGSERIAL PRIMARY KEY,
    trade_volume BIGINT NOT NULL DEFAULT 0,
    tx_hash VARCHAR(255) NOT NULL DEFAULT '',
    rewards BIGINT NOT NULL DEFAULT 0,
    created_time BIGINT NOT NULL DEFAULT 0,
    creator_address VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS trade_log_creator_address_idx ON trade_log (creator_address);
CREATE INDEX IF NOT EXISTS trade_log_created_time_idx ON trade_log (created_time);
CREATE INDEX IF NOT EXISTS trade_log_tx_hash_idx ON trade_log (tx_hash);
