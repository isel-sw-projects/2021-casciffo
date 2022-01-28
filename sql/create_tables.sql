
---------------------------------------------------------------------------------------
---------------------------------STATE AND USER ROLES----------------------------------
---------------------------------------------------------------------------------------
CREATE TABLE user_role (
    role_name VARCHAR PRIMARY KEY
);

CREATE TABLE user_account (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR NOT NULL,
    user_email VARCHAR NOT NULL UNIQUE,
    password VARCHAR,
    user_role VARCHAR,
    CONSTRAINT fk_user_role FOREIGN KEY(user_role) REFERENCES user_role(role_name)
);


CREATE TABLE user_notification (
    notification_id SERIAL PRIMARY KEY,
    notified_user INT,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    CONSTRAINT fk_notified_user FOREIGN KEY(notified_user) REFERENCES user_account(user_id)
);


CREATE TABLE states (
    state_name VARCHAR PRIMARY KEY,
    role_responsible_for_advancing VARCHAR,
    CONSTRAINT fk_role FOREIGN KEY(role_responsible_for_advancing) REFERENCES user_role(role_name)
);

CREATE TABLE state_transition (
    id SERIAL PRIMARY KEY,
    state_before VARCHAR,
    state_after VARCHAR,
    transition_date TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_state_before FOREIGN KEY (state_before) REFERENCES states(state_name),
    CONSTRAINT fk_state_after FOREIGN KEY (state_after) REFERENCES states(state_name)
);


---------------------------------------------------------------------------------------
---------------------------------INVESTIGATION TEAM------------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE investigation_team (
    team_id SERIAL PRIMARY KEY,
    investigator_id INT,
    investigator_role VARCHAR NOT NULL, -- team member / principal
    CONSTRAINT fk_investigator_id FOREIGN KEY (investigator_id) REFERENCES user_account(user_id)
);


---------------------------------------------------------------------------------------
-----------------------------------------FILES-----------------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE files (
    file_id SERIAL PRIMARY KEY,
    file_name VARCHAR NOT NULL,
    file_path TEXT NOT NULL,
    file_size INT NOT NULL
);

---------------------------------------------------------------------------------------
---------------------------------PROPOSAL INFORMATION----------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE pathology (
    pathology_name VARCHAR PRIMARY KEY 
);


CREATE TABLE service (
    service_name VARCHAR PRIMARY KEY
);

CREATE TABLE therapeutic_area (
    therapeutic_area_name VARCHAR PRIMARY KEY
);


CREATE TABLE proposal (
    proposal_id SERIAL PRIMARY KEY,
    state_id VARCHAR,
    pathology_id VARCHAR,
    service_id VARCHAR,
    therapeutic_area_id VARCHAR,
    protocol_state VARCHAR,
    investigation_team_id INT,
    sigla VARCHAR NOT NULL,
    proposal_type VARCHAR NOT NULL, --clinical trial / observational study
    date_created TIMESTAMP DEFAULT NOW(),
    last_update TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_state_id FOREIGN KEY(state_id) REFERENCES states(state_name),
    CONSTRAINT fk_pathology_id FOREIGN KEY(pathology_id) REFERENCES pathology(pathology_name),
    CONSTRAINT fk_therapeutic_area_id FOREIGN KEY(therapeutic_area_id) REFERENCES therapeutic_area(therapeutic_area_name),
    CONSTRAINT fk_protocol_state FOREIGN KEY(protocol_state) REFERENCES states(state_name),
    CONSTRAINT fk_investigation_team_id FOREIGN KEY(investigation_team_id) REFERENCES investigation_team(team_id)
);


CREATE TABLE proposal_state_transitions (
    proposal_id INT,
    state_transition_id INT,
    PRIMARY KEY (proposal_id, state_transition_id),
    CONSTRAINT fk_proposal_id FOREIGN KEY (proposal_id) REFERENCES proposal(proposal_id),
    CONSTRAINT fk_state_transition_id FOREIGN KEY (state_transition_id) REFERENCES state_transition(id)
);


