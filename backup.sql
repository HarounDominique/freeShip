


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


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."update_author_name"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.author_name := (SELECT username FROM profiles WHERE id = NEW.author_id);
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_author_name"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_project_rating"("project_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE projects
  SET 
    rating_avg = COALESCE(
      (SELECT AVG(rating)::numeric(10,2)
       FROM project_ratings
       WHERE project_ratings.project_id = projects.id),
      0
    ),
    rating_count = (SELECT COUNT(*)
                    FROM project_ratings
                    WHERE project_ratings.project_id = projects.id)
  WHERE id = project_id;
END;
$$;


ALTER FUNCTION "public"."update_project_rating"("project_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_project_rating_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects
    SET rating_count = rating_count + 1
    WHERE id = NEW.project_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects
    SET rating_count = rating_count - 1
    WHERE id = OLD.project_id;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_project_rating_count"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text" NOT NULL,
    "about_me" "text",
    CONSTRAINT "chk_about_me_length" CHECK (("char_length"("about_me") <= 1000))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_applications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "applicant_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "applied_at" timestamp with time zone DEFAULT "now"(),
    "message" character varying(1000)
);


ALTER TABLE "public"."project_applications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_ratings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "user_id" "uuid",
    "rated_at" timestamp without time zone DEFAULT "now"(),
    "starred" boolean DEFAULT false
);


ALTER TABLE "public"."project_ratings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(100) NOT NULL,
    "description" character varying(750),
    "author_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "type" "text",
    "tech_stack" "text"[],
    "author_name" "text",
    "team_members" "uuid"[] DEFAULT '{}'::"uuid"[],
    "visible" boolean DEFAULT true,
    "collaborators_number" integer DEFAULT 3 NOT NULL,
    "github_repository" "text",
    "rating_count" integer DEFAULT 0,
    "chat_room_link" "text",
    CONSTRAINT "projects_collaborators_number_check" CHECK (("collaborators_number" <= 10)),
    CONSTRAINT "projects_type_check" CHECK (("type" = ANY (ARRAY['WEB/DESKTOP'::"text", 'MOBILE'::"text", 'EMBEDDED'::"text", 'VIDEOGAME'::"text", 'BD/IA/ML'::"text", 'CYBERSECURITY'::"text", 'SCRIPTING/SCRAPING'::"text"])))
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."project_applications"
    ADD CONSTRAINT "project_applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_ratings"
    ADD CONSTRAINT "project_ratings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_ratings"
    ADD CONSTRAINT "project_ratings_project_id_user_id_key" UNIQUE ("project_id", "user_id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_applications"
    ADD CONSTRAINT "unique_application" UNIQUE ("project_id", "applicant_id");



CREATE OR REPLACE TRIGGER "set_author_name" BEFORE INSERT OR UPDATE ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "public"."update_author_name"();



CREATE OR REPLACE TRIGGER "trigger_update_project_rating_count" AFTER INSERT OR DELETE ON "public"."project_ratings" FOR EACH ROW EXECUTE FUNCTION "public"."update_project_rating_count"();



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_applications"
    ADD CONSTRAINT "project_applications_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_applications"
    ADD CONSTRAINT "project_applications_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_ratings"
    ADD CONSTRAINT "project_ratings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_ratings"
    ADD CONSTRAINT "project_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."update_author_name"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_author_name"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_author_name"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_project_rating"("project_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."update_project_rating"("project_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_project_rating"("project_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_project_rating_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_project_rating_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_project_rating_count"() TO "service_role";


















GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."project_applications" TO "anon";
GRANT ALL ON TABLE "public"."project_applications" TO "authenticated";
GRANT ALL ON TABLE "public"."project_applications" TO "service_role";



GRANT ALL ON TABLE "public"."project_ratings" TO "anon";
GRANT ALL ON TABLE "public"."project_ratings" TO "authenticated";
GRANT ALL ON TABLE "public"."project_ratings" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
