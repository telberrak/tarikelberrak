create table revoked_tokens (
    jti uuid primary key,
    expires_at timestamptz not null
);

-- Lets us skip rows for already-expired tokens without a full scan when
-- periodically pruning (see RevokedTokenService).
create index revoked_tokens_expires_at_idx on revoked_tokens (expires_at);