CREATE TABLE proposal_files (
    id SERIAL PRIMARY KEY,
    proposal_id INT,
    file_id INT,
    CONSTRAINT fk_proposal_id FOREIGN KEY(proposal_id) REFERENCES proposal(proposal_id),
    CONSTRAINT fk_file_id FOREIGN KEY(file_id) REFERENCES files(file_id)
);


CREATE TABLE proposal_comments (
    comment_id SERIAL PRIMARY KEY,
    proposal_id INT,
    author_id INT,
    date_created TIMESTAMP DEFAULT NOW(),
    content TEXT NOT NULL,
    comment_type VARCHAR NOT NULL,
    CONSTRAINT fk_proposal_id FOREIGN KEY(proposal_id) REFERENCES proposal(proposal_id),
    CONSTRAINT fk_author_id FOREIGN KEY(author_id) REFERENCES user_account(user_id)
);

CREATE TABLE timeline_event (
    event_id SERIAL PRIMARY KEY,
    proposal_id INT,
    event_type VARCHAR NOT NULL, -- deadline / states transition
    event_name VARCHAR NOT NULL,
    deadline_date DATE NOT NULL,
    completed_date DATE,
    is_over_due BIT,
    days_over_due INT,
    CONSTRAINT  fk_proposal_id FOREIGN KEY(proposal_id) REFERENCES proposal(proposal_id)
);


---------------------------------------------------------------------------------------
-----------------------PROPOSAL FINANCIAL INFORMATION----------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE promoter (
    promoter_id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    promoter_type VARCHAR NOT NULL,
    email VARCHAR NOT NULL
);

CREATE TABLE proposal_financial_component (
    proposal_financial_id SERIAL,
    proposal_id INT,
    financial_contract_id INT,
    promoter_id INT,
    CONSTRAINT fk_proposal_id FOREIGN KEY(proposal_id) REFERENCES proposal(proposal_id),
    CONSTRAINT fk_financial_contract_id FOREIGN KEY (financial_contract_id) REFERENCES files(file_id),
    CONSTRAINT fk_promoter_id FOREIGN KEY(promoter_id) REFERENCES promoter(promoter_id)
);

