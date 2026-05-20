ALTER TABLE members
ADD COLUMN total_balance BIGINT NOT NULL DEFAULT 0,
ADD COLUMN twitter_balance BIGINT NOT NULL DEFAULT 0,
ADD COLUMN inviter INT;

CREATE INDEX "member_total_balance_idx" ON members ("total_balance");
CREATE INDEX "member_twitter_balance_idx" ON members ("twitter_balance");
CREATE INDEX "member_inviter_idx" ON members ("inviter");


CREATE TABLE "member_reward_transactions"
(
    "id"           BIGSERIAL     NOT NULL,
    "member_id"    INT           NOT NULL,
    "amount"       BIGINT        NOT NULL,
    "source"       VARCHAR(128)  NOT NULL,
    "details"      JSONB         NOT NULL,
    "created_at"   TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (id);

CREATE INDEX "member_reward_transactions_created_at_brin_idx" ON "member_reward_transactions" USING BRIN ("created_at");
CREATE INDEX "member_reward_transactions_member_source_idx" ON "member_reward_transactions" ("member_id", "source");

DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 0..99 LOOP
        EXECUTE format('
            CREATE TABLE "member_reward_transactions_%s" 
            PARTITION OF "member_reward_transactions" 
            FOR VALUES FROM (%s) TO (%s)',
            i,
            i * 1000000,
            (i + 1) * 1000000
        );
    END LOOP;
END $$;