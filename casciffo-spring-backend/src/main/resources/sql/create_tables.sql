
---------------------------------------------------------------------------------------
---------------------------------STATE AND USER ROLES----------------------------------
---------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_account (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR NOT NULL,
    user_email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    user_role_id INT,
    CONSTRAINT fk_user_role_id FOREIGN KEY(user_role_id) REFERENCES user_role(role_id)
);


CREATE TABLE IF NOT EXISTS user_notification (
    notification_id SERIAL PRIMARY KEY,
    notified_user INT NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    CONSTRAINT fk_notified_user FOREIGN KEY(notified_user) REFERENCES user_account(user_id)
);


CREATE TABLE IF NOT EXISTS states (
    state_id SERIAL PRIMARY KEY,
    state_name VARCHAR NOT NULL UNIQUE,
    role_responsible_for_advancing_id INT NOT NULL,
    CONSTRAINT fk_role_id FOREIGN KEY(role_responsible_for_advancing_id) REFERENCES user_role(role_id)
);

CREATE TABLE IF NOT EXISTS state_transition (
    id SERIAL PRIMARY KEY,
    transition_type VARCHAR NOT NULL,
    reference_id INT NOT NULL, --id referencing to the type addenda/proposal/research
    state_id_before INT NOT NULL,
    state_id_after INT NOT NULL,
    transition_date TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_state_before FOREIGN KEY (state_id_before) REFERENCES states(state_id),
    CONSTRAINT fk_state_after FOREIGN KEY (state_id_after) REFERENCES states(state_id)
);

---------------------------------------------------------------------------------------
-----------------------------------------FILES-----------------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS files (
    file_id SERIAL PRIMARY KEY,
    file_name VARCHAR NOT NULL,
    file_path TEXT NOT NULL,
    file_size INT NOT NULL
);

---------------------------------------------------------------------------------------
---------------------------------PROPOSAL INFORMATION----------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS pathology (
    pathology_id SERIAL PRIMARY KEY,
    pathology_name VARCHAR
);


CREATE TABLE IF NOT EXISTS service (
    service_id SERIAL PRIMARY KEY,
    service_name VARCHAR
);

CREATE TABLE IF NOT EXISTS therapeutic_area (
    therapeutic_area_id SERIAL PRIMARY KEY,
    therapeutic_area_name VARCHAR
);


CREATE TABLE IF NOT EXISTS proposal (
    proposal_id SERIAL PRIMARY KEY,
    state_id INT NOT NULL,
    pathology_id INT NOT NULL,
    service_id INT NOT NULL,
    therapeutic_area_id INT NOT NULL,
    protocol_state_id INT,
    sigla VARCHAR NOT NULL,
    principal_investigator_id INT NOT NULL,
    proposal_type VARCHAR NOT NULL, --clinical trial / observational study
    date_created TIMESTAMP DEFAULT NOW(),
    last_update TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_state_id FOREIGN KEY(state_id) REFERENCES states(state_id),
    CONSTRAINT fk_pathology_id FOREIGN KEY(pathology_id) REFERENCES pathology(pathology_id),
    CONSTRAINT fk_service_id FOREIGN KEY(service_id) REFERENCES service(service_id),
    CONSTRAINT fk_therapeutic_area_id FOREIGN KEY(therapeutic_area_id) REFERENCES therapeutic_area(therapeutic_area_id),
    CONSTRAINT fk_protocol_state FOREIGN KEY(protocol_state_id) REFERENCES states(state_id),
    CONSTRAINT fk_principal_investigator FOREIGN KEY(principal_investigator_id) REFERENCES user_account(user_id)
);


-- CREATE TABLE IF NOT EXISTS proposal_state_transitions (
--     id SERIAL PRIMARY KEY,
--     proposal_id INT,
--     state_transition_id INT,
--     CONSTRAINT fk_proposal_id FOREIGN KEY (proposal_id)
--         REFERENCES proposal(proposal_id) ON DELETE CASCADE,
--     CONSTRAINT fk_state_transition_id FOREIGN KEY (state_transition_id) REFERENCES state_transition(id)
-- );


CREATE TABLE IF NOT EXISTS proposal_files (
    id SERIAL PRIMARY KEY,
    proposal_id INT,
    file_id INT,
    CONSTRAINT fk_proposal_id FOREIGN KEY(proposal_id)
        REFERENCES proposal(proposal_id) ON DELETE CASCADE,
    CONSTRAINT fk_file_id FOREIGN KEY(file_id) REFERENCES files(file_id)
);


CREATE TABLE IF NOT EXISTS proposal_comments (
    comment_id SERIAL PRIMARY KEY,
    proposal_id INT NOT NULL,
    author_id INT NOT NULL,
    date_created TIMESTAMP DEFAULT NOW(),
    date_modified TIMESTAMP,
    content TEXT NOT NULL,
    comment_type VARCHAR NOT NULL,
    CONSTRAINT fk_proposal_id FOREIGN KEY(proposal_id)
        REFERENCES proposal(proposal_id) ON DELETE CASCADE,
    CONSTRAINT fk_author_id FOREIGN KEY(author_id) REFERENCES user_account(user_id)
);