CREATE TABLE partnerships (
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

CREATE TABLE clinical_research (
    research_id SERIAL PRIMARY KEY,
    proposal_id INT,
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
    CONSTRAINT fk_proposal_id FOREIGN KEY(proposal_id) REFERENCES proposal(proposal_id),
    CONSTRAINT fk_state_id FOREIGN KEY(research_state) REFERENCES states(state_name)
);

CREATE TABLE research_state_transitions (
    research_id INT,
    state_transition_id INT,
    motive text NOT NULL, -- reason for canceling / reason for starting such as SIV completed
    PRIMARY KEY (research_id, state_transition_id),
    CONSTRAINT fk_research_id FOREIGN KEY (research_id) REFERENCES clinical_research(research_id),
    CONSTRAINT fk_state_transition_id FOREIGN KEY (state_transition_id) REFERENCES state_transition(id)
);


CREATE TABLE dossier (
    dossier_id SERIAL PRIMARY KEY,
    clinical_research_id INT,
    volume VARCHAR NOT NULL,
    label VARCHAR NOT NULL,
    amount INT NOT NULL,
    CONSTRAINT fk_clinical_research FOREIGN KEY(clinical_research_id) REFERENCES clinical_research(research_id)
);


CREATE TABLE scientific_activities (
    activity_id SERIAL PRIMARY KEY,
    research_id INT,
    date_published DATE,
    author VARCHAR,
    paper_name VARCHAR,
    volume VARCHAR,
    volume_number INT,
    paper_num_pages INT,
    country_published VARCHAR,
    has_been_indexed BIT,
    published_url TEXT,
    CONSTRAINT fk_research_id FOREIGN KEY(research_id) REFERENCES clinical_research(research_id)
);

---------------------------------------------------------------------------------------
--------------------------------RESEARCH PARTICIPANTS----------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE participant (
    process_id BIGINT PRIMARY KEY,
    full_name VARCHAR NOT NULL,
    gender VARCHAR NOT NULL,
    age INT NOT NULL
);


CREATE TABLE research_participants (
    participant_id BIGINT,
    research_id INT,
    join_date TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (participant_id, research_id),
    CONSTRAINT fk_research_id FOREIGN KEY(research_id) REFERENCES clinical_research(research_id),
    CONSTRAINT fk_participant_id FOREIGN KEY(participant_id) REFERENCES participant(process_id)
);


---------------------------------------------------------------------------------------
------------------------------------TRIAL VISITS---------------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE clinical_visit (
    visit_id SERIAL PRIMARY KEY,
    research_id INT,
    participant_id INT,
    visit_type VARCHAR NOT NULL,
    scheduled_date TIMESTAMP NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    periodicy VARCHAR,
    observations TEXT,
    hasAdverseEventAlert BIT,
    has_marked_attendance BIT,
    CONSTRAINT fk_research_id FOREIGN KEY(research_id) REFERENCES clinical_research(research_id),
    CONSTRAINT fk_participant_id FOREIGN KEY(participant_id) REFERENCES participant(process_id)
);


CREATE TABLE visit_assigned_investigators (
    visit_id INT,
    investigator_id INT,
    PRIMARY KEY (visit_id, investigator_id),
    CONSTRAINT fk_visit_id FOREIGN KEY(visit_id) REFERENCES clinical_visit(visit_id),
    CONSTRAINT fk_investigator_id FOREIGN KEY(investigator_id) REFERENCES user_account(user_id)
);

---------------------------------------------------------------------------------------
------------------------CLINICAL TRIAL FINANCIAL COMPONENTS----------------------------
---------------------------------------------------------------------------------------

CREATE TABLE trial_financial_component (
    financial_id SERIAL PRIMARY KEY,
    research_id INT,
    value_per_participant INT,
    role_value_per_participant INT,
    balance FLOAT,
    CONSTRAINT fk_research_id FOREIGN KEY(research_id) REFERENCES clinical_research(research_id)
);

CREATE TABLE team_finance (
    team_finance_id SERIAL PRIMARY KEY,
    trial_financial_component_id INT,
    investigator_id INT, 
    type_of_flow VARCHAR NOT NULL,
    transaction_date TIMESTAMP DEFAULT NOW(),
    responsible_for_payment VARCHAR NOT NULL,
    amount FLOAT NOT NULL,
    partition_percentage NUMERIC(5,2) NOT NULL,
    role_amount FLOAT NOT NULL,
    CONSTRAINT fk_trial_financial_component FOREIGN KEY (trial_financial_component_id) REFERENCES trial_financial_component(financial_id),
    CONSTRAINT fk_investigator_id FOREIGN KEY (investigator_id) REFERENCES user_account(user_id)
);

CREATE TABLE research_finance (
    research_finance_id SERIAL PRIMARY KEY,
    trial_financial_component_id INT,
    transaction_date TIMESTAMP DEFAULT NOW(),
    type_of_flow VARCHAR NOT NULL,
    motive VARCHAR NOT NULL,
    amount FLOAT NOT NULL,
    CONSTRAINT fk_trial_financial_component FOREIGN KEY(trial_financial_component_id) REFERENCES trial_financial_component(financial_id)
);


---------------------------------------------------------------------------------------
---------------------------------------ADDENDA-----------------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE addenda (
    addenda_id SERIAL PRIMARY KEY,
    research_id INT,
    addenda_state VARCHAR,
    addenda_file_id INT,
    CONSTRAINT fk_research_id FOREIGN KEY(research_id) REFERENCES clinical_research(research_id),
    CONSTRAINT fk_addenda_state FOREIGN KEY(addenda_state) REFERENCES states(state_name),
    CONSTRAINT fk_file_id FOREIGN KEY(addenda_file_id) REFERENCES files(file_id)
);

CREATE TABLE addenda_state_transitions (
    addenda_id INT,
    state_transition_id INT,
    observations TEXT,
    PRIMARY KEY (addenda_id, state_transition_id),
    CONSTRAINT fk_addenda_id FOREIGN KEY (addenda_id) REFERENCES addenda(addenda_id),
    CONSTRAINT fk_state_transition_id FOREIGN KEY (state_transition_id) REFERENCES state_transition(id)
);
