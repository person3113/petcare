INSERT INTO users (id, email, password_hash, nickname, oauth_provider, oauth_id, created_at, updated_at)
VALUES (1, 'test1@petcare.com', 'hash_sample', 'tester1', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO shelters (care_reg_no, care_nm, org_nm)
VALUES ('S001', 'Seoul Shelter', 'Seoul Org');

INSERT INTO animals (desertion_no, care_reg_no, care_nm, process_state)
VALUES ('A001', 'S001', 'Seoul Shelter', '보호중');

INSERT INTO favorites (id, user_id, desertion_no, created_at)
VALUES (1, 1, 'A001', CURRENT_TIMESTAMP);