CREATE TABLE IF NOT EXISTS timeline_event (
    event_id SERIAL PRIMARY KEY,
    proposal_id INT NOT NULL,
    event_type VARCHAR NOT NULL, -- deadline / states transition
    event_name VARCHAR NOT NULL,
    deadline_date DATE NOT NULL,
    completed_date DATE,
    is_over_due BOOLEAN DEFAULT FALSE,
    days_over_due INT DEFAULT 0,
    CONSTRAINT  fk_proposal_id FOREIGN KEY(proposal_id)
        REFERENCES proposal(proposal_id) ON DELETE CASCADE
);

---------------------------------------------------------------------------------------
---------------------------------INVESTIGATION TEAM------------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS investigation_team (
    team_id SERIAL PRIMARY KEY,
    proposal_id INT NOT NULL,
    member_role VARCHAR(50) NOT NULL,
    member_id INT NOT NULL,
    CONSTRAINT fk_member FOREIGN KEY (member_id) REFERENCES user_account(user_id),
    CONSTRAINT fk_proposal FOREIGN KEY (proposal_id)
        REFERENCES proposal(proposal_id) ON DELETE CASCADE
);


---------------------------------------------------------------------------------------
-----------------------PROPOSAL FINANCIAL INFORMATION----------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS promoter (
    promoter_id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    promoter_type VARCHAR NOT NULL,
    email VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS proposal_financial_component (
    proposal_financial_id SERIAL PRIMARY KEY,
    proposal_id INT,
    financial_contract_id INT,
    promoter_id INT,
    CONSTRAINT fk_proposal_id FOREIGN KEY(proposal_id) REFERENCES proposal(proposal_id) ON DELETE CASCADE,
    CONSTRAINT fk_financial_contract_id FOREIGN KEY (financial_contract_id) REFERENCES files(file_id),
    CONSTRAINT fk_promoter_id FOREIGN KEY(promoter_id) REFERENCES promoter(promoter_id)
);

CREATE TABLE IF NOT EXISTS partnerships (
    partnership_id SERIAL PRIMARY KEY,
    proposal_financial_id INT,
    icon_url TEXT,
    spokesman_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone_contact VARCHAR,
    site_url TEXT
);


---------------------------------------------------------------------------------------
----------------------------------CLINICAL RESEARCH------------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS clinical_research (
    research_id SERIAL PRIMARY KEY,
    proposal_id INT NOT NULL,
    research_state VARCHAR,
    eudra_ct VARCHAR,
    sample_size INT,
    duration INT,
    cro VARCHAR,
    start_date DATE,
    end_date DATE,
    estimated_end_date DATE,
    industry VARCHAR,
    protocol VARCHAR,
    initiative_by VARCHAR,
    phase VARCHAR, -- phase 1 | 2 | 3 | 4 
    CONSTRAINT fk_proposal_id FOREIGN KEY(proposal_id)
        REFERENCES proposal(proposal_id) ON DELETE CASCADE,
    CONSTRAINT fk_state_id FOREIGN KEY(research_state) REFERENCES states(state_name)
);

-- CREATE TABLE IF NOT EXISTS research_state_transitions (
--     id SERIAL PRIMARY KEY,
--     research_id INT NOT NULL,
--     state_transition_id INT NOT NULL,
--     motive text NOT NULL, -- reason for canceling / reason for starting such as SIV completed
--     --PRIMARY KEY (research_id, state_transition_id),
--     CONSTRAINT fk_research_id FOREIGN KEY (research_id)
--         REFERENCES clinical_research(research_id) ON DELETE CASCADE,
--     CONSTRAINT fk_state_transition_id FOREIGN KEY (state_transition_id) REFERENCES state_transition(id)
-- );


CREATE TABLE IF NOT EXISTS dossier (
    dossier_id SERIAL PRIMARY KEY,
    clinical_research_id INT,
    volume VARCHAR NOT NULL,
    label VARCHAR NOT NULL,
    amount INT NOT NULL,
    CONSTRAINT fk_clinical_research FOREIGN KEY(clinical_research_id)
        REFERENCES clinical_research(research_id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS scientific_activities (
    activity_id SERIAL PRIMARY KEY,
    research_id INT NOT NULL,
    date_published DATE,
    author VARCHAR,
    paper_name VARCHAR,
    volume VARCHAR,
    volume_number INT,
    paper_num_pages INT,
    country_published VARCHAR,
    has_been_indexed BOOLEAN,
    published_url TEXT,
    CONSTRAINT fk_research_id FOREIGN KEY(research_id)
        REFERENCES clinical_research(research_id)
        ON DELETE CASCADE
);

---------------------------------------------------------------------------------------
--------------------------------RESEARCH PARTICIPANTS----------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS participant (
    process_id BIGINT PRIMARY KEY,
    full_name VARCHAR NOT NULL,
    gender VARCHAR NOT NULL,
    age INT NOT NULL
);


CREATE TABLE IF NOT EXISTS research_participants (
    id SERIAL PRIMARY KEY,
    participant_id BIGINT,
    research_id INT,
    join_date TIMESTAMP DEFAULT NOW(),
    --PRIMARY KEY (participant_id, research_id),
    CONSTRAINT fk_research_id FOREIGN KEY(research_id)
        REFERENCES clinical_research(research_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_participant_id FOREIGN KEY(participant_id) REFERENCES participant(process_id)
);


---------------------------------------------------------------------------------------
------------------------------------TRIAL VISITS---------------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS clinical_visit (
    visit_id SERIAL PRIMARY KEY,
    research_id INT,
    participant_id INT,
    visit_type VARCHAR NOT NULL,
    scheduled_date TIMESTAMP NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    periodicy VARCHAR,
    observations TEXT,
    hasAdverseEventAlert BOOLEAN,
    has_marked_attendance BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_research_id FOREIGN KEY(research_id)
        REFERENCES clinical_research(research_id) ON DELETE CASCADE,
    CONSTRAINT fk_participant_id FOREIGN KEY(participant_id) REFERENCES participant(process_id)
);


CREATE TABLE IF NOT EXISTS visit_assigned_investigators (
    id SERIAL PRIMARY KEY,
    visit_id INT NOT NULL,
    investigator_id INT NOT NULL,
    --PRIMARY KEY (visit_id, investigator_id),
    CONSTRAINT fk_visit_id FOREIGN KEY(visit_id)
        REFERENCES clinical_visit(visit_id) ON DELETE CASCADE,
    CONSTRAINT fk_investigator_id FOREIGN KEY(investigator_id) REFERENCES user_account(user_id)
);

---------------------------------------------------------------------------------------
------------------------CLINICAL TRIAL FINANCIAL COMPONENTS----------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS trial_financial_component (
    financial_id SERIAL PRIMARY KEY,
    research_id INT,
    value_per_participant INT,
    role_value_per_participant INT,
    balance FLOAT,
    CONSTRAINT fk_research_id FOREIGN KEY(research_id)
        REFERENCES clinical_research(research_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS research_team_financial_scope (
    team_finance_id SERIAL PRIMARY KEY,
    trial_financial_component_id INT,
    investigator_id INT, 
    type_of_flow VARCHAR NOT NULL,
    transaction_date TIMESTAMP DEFAULT NOW(),
    responsible_for_payment VARCHAR NOT NULL,
    amount FLOAT NOT NULL,
    partition_percentage NUMERIC(5,2) NOT NULL,
    role_amount FLOAT NOT NULL,
    CONSTRAINT fk_trial_financial_component
        FOREIGN KEY (trial_financial_component_id)
            REFERENCES trial_financial_component(financial_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_investigator_id FOREIGN KEY (investigator_id) REFERENCES user_account(user_id)
);

CREATE TABLE IF NOT EXISTS research_finance (
    research_finance_id SERIAL PRIMARY KEY,
    trial_financial_component_id INT,
    transaction_date TIMESTAMP DEFAULT NOW(),
    type_of_flow VARCHAR NOT NULL,
    motive VARCHAR NOT NULL,
    amount FLOAT NOT NULL,
    CONSTRAINT fk_trial_financial_component FOREIGN KEY(trial_financial_component_id)
        REFERENCES trial_financial_component(financial_id)
        ON DELETE CASCADE
);


---------------------------------------------------------------------------------------
---------------------------------------ADDENDA-----------------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS addenda (
    addenda_id SERIAL PRIMARY KEY,
    research_id INT,
    addenda_state VARCHAR,
    addenda_file_id INT,
    CONSTRAINT fk_research_id FOREIGN KEY(research_id) REFERENCES clinical_research(research_id) ON DELETE CASCADE,
    CONSTRAINT fk_addenda_state FOREIGN KEY(addenda_state) REFERENCES states(state_name),
    CONSTRAINT fk_file_id FOREIGN KEY(addenda_file_id) REFERENCES files(file_id)
);

-- CREATE TABLE IF NOT EXISTS addenda_state_transitions (
--     id SERIAL PRIMARY KEY,
--     addenda_id INT NOT NULL,
--     state_transition_id INT NOT NULL,
--     observations TEXT,
--     --PRIMARY KEY (addenda_id, state_transition_id),
--     CONSTRAINT fk_addenda_id FOREIGN KEY (addenda_id) REFERENCES addenda(addenda_id) ON DELETE CASCADE,
--     CONSTRAINT fk_state_transition_id FOREIGN KEY (state_transition_id) REFERENCES state_transition(id)
-- );