--
-- PostgreSQL database dump
--

-- Dumped from database version 12.13
-- Dumped by pg_dump version 12.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS casciffo_db_test;
--
-- Name: casciffo_db_test; Type: DATABASE; Schema: -; Owner: vp
--

CREATE DATABASE casciffo_db_test WITH TEMPLATE = template0 ENCODING = 'UTF8';


ALTER DATABASE casciffo_db_test OWNER TO vp;

\connect casciffo_db_test

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: f_update_last_modified_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.f_update_last_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.last_modified = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.f_update_last_modified_column() OWNER TO postgres;

--
-- Name: f_validate_comment(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.f_validate_comment() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    notValid BOOLEAN;
BEGIN
    IF NEW.comment_type = 'PROTOCOL'
    THEN
        BEGIN
            notValid := (SELECT CASE WHEN COUNT(P) > 0 THEN TRUE ELSE FALSE END
                      FROM proposal P WHERE P.proposal_id=NEW.proposal_id AND P.proposal_type='OBSERVATIONAL_STUDY');
            IF notValid THEN
                RAISE EXCEPTION 'Proposal % with type OBSREVATIONAL_STUDY can''t have comments with type PROTOCOL.', NEW.proposal_id
                USING HINT = 'Don''t create PROTOCOL type comments on a proposal with type OBSREVATIONAL_STUDY' ;
        END IF;
    END;
    END IF;

    NEW.last_modified = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.f_validate_comment() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addenda; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.addenda (
    addenda_id integer NOT NULL,
    research_id integer NOT NULL,
    addenda_state_id integer NOT NULL,
    addenda_file_id integer NOT NULL,
    created_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.addenda OWNER TO vp;

--
-- Name: addenda_addenda_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.addenda ALTER COLUMN addenda_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.addenda_addenda_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: addenda_comment; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.addenda_comment (
    id integer NOT NULL,
    addenda_id integer,
    author_id integer,
    created_date timestamp without time zone DEFAULT now() NOT NULL,
    observation character varying NOT NULL
);


ALTER TABLE public.addenda_comment OWNER TO vp;

--
-- Name: addenda_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.addenda_comment ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.addenda_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: clinical_research; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.clinical_research (
    research_id integer NOT NULL,
    research_state_id integer NOT NULL,
    last_modified timestamp without time zone DEFAULT now(),
    eudra_ct character varying,
    sample_size integer,
    duration integer,
    cro character varying,
    start_date date,
    end_date date,
    estimated_end_date date,
    estimated_patient_pool integer,
    actual_patient_pool integer,
    treatment_type character varying,
    typology character varying,
    specification character varying,
    industry character varying,
    protocol character varying,
    initiative_by character varying,
    phase character varying,
    treatment_branches character varying,
    canceled_reason character varying,
    canceled_by_id integer,
    type character varying NOT NULL
);


ALTER TABLE public.clinical_research OWNER TO vp;

--
-- Name: clinical_research_research_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.clinical_research ALTER COLUMN research_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.clinical_research_research_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: clinical_visit; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.clinical_visit (
    visit_id integer NOT NULL,
    research_id integer,
    research_patient_id integer,
    visit_type character varying NOT NULL,
    scheduled_date timestamp without time zone NOT NULL,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    periodicity character varying,
    custom_periodicity integer,
    observations text,
    has_adverse_event_alert boolean,
    has_marked_attendance boolean DEFAULT false,
    concluded boolean DEFAULT false
);


ALTER TABLE public.clinical_visit OWNER TO vp;

--
-- Name: clinical_visit_visit_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.clinical_visit ALTER COLUMN visit_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.clinical_visit_visit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: dossier; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.dossier (
    dossier_id integer NOT NULL,
    clinical_research_id integer,
    volume character varying NOT NULL,
    label character varying NOT NULL,
    amount integer NOT NULL
);


ALTER TABLE public.dossier OWNER TO vp;

--
-- Name: dossier_dossier_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.dossier ALTER COLUMN dossier_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.dossier_dossier_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: files; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.files (
    file_id integer NOT NULL,
    file_name character varying NOT NULL,
    file_path text NOT NULL,
    file_size integer NOT NULL
);


ALTER TABLE public.files OWNER TO vp;

--
-- Name: files_file_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.files ALTER COLUMN file_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.files_file_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: investigation_team; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.investigation_team (
    team_id integer NOT NULL,
    proposal_id integer NOT NULL,
    member_role character varying(50) NOT NULL,
    member_id integer NOT NULL
);


ALTER TABLE public.investigation_team OWNER TO vp;

--
-- Name: investigation_team_team_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.investigation_team ALTER COLUMN team_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.investigation_team_team_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: next_possible_states; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.next_possible_states (
    id integer NOT NULL,
    origin_state_id integer NOT NULL,
    next_state_id integer,
    state_type character varying NOT NULL,
    state_flow_type character varying NOT NULL,
    CONSTRAINT check_validity CHECK ((NOT ((next_state_id IS NULL) AND ((state_flow_type)::text <> 'TERMINAL'::text))))
);


ALTER TABLE public.next_possible_states OWNER TO vp;

--
-- Name: next_possible_states_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.next_possible_states ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.next_possible_states_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: participant; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.participant (
    id integer NOT NULL,
    process_id bigint,
    full_name character varying NOT NULL,
    gender character varying NOT NULL,
    age integer NOT NULL
);


ALTER TABLE public.participant OWNER TO vp;

--
-- Name: participant_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.participant ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.participant_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: partnerships; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.partnerships (
    partnership_id integer NOT NULL,
    proposal_financial_id integer,
    name character varying NOT NULL,
    email character varying NOT NULL,
    representative character varying,
    phone_contact character varying,
    icon_url text,
    site_url text,
    description text
);


ALTER TABLE public.partnerships OWNER TO vp;

--
-- Name: partnerships_partnership_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.partnerships ALTER COLUMN partnership_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.partnerships_partnership_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pathology; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.pathology (
    pathology_id integer NOT NULL,
    pathology_name character varying
);


ALTER TABLE public.pathology OWNER TO vp;

--
-- Name: pathology_pathology_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.pathology ALTER COLUMN pathology_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pathology_pathology_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: promoter; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.promoter (
    promoter_id integer NOT NULL,
    promoter_name character varying NOT NULL,
    promoter_type character varying NOT NULL,
    promoter_email character varying NOT NULL
);


ALTER TABLE public.promoter OWNER TO vp;

--
-- Name: promoter_promoter_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.promoter ALTER COLUMN promoter_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.promoter_promoter_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: proposal; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.proposal (
    proposal_id integer NOT NULL,
    state_id integer NOT NULL,
    pathology_id integer,
    service_id integer,
    therapeutic_area_id integer,
    sigla character varying NOT NULL,
    principal_investigator_id integer NOT NULL,
    proposal_type character varying NOT NULL,
    created_date timestamp without time zone DEFAULT now(),
    last_modified timestamp without time zone DEFAULT now()
);


ALTER TABLE public.proposal OWNER TO vp;

--
-- Name: proposal_comments; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.proposal_comments (
    comment_id integer NOT NULL,
    proposal_id integer NOT NULL,
    author_id integer NOT NULL,
    created_date timestamp without time zone DEFAULT now(),
    last_modified timestamp without time zone,
    content text NOT NULL,
    comment_type character varying NOT NULL
);


ALTER TABLE public.proposal_comments OWNER TO vp;

--
-- Name: proposal_comments_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.proposal_comments ALTER COLUMN comment_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.proposal_comments_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: proposal_files; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.proposal_files (
    id integer NOT NULL,
    proposal_id integer,
    file_id integer
);


ALTER TABLE public.proposal_files OWNER TO vp;

--
-- Name: proposal_files_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.proposal_files ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.proposal_files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: proposal_financial_component; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.proposal_financial_component (
    proposal_financial_id integer NOT NULL,
    proposal_id integer,
    financial_contract_id integer,
    promoter_id integer,
    has_partnerships boolean DEFAULT false
);


ALTER TABLE public.proposal_financial_component OWNER TO vp;

--
-- Name: proposal_financial_component_proposal_financial_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.proposal_financial_component ALTER COLUMN proposal_financial_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.proposal_financial_component_proposal_financial_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: proposal_proposal_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.proposal ALTER COLUMN proposal_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.proposal_proposal_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: proposal_research; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.proposal_research (
    id integer NOT NULL,
    proposal_id integer,
    research_id integer
);


ALTER TABLE public.proposal_research OWNER TO vp;

--
-- Name: proposal_research_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.proposal_research ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.proposal_research_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: protocol; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.protocol (
    protocol_id integer NOT NULL,
    validated boolean DEFAULT false,
    validated_date date,
    pfc_id integer NOT NULL,
    comment_ref integer,
    CONSTRAINT check_is_valid CHECK ((NOT ((comment_ref IS NULL) AND validated)))
);


ALTER TABLE public.protocol OWNER TO vp;

--
-- Name: protocol_protocol_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.protocol ALTER COLUMN protocol_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.protocol_protocol_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: research_finance_row; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.research_finance_row (
    research_finance_id integer NOT NULL,
    trial_financial_component_id integer,
    transaction_date timestamp without time zone DEFAULT now(),
    type_of_flow character varying NOT NULL,
    motive character varying NOT NULL,
    amount double precision NOT NULL
);


ALTER TABLE public.research_finance_row OWNER TO vp;

--
-- Name: research_finance_row_research_finance_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.research_finance_row ALTER COLUMN research_finance_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.research_finance_row_research_finance_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: research_financial_component; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.research_financial_component (
    financial_id integer NOT NULL,
    research_id integer,
    value_per_participant integer,
    role_value_per_participant integer,
    balance double precision
);


ALTER TABLE public.research_financial_component OWNER TO vp;

--
-- Name: research_financial_component_financial_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.research_financial_component ALTER COLUMN financial_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.research_financial_component_financial_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: research_participants; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.research_participants (
    id integer NOT NULL,
    participant_id bigint,
    research_id integer,
    join_date timestamp without time zone DEFAULT now(),
    treatment_branch character varying,
    last_visit_date timestamp without time zone
);


ALTER TABLE public.research_participants OWNER TO vp;

--
-- Name: research_participants_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.research_participants ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.research_participants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: research_team_financial_scope; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.research_team_financial_scope (
    team_finance_id integer NOT NULL,
    trial_financial_component_id integer,
    investigator_id integer,
    type_of_flow character varying NOT NULL,
    transaction_date timestamp without time zone DEFAULT now(),
    responsible_for_payment character varying NOT NULL,
    amount double precision NOT NULL,
    partition_percentage numeric(5,2) NOT NULL,
    role_amount double precision NOT NULL
);


ALTER TABLE public.research_team_financial_scope OWNER TO vp;

--
-- Name: research_team_financial_scope_team_finance_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.research_team_financial_scope ALTER COLUMN team_finance_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.research_team_financial_scope_team_finance_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.roles (
    role_id integer NOT NULL,
    role_name character varying NOT NULL
);


ALTER TABLE public.roles OWNER TO vp;

--
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.roles ALTER COLUMN role_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.roles_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: scientific_activities; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.scientific_activities (
    activity_id integer NOT NULL,
    research_id integer NOT NULL,
    date_published date,
    author character varying,
    paper_name character varying,
    volume character varying,
    volume_number integer,
    paper_num_pages integer,
    country_published character varying,
    has_been_indexed boolean,
    published_url text,
    publication_type character varying,
    research_type character varying
);


ALTER TABLE public.scientific_activities OWNER TO vp;

--
-- Name: scientific_activities_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.scientific_activities ALTER COLUMN activity_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.scientific_activities_activity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: service; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.service (
    service_id integer NOT NULL,
    service_name character varying
);


ALTER TABLE public.service OWNER TO vp;

--
-- Name: service_service_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.service ALTER COLUMN service_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.service_service_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: state_roles; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.state_roles (
    id integer NOT NULL,
    state_id integer NOT NULL,
    role_id integer NOT NULL
);


ALTER TABLE public.state_roles OWNER TO vp;

--
-- Name: state_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.state_roles ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.state_roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: state_transition; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.state_transition (
    id integer NOT NULL,
    transition_type character varying NOT NULL,
    reference_id integer NOT NULL,
    state_id_before integer NOT NULL,
    state_id_after integer NOT NULL,
    transition_date timestamp without time zone DEFAULT now()
);


ALTER TABLE public.state_transition OWNER TO vp;

--
-- Name: state_transition_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.state_transition ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.state_transition_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: states; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.states (
    state_id integer NOT NULL,
    state_name character varying NOT NULL
);


ALTER TABLE public.states OWNER TO vp;

--
-- Name: states_state_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.states ALTER COLUMN state_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.states_state_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: therapeutic_area; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.therapeutic_area (
    therapeutic_area_id integer NOT NULL,
    therapeutic_area_name character varying
);


ALTER TABLE public.therapeutic_area OWNER TO vp;

--
-- Name: therapeutic_area_therapeutic_area_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.therapeutic_area ALTER COLUMN therapeutic_area_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.therapeutic_area_therapeutic_area_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: timeline_event; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.timeline_event (
    event_id integer NOT NULL,
    proposal_id integer NOT NULL,
    event_type character varying NOT NULL,
    event_name character varying NOT NULL,
    event_description text,
    deadline_date date NOT NULL,
    completed_date date,
    is_over_due boolean DEFAULT false,
    days_over_due integer DEFAULT 0,
    is_associated_to_state boolean DEFAULT false,
    state_name character varying,
    state_id integer
);


ALTER TABLE public.timeline_event OWNER TO vp;

--
-- Name: timeline_event_event_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.timeline_event ALTER COLUMN event_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.timeline_event_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_account; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.user_account (
    user_id integer NOT NULL,
    user_name character varying NOT NULL,
    user_email character varying NOT NULL,
    user_password character varying NOT NULL
);


ALTER TABLE public.user_account OWNER TO vp;

--
-- Name: user_account_user_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.user_account ALTER COLUMN user_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_account_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_notification; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.user_notification (
    notification_id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    viewed boolean DEFAULT false,
    ids text,
    notification_type character varying,
    created_date timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_notification OWNER TO vp;

--
-- Name: user_notification_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.user_notification ALTER COLUMN notification_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_notification_notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.user_roles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    role_id integer NOT NULL
);


ALTER TABLE public.user_roles OWNER TO vp;

--
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.user_roles ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: validations; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.validations (
    id integer NOT NULL,
    pfc_id integer,
    comment_ref integer,
    validation_type character varying NOT NULL,
    validation_date timestamp without time zone,
    validated boolean DEFAULT false
);


ALTER TABLE public.validations OWNER TO vp;

--
-- Name: validations_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.validations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.validations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: visit_assigned_investigators; Type: TABLE; Schema: public; Owner: vp
--

CREATE TABLE public.visit_assigned_investigators (
    id integer NOT NULL,
    visit_id integer NOT NULL,
    investigator_id integer NOT NULL
);


ALTER TABLE public.visit_assigned_investigators OWNER TO vp;

--
-- Name: visit_assigned_investigators_id_seq; Type: SEQUENCE; Schema: public; Owner: vp
--

ALTER TABLE public.visit_assigned_investigators ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.visit_assigned_investigators_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: addenda; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.addenda (addenda_id, research_id, addenda_state_id, addenda_file_id, created_date) FROM stdin;
\.


--
-- Data for Name: addenda_comment; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.addenda_comment (id, addenda_id, author_id, created_date, observation) FROM stdin;
\.


--
-- Data for Name: clinical_research; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.clinical_research (research_id, research_state_id, last_modified, eudra_ct, sample_size, duration, cro, start_date, end_date, estimated_end_date, estimated_patient_pool, actual_patient_pool, treatment_type, typology, specification, industry, protocol, initiative_by, phase, treatment_branches, canceled_reason, canceled_by_id, type) FROM stdin;
\.


--
-- Data for Name: clinical_visit; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.clinical_visit (visit_id, research_id, research_patient_id, visit_type, scheduled_date, start_date, end_date, periodicity, custom_periodicity, observations, has_adverse_event_alert, has_marked_attendance, concluded) FROM stdin;
\.


--
-- Data for Name: dossier; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.dossier (dossier_id, clinical_research_id, volume, label, amount) FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.files (file_id, file_name, file_path, file_size) FROM stdin;
\.


--
-- Data for Name: investigation_team; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.investigation_team (team_id, proposal_id, member_role, member_id) FROM stdin;
\.


--
-- Data for Name: next_possible_states; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.next_possible_states (id, origin_state_id, next_state_id, state_type, state_flow_type) FROM stdin;
1	1	2	FINANCE_PROPOSAL	INITIAL
2	2	3	FINANCE_PROPOSAL	PROGRESS
3	3	4	FINANCE_PROPOSAL	PROGRESS
4	4	5	FINANCE_PROPOSAL	PROGRESS
5	5	6	FINANCE_PROPOSAL	PROGRESS
6	6	\N	FINANCE_PROPOSAL	TERMINAL
7	1	5	STUDY_PROPOSAL	INITIAL
8	5	6	STUDY_PROPOSAL	PROGRESS
9	6	\N	STUDY_PROPOSAL	TERMINAL
12	6	\N	ADDENDA	TERMINAL
13	7	8	RESEARCH	INITIAL
14	8	\N	RESEARCH	TERMINAL
15	9	\N	ALL	TERMINAL
17	11	\N	ADDENDA	TERMINAL
10	1	10	ADDENDA	INITIAL
11	10	5	ADDENDA	PROGRESS
16	5	6	ADDENDA	PROGRESS
\.


--
-- Data for Name: participant; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.participant (id, process_id, full_name, gender, age) FROM stdin;
\.


--
-- Data for Name: partnerships; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.partnerships (partnership_id, proposal_financial_id, name, email, representative, phone_contact, icon_url, site_url, description) FROM stdin;
\.


--
-- Data for Name: pathology; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.pathology (pathology_id, pathology_name) FROM stdin;
2	Anti-Infecciosos (J)
3	Sistema Nervoso Central (N)
4	Sistema Cardio-Vascular (C)
5	Orgão dos Sentidos (S)
6	Sangue e Hematopoiéticos (B)
7	Gastrointestinal e Metabolico (A)
8	Sistema Musculo Esquelético (M)
9	Sistema Respiratório (R)
10	Restantes ATC *
11	* Sistema Endócrino (H)
12	* Sistema Genito-Urinário e Hormonas Sexuais (G)
13	* Dermatológicos (D)
14	* Vários (V)
15	*Antiparasitários, Inseticidas e Repelentes (P)
16	Anti-Alérgicos
17	Nutrição
18	Correctivos da volémia e das alterações electrolíticas
19	Medicamentos usados em afecções Otorrinolaringológicas
20	Medicamentos usados em afecções Oculares
\.


--
-- Data for Name: promoter; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.promoter (promoter_id, promoter_name, promoter_type, promoter_email) FROM stdin;
1	Jeremy Wagner	NOT_APPLICABLE	valdemarpca+heroku@hotmail.com
2	Valdemar Palminha Correia Antunes	NOT_APPLICABLE	valdemarpca@hotmail.com
\.


--
-- Data for Name: proposal; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.proposal (proposal_id, state_id, pathology_id, service_id, therapeutic_area_id, sigla, principal_investigator_id, proposal_type, created_date, last_modified) FROM stdin;
\.


--
-- Data for Name: proposal_comments; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.proposal_comments (comment_id, proposal_id, author_id, created_date, last_modified, content, comment_type) FROM stdin;
\.


--
-- Data for Name: proposal_files; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.proposal_files (id, proposal_id, file_id) FROM stdin;
\.


--
-- Data for Name: proposal_financial_component; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.proposal_financial_component (proposal_financial_id, proposal_id, financial_contract_id, promoter_id, has_partnerships) FROM stdin;
\.


--
-- Data for Name: proposal_research; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.proposal_research (id, proposal_id, research_id) FROM stdin;
\.


--
-- Data for Name: protocol; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.protocol (protocol_id, validated, validated_date, pfc_id, comment_ref) FROM stdin;
\.


--
-- Data for Name: research_finance_row; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.research_finance_row (research_finance_id, trial_financial_component_id, transaction_date, type_of_flow, motive, amount) FROM stdin;
\.


--
-- Data for Name: research_financial_component; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.research_financial_component (financial_id, research_id, value_per_participant, role_value_per_participant, balance) FROM stdin;
\.


--
-- Data for Name: research_participants; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.research_participants (id, participant_id, research_id, join_date, treatment_branch, last_visit_date) FROM stdin;
\.


--
-- Data for Name: research_team_financial_scope; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.research_team_financial_scope (team_finance_id, trial_financial_component_id, investigator_id, type_of_flow, transaction_date, responsible_for_payment, amount, partition_percentage, role_amount) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.roles (role_id, role_name) FROM stdin;
1	SUPERUSER
2	CA
3	UIC
4	FINANCE
5	JURIDICAL
\.


--
-- Data for Name: scientific_activities; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.scientific_activities (activity_id, research_id, date_published, author, paper_name, volume, volume_number, paper_num_pages, country_published, has_been_indexed, published_url, publication_type, research_type) FROM stdin;
\.


--
-- Data for Name: service; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.service (service_id, service_name) FROM stdin;
1	Anatomia Patológica
2	Anestesiologia
4	Cirurgia Geral
5	Gastrenterologia
6	Ginecologia
7	Imagiologia
8	Infecciologia
9	Medicina Física e de Reabilitação
10	Medicina I
11	Medicina II
12	Medicina III
13	Medicina IV
14	Nefrologia
15	Neonatologia
16	Neurologia
17	Neurorradiologia
18	Obstetrícia
19	Oftalmologia
20	Oncologia
21	Ortopedia
22	Otorrinolaringologia
23	Patologia Clinica
24	Pediatria
25	Pneumologia
26	Psiquiatria e Saúde Mental da Infância e Adolescência
27	Psiquiatria e Saúde Mental de Adultos
28	Sangue e Medicina Transfusional
29	UCI
30	Unidade da Dor
31	Urgência
32	Urgência Geral e Urgência Básica
33	Urgência Obstétrica e Ginecológica
34	Urologia
3	Cardiologia
35	Patient Zero
\.


--
-- Data for Name: state_roles; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.state_roles (id, state_id, role_id) FROM stdin;
1	1	3
2	3	3
3	4	3
4	7	3
5	2	4
6	2	5
7	5	2
8	6	1
9	8	1
10	9	1
11	7	1
12	1	1
13	2	1
14	3	1
15	4	1
16	5	1
17	10	1
18	11	1
19	11	2
20	11	3
21	10	3
\.


--
-- Data for Name: state_transition; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.state_transition (id, transition_type, reference_id, state_id_before, state_id_after, transition_date) FROM stdin;
\.


--
-- Data for Name: states; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.states (state_id, state_name) FROM stdin;
1	SUBMETIDO
2	VALIDACAO_CF
3	VALIDACAO_EXTERNA
4	SUBMISSAO_AO_CA
5	VALIDACAO_INTERNA_CA
6	VALIDADO
7	ATIVO
8	COMPLETO
9	CANCELADO
10	VALIDACAO_INTERNA_UIC
11	INDEFERIDO
\.


--
-- Data for Name: therapeutic_area; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.therapeutic_area (therapeutic_area_id, therapeutic_area_name) FROM stdin;
1	Alimentação e dietética
2	Anatomia Patológica
3	Anestesiologia
4	Cardiologia
5	Cirurgia C
6	Cirurgia A
7	Departamento de Saúde Mental
8	Gastroenterologia
9	Ginecologia
10	Infecciologia
11	Medicina I
12	Medicina II
13	Medicina III
14	Medicina IV
15	Nefrologia
16	Neurologia
17	Oftalmologia
18	Oncologia
19	ORL
20	Ortopedia
21	Pediatria
22	Pneumologia
23	Psiquiatria
24	SMI
25	UCIENP
26	UCIP
27	Unidade Dor
28	Urgência Geral
29	Urologia
30	Ucicre
\.


--
-- Data for Name: timeline_event; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.timeline_event (event_id, proposal_id, event_type, event_name, event_description, deadline_date, completed_date, is_over_due, days_over_due, is_associated_to_state, state_name, state_id) FROM stdin;
\.


--
-- Data for Name: user_account; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.user_account (user_id, user_name, user_email, user_password) FROM stdin;
1	admin	casciffo.admin@admin.pt	$2a$10$2X2vmd5NthkKodbVnEGw8./LW0pdx46vr8MqlCg2tc742rPRbDwgG
\.


--
-- Data for Name: user_notification; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.user_notification (notification_id, user_id, title, description, viewed, ids, notification_type, created_date) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.user_roles (id, user_id, role_id) FROM stdin;
1	1	1
\.


--
-- Data for Name: validations; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.validations (id, pfc_id, comment_ref, validation_type, validation_date, validated) FROM stdin;
\.


--
-- Data for Name: visit_assigned_investigators; Type: TABLE DATA; Schema: public; Owner: vp
--

COPY public.visit_assigned_investigators (id, visit_id, investigator_id) FROM stdin;
\.


--
-- Name: addenda_addenda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.addenda_addenda_id_seq', 4, true);


--
-- Name: addenda_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.addenda_comment_id_seq', 2, true);


--
-- Name: clinical_research_research_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.clinical_research_research_id_seq', 3, true);


--
-- Name: clinical_visit_visit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.clinical_visit_visit_id_seq', 1, true);


--
-- Name: dossier_dossier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.dossier_dossier_id_seq', 1, false);


--
-- Name: files_file_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.files_file_id_seq', 7, true);


--
-- Name: investigation_team_team_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.investigation_team_team_id_seq', 7, true);


--
-- Name: next_possible_states_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.next_possible_states_id_seq', 17, true);


--
-- Name: participant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.participant_id_seq', 3, true);


--
-- Name: partnerships_partnership_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.partnerships_partnership_id_seq', 3, true);


--
-- Name: pathology_pathology_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.pathology_pathology_id_seq', 20, true);


--
-- Name: promoter_promoter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.promoter_promoter_id_seq', 2, true);


--
-- Name: proposal_comments_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.proposal_comments_comment_id_seq', 10, true);


--
-- Name: proposal_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.proposal_files_id_seq', 1, false);


--
-- Name: proposal_financial_component_proposal_financial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.proposal_financial_component_proposal_financial_id_seq', 3, true);


--
-- Name: proposal_proposal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.proposal_proposal_id_seq', 4, true);


--
-- Name: proposal_research_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.proposal_research_id_seq', 3, true);


--
-- Name: protocol_protocol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.protocol_protocol_id_seq', 3, true);


--
-- Name: research_finance_row_research_finance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.research_finance_row_research_finance_id_seq', 1, true);


--
-- Name: research_financial_component_financial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.research_financial_component_financial_id_seq', 2, true);


--
-- Name: research_participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.research_participants_id_seq', 3, true);


--
-- Name: research_team_financial_scope_team_finance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.research_team_financial_scope_team_finance_id_seq', 1, true);


--
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 5, true);


--
-- Name: scientific_activities_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.scientific_activities_activity_id_seq', 1, true);


--
-- Name: service_service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.service_service_id_seq', 36, true);


--
-- Name: state_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.state_roles_id_seq', 21, true);


--
-- Name: state_transition_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.state_transition_id_seq', 22, true);


--
-- Name: states_state_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.states_state_id_seq', 11, true);


--
-- Name: therapeutic_area_therapeutic_area_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.therapeutic_area_therapeutic_area_id_seq', 30, true);


--
-- Name: timeline_event_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.timeline_event_event_id_seq', 2, true);


--
-- Name: user_account_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.user_account_user_id_seq', 4, true);


--
-- Name: user_notification_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.user_notification_notification_id_seq', 28, true);


--
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.user_roles_id_seq', 8, true);


--
-- Name: validations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.validations_id_seq', 6, true);


--
-- Name: visit_assigned_investigators_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vp
--

SELECT pg_catalog.setval('public.visit_assigned_investigators_id_seq', 1, true);


--
-- Name: addenda_comment addenda_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.addenda_comment
    ADD CONSTRAINT addenda_comment_pkey PRIMARY KEY (id);


--
-- Name: addenda addenda_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.addenda
    ADD CONSTRAINT addenda_pkey PRIMARY KEY (addenda_id);


--
-- Name: clinical_research clinical_research_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.clinical_research
    ADD CONSTRAINT clinical_research_pkey PRIMARY KEY (research_id);


--
-- Name: clinical_visit clinical_visit_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.clinical_visit
    ADD CONSTRAINT clinical_visit_pkey PRIMARY KEY (visit_id);


--
-- Name: dossier dossier_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT dossier_pkey PRIMARY KEY (dossier_id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (file_id);


--
-- Name: investigation_team investigation_team_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.investigation_team
    ADD CONSTRAINT investigation_team_pkey PRIMARY KEY (team_id);


--
-- Name: next_possible_states next_possible_states_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.next_possible_states
    ADD CONSTRAINT next_possible_states_pkey PRIMARY KEY (id);


--
-- Name: participant participant_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.participant
    ADD CONSTRAINT participant_pkey PRIMARY KEY (id);


--
-- Name: participant participant_process_id_key; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.participant
    ADD CONSTRAINT participant_process_id_key UNIQUE (process_id);


--
-- Name: partnerships partnerships_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.partnerships
    ADD CONSTRAINT partnerships_pkey PRIMARY KEY (partnership_id);


--
-- Name: partnerships partnerships_unique_ne; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.partnerships
    ADD CONSTRAINT partnerships_unique_ne UNIQUE (name, email);


--
-- Name: pathology pathology_pathology_name_key; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.pathology
    ADD CONSTRAINT pathology_pathology_name_key UNIQUE (pathology_name);


--
-- Name: pathology pathology_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.pathology
    ADD CONSTRAINT pathology_pkey PRIMARY KEY (pathology_id);


--
-- Name: promoter promoter_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.promoter
    ADD CONSTRAINT promoter_pkey PRIMARY KEY (promoter_id);


--
-- Name: promoter promoter_promoter_email_key; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.promoter
    ADD CONSTRAINT promoter_promoter_email_key UNIQUE (promoter_email);


--
-- Name: proposal_comments proposal_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal_comments
    ADD CONSTRAINT proposal_comments_pkey PRIMARY KEY (comment_id);


--
-- Name: proposal_files proposal_files_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal_files
    ADD CONSTRAINT proposal_files_pkey PRIMARY KEY (id);


--
-- Name: proposal_financial_component proposal_financial_component_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal_financial_component
    ADD CONSTRAINT proposal_financial_component_pkey PRIMARY KEY (proposal_financial_id);


--
-- Name: proposal proposal_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal
    ADD CONSTRAINT proposal_pkey PRIMARY KEY (proposal_id);


--
-- Name: proposal_research proposal_research_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal_research
    ADD CONSTRAINT proposal_research_pkey PRIMARY KEY (id);


--
-- Name: protocol protocol_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.protocol
    ADD CONSTRAINT protocol_pkey PRIMARY KEY (protocol_id);


--
-- Name: research_finance_row research_finance_row_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.research_finance_row
    ADD CONSTRAINT research_finance_row_pkey PRIMARY KEY (research_finance_id);


--
-- Name: research_financial_component research_financial_component_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.research_financial_component
    ADD CONSTRAINT research_financial_component_pkey PRIMARY KEY (financial_id);


--
-- Name: research_participants research_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.research_participants
    ADD CONSTRAINT research_participants_pkey PRIMARY KEY (id);


--
-- Name: research_team_financial_scope research_team_financial_scope_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.research_team_financial_scope
    ADD CONSTRAINT research_team_financial_scope_pkey PRIMARY KEY (team_finance_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- Name: scientific_activities scientific_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.scientific_activities
    ADD CONSTRAINT scientific_activities_pkey PRIMARY KEY (activity_id);


--
-- Name: service service_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.service
    ADD CONSTRAINT service_pkey PRIMARY KEY (service_id);


--
-- Name: service service_service_name_key; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.service
    ADD CONSTRAINT service_service_name_key UNIQUE (service_name);


--
-- Name: state_roles state_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.state_roles
    ADD CONSTRAINT state_roles_pkey PRIMARY KEY (id);


--
-- Name: state_transition state_transition_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.state_transition
    ADD CONSTRAINT state_transition_pkey PRIMARY KEY (id);


--
-- Name: states states_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_pkey PRIMARY KEY (state_id);


--
-- Name: states states_state_name_key; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_state_name_key UNIQUE (state_name);


--
-- Name: therapeutic_area therapeutic_area_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.therapeutic_area
    ADD CONSTRAINT therapeutic_area_pkey PRIMARY KEY (therapeutic_area_id);


--
-- Name: therapeutic_area therapeutic_area_therapeutic_area_name_key; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.therapeutic_area
    ADD CONSTRAINT therapeutic_area_therapeutic_area_name_key UNIQUE (therapeutic_area_name);


--
-- Name: timeline_event timeline_event_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.timeline_event
    ADD CONSTRAINT timeline_event_pkey PRIMARY KEY (event_id);


--
-- Name: investigation_team unique_member; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.investigation_team
    ADD CONSTRAINT unique_member UNIQUE (member_id, proposal_id);


--
-- Name: research_participants unique_rp; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.research_participants
    ADD CONSTRAINT unique_rp UNIQUE (participant_id, research_id);


--
-- Name: state_roles unique_state_role; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.state_roles
    ADD CONSTRAINT unique_state_role UNIQUE (state_id, role_id);


--
-- Name: next_possible_states unique_transition_type; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.next_possible_states
    ADD CONSTRAINT unique_transition_type UNIQUE (origin_state_id, next_state_id, state_type);


--
-- Name: visit_assigned_investigators unique_vi; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.visit_assigned_investigators
    ADD CONSTRAINT unique_vi UNIQUE (visit_id, investigator_id);


--
-- Name: user_account user_account_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_pkey PRIMARY KEY (user_id);


--
-- Name: user_account user_account_user_email_key; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_user_email_key UNIQUE (user_email);


--
-- Name: user_notification user_notification_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.user_notification
    ADD CONSTRAINT user_notification_pkey PRIMARY KEY (notification_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_id_key; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_key UNIQUE (user_id, role_id);


--
-- Name: validations validations_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.validations
    ADD CONSTRAINT validations_pkey PRIMARY KEY (id);


--
-- Name: visit_assigned_investigators visit_assigned_investigators_pkey; Type: CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.visit_assigned_investigators
    ADD CONSTRAINT visit_assigned_investigators_pkey PRIMARY KEY (id);


--
-- Name: clinical_research t_update_last_modified; Type: TRIGGER; Schema: public; Owner: vp
--

CREATE TRIGGER t_update_last_modified BEFORE UPDATE ON public.clinical_research FOR EACH ROW EXECUTE FUNCTION public.f_update_last_modified_column();


--
-- Name: proposal t_update_last_modified; Type: TRIGGER; Schema: public; Owner: vp
--

CREATE TRIGGER t_update_last_modified BEFORE UPDATE ON public.proposal FOR EACH ROW EXECUTE FUNCTION public.f_update_last_modified_column();


--
-- Name: proposal_comments t_update_last_modified; Type: TRIGGER; Schema: public; Owner: vp
--

CREATE TRIGGER t_update_last_modified BEFORE UPDATE ON public.proposal_comments FOR EACH ROW EXECUTE FUNCTION public.f_update_last_modified_column();


--
-- Name: proposal_comments t_validate_comment; Type: TRIGGER; Schema: public; Owner: vp
--

CREATE TRIGGER t_validate_comment BEFORE INSERT ON public.proposal_comments FOR EACH ROW EXECUTE FUNCTION public.f_validate_comment();


--
-- Name: addenda fk_a_file_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.addenda
    ADD CONSTRAINT fk_a_file_id FOREIGN KEY (addenda_file_id) REFERENCES public.files(file_id);


--
-- Name: addenda fk_a_research_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.addenda
    ADD CONSTRAINT fk_a_research_id FOREIGN KEY (research_id) REFERENCES public.clinical_research(research_id) ON DELETE CASCADE;


--
-- Name: addenda_comment fk_ac_addenda_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.addenda_comment
    ADD CONSTRAINT fk_ac_addenda_id FOREIGN KEY (addenda_id) REFERENCES public.addenda(addenda_id) ON DELETE CASCADE;


--
-- Name: addenda_comment fk_ac_author_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.addenda_comment
    ADD CONSTRAINT fk_ac_author_id FOREIGN KEY (author_id) REFERENCES public.user_account(user_id) ON DELETE CASCADE;


--
-- Name: addenda fk_addenda_state; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.addenda
    ADD CONSTRAINT fk_addenda_state FOREIGN KEY (addenda_state_id) REFERENCES public.states(state_id);


--
-- Name: proposal_comments fk_author_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal_comments
    ADD CONSTRAINT fk_author_id FOREIGN KEY (author_id) REFERENCES public.user_account(user_id);


--
-- Name: protocol fk_comment_ref; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.protocol
    ADD CONSTRAINT fk_comment_ref FOREIGN KEY (comment_ref) REFERENCES public.proposal_comments(comment_id) ON DELETE SET NULL;


--
-- Name: clinical_research fk_cr_canceled_by_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.clinical_research
    ADD CONSTRAINT fk_cr_canceled_by_id FOREIGN KEY (canceled_by_id) REFERENCES public.user_account(user_id);


--
-- Name: clinical_research fk_cr_state_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.clinical_research
    ADD CONSTRAINT fk_cr_state_id FOREIGN KEY (research_state_id) REFERENCES public.states(state_id);


--
-- Name: clinical_visit fk_cv_participant_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.clinical_visit
    ADD CONSTRAINT fk_cv_participant_id FOREIGN KEY (research_patient_id) REFERENCES public.research_participants(id);


--
-- Name: clinical_visit fk_cv_research_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.clinical_visit
    ADD CONSTRAINT fk_cv_research_id FOREIGN KEY (research_id) REFERENCES public.clinical_research(research_id) ON DELETE CASCADE;


--
-- Name: dossier fk_d_clinical_research; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT fk_d_clinical_research FOREIGN KEY (clinical_research_id) REFERENCES public.clinical_research(research_id) ON DELETE CASCADE;


--
-- Name: proposal_files fk_file_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal_files
    ADD CONSTRAINT fk_file_id FOREIGN KEY (file_id) REFERENCES public.files(file_id) ON DELETE CASCADE;


--
-- Name: investigation_team fk_it_member; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.investigation_team
    ADD CONSTRAINT fk_it_member FOREIGN KEY (member_id) REFERENCES public.user_account(user_id);


--
-- Name: investigation_team fk_it_proposal; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.investigation_team
    ADD CONSTRAINT fk_it_proposal FOREIGN KEY (proposal_id) REFERENCES public.proposal(proposal_id) ON DELETE CASCADE;


--
-- Name: user_notification fk_notified_user; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.user_notification
    ADD CONSTRAINT fk_notified_user FOREIGN KEY (user_id) REFERENCES public.user_account(user_id) ON DELETE CASCADE;


--
-- Name: next_possible_states fk_origin_state; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.next_possible_states
    ADD CONSTRAINT fk_origin_state FOREIGN KEY (origin_state_id) REFERENCES public.states(state_id) ON DELETE CASCADE;


--
-- Name: proposal fk_p_pathology_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal
    ADD CONSTRAINT fk_p_pathology_id FOREIGN KEY (pathology_id) REFERENCES public.pathology(pathology_id) ON DELETE SET NULL;


--
-- Name: proposal fk_p_principal_investigator; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal
    ADD CONSTRAINT fk_p_principal_investigator FOREIGN KEY (principal_investigator_id) REFERENCES public.user_account(user_id);


--
-- Name: proposal fk_p_service_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal
    ADD CONSTRAINT fk_p_service_id FOREIGN KEY (service_id) REFERENCES public.service(service_id) ON DELETE SET NULL;


--
-- Name: proposal fk_p_state_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal
    ADD CONSTRAINT fk_p_state_id FOREIGN KEY (state_id) REFERENCES public.states(state_id) ON DELETE SET NULL;


--
-- Name: proposal fk_p_therapeutic_area_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal
    ADD CONSTRAINT fk_p_therapeutic_area_id FOREIGN KEY (therapeutic_area_id) REFERENCES public.therapeutic_area(therapeutic_area_id);


--
-- Name: partnerships fk_partnerships_pfc_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.partnerships
    ADD CONSTRAINT fk_partnerships_pfc_id FOREIGN KEY (proposal_financial_id) REFERENCES public.proposal_financial_component(proposal_financial_id);


--
-- Name: proposal_comments fk_pc_proposal_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal_comments
    ADD CONSTRAINT fk_pc_proposal_id FOREIGN KEY (proposal_id) REFERENCES public.proposal(proposal_id) ON DELETE CASCADE;


--
-- Name: proposal_research fk_pcr_p_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal_research
    ADD CONSTRAINT fk_pcr_p_id FOREIGN KEY (proposal_id) REFERENCES public.proposal(proposal_id) ON DELETE CASCADE;


--
-- Name: proposal_research fk_pcr_r_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal_research
    ADD CONSTRAINT fk_pcr_r_id FOREIGN KEY (research_id) REFERENCES public.clinical_research(research_id) ON DELETE CASCADE;


--
-- Name: proposal_financial_component fk_pfc_financial_contract_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal_financial_component
    ADD CONSTRAINT fk_pfc_financial_contract_id FOREIGN KEY (financial_contract_id) REFERENCES public.files(file_id);


--
-- Name: proposal_financial_component fk_pfc_promoter_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal_financial_component
    ADD CONSTRAINT fk_pfc_promoter_id FOREIGN KEY (promoter_id) REFERENCES public.promoter(promoter_id);


--
-- Name: proposal_financial_component fk_pfc_proposal_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal_financial_component
    ADD CONSTRAINT fk_pfc_proposal_id FOREIGN KEY (proposal_id) REFERENCES public.proposal(proposal_id) ON DELETE CASCADE;


--
-- Name: next_possible_states fk_possible_state_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.next_possible_states
    ADD CONSTRAINT fk_possible_state_id FOREIGN KEY (next_state_id) REFERENCES public.states(state_id) ON DELETE CASCADE;


--
-- Name: proposal_files fk_proposal_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.proposal_files
    ADD CONSTRAINT fk_proposal_id FOREIGN KEY (proposal_id) REFERENCES public.proposal(proposal_id) ON DELETE CASCADE;


--
-- Name: protocol fk_protocol_pfc_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.protocol
    ADD CONSTRAINT fk_protocol_pfc_id FOREIGN KEY (pfc_id) REFERENCES public.proposal_financial_component(proposal_financial_id) ON DELETE CASCADE;


--
-- Name: research_finance_row fk_rf_trial_financial_component; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.research_finance_row
    ADD CONSTRAINT fk_rf_trial_financial_component FOREIGN KEY (trial_financial_component_id) REFERENCES public.research_financial_component(financial_id) ON DELETE CASCADE;


--
-- Name: state_roles fk_role_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.state_roles
    ADD CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON DELETE CASCADE;


--
-- Name: research_participants fk_rp_participant_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.research_participants
    ADD CONSTRAINT fk_rp_participant_id FOREIGN KEY (participant_id) REFERENCES public.participant(id) ON DELETE CASCADE;


--
-- Name: research_participants fk_rp_research_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.research_participants
    ADD CONSTRAINT fk_rp_research_id FOREIGN KEY (research_id) REFERENCES public.clinical_research(research_id) ON DELETE CASCADE;


--
-- Name: research_team_financial_scope fk_rtfc_investigator_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.research_team_financial_scope
    ADD CONSTRAINT fk_rtfc_investigator_id FOREIGN KEY (investigator_id) REFERENCES public.user_account(user_id);


--
-- Name: research_team_financial_scope fk_rtfc_trial_financial_component; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.research_team_financial_scope
    ADD CONSTRAINT fk_rtfc_trial_financial_component FOREIGN KEY (trial_financial_component_id) REFERENCES public.research_financial_component(financial_id) ON DELETE CASCADE;


--
-- Name: scientific_activities fk_sa_research_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.scientific_activities
    ADD CONSTRAINT fk_sa_research_id FOREIGN KEY (research_id) REFERENCES public.clinical_research(research_id) ON DELETE CASCADE;


--
-- Name: state_transition fk_state_after; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.state_transition
    ADD CONSTRAINT fk_state_after FOREIGN KEY (state_id_after) REFERENCES public.states(state_id) ON DELETE CASCADE;


--
-- Name: state_transition fk_state_before; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.state_transition
    ADD CONSTRAINT fk_state_before FOREIGN KEY (state_id_before) REFERENCES public.states(state_id) ON DELETE CASCADE;


--
-- Name: state_roles fk_state_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.state_roles
    ADD CONSTRAINT fk_state_id FOREIGN KEY (state_id) REFERENCES public.states(state_id) ON DELETE CASCADE;


--
-- Name: timeline_event fk_te_proposal_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.timeline_event
    ADD CONSTRAINT fk_te_proposal_id FOREIGN KEY (proposal_id) REFERENCES public.proposal(proposal_id) ON DELETE CASCADE;


--
-- Name: timeline_event fk_te_state_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.timeline_event
    ADD CONSTRAINT fk_te_state_id FOREIGN KEY (state_id) REFERENCES public.states(state_id) ON DELETE SET NULL;


--
-- Name: research_financial_component fk_tfc_research_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.research_financial_component
    ADD CONSTRAINT fk_tfc_research_id FOREIGN KEY (research_id) REFERENCES public.clinical_research(research_id) ON DELETE CASCADE;


--
-- Name: user_roles fk_ur_role_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT fk_ur_role_id FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON DELETE CASCADE;


--
-- Name: user_roles fk_ur_user_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT fk_ur_user_id FOREIGN KEY (user_id) REFERENCES public.user_account(user_id) ON DELETE CASCADE;


--
-- Name: validations fk_v_comment_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.validations
    ADD CONSTRAINT fk_v_comment_id FOREIGN KEY (comment_ref) REFERENCES public.proposal_comments(comment_id) ON DELETE CASCADE;


--
-- Name: validations fk_v_pfc_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.validations
    ADD CONSTRAINT fk_v_pfc_id FOREIGN KEY (pfc_id) REFERENCES public.proposal_financial_component(proposal_financial_id) ON DELETE CASCADE;


--
-- Name: visit_assigned_investigators fk_vai_investigator_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.visit_assigned_investigators
    ADD CONSTRAINT fk_vai_investigator_id FOREIGN KEY (investigator_id) REFERENCES public.user_account(user_id);


--
-- Name: visit_assigned_investigators fk_vai_visit_id; Type: FK CONSTRAINT; Schema: public; Owner: vp
--

ALTER TABLE ONLY public.visit_assigned_investigators
    ADD CONSTRAINT fk_vai_visit_id FOREIGN KEY (visit_id) REFERENCES public.clinical_visit(visit_id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM postgres;


--
-- PostgreSQL database dump complete
--

