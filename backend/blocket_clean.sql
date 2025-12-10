--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-11-16 22:44:46

--

-- Name: blocket; Type: DATABASE; Schema: -; Owner: postgres
--

--

-- Name: doc_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.doc_status AS ENUM (
    'draft',
    'rendered'
);

ALTER TYPE public.doc_status OWNER TO postgres;

--

-- Name: field_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.field_type AS ENUM (
    'text',
    'multiline',
    'number',
    'date',
    'select',
    'checkbox'
);

ALTER TYPE public.field_type OWNER TO postgres;

--

-- Name: output_format; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.output_format AS ENUM (
    'html',
    'pdf',
    'docx'
);

ALTER TYPE public.output_format OWNER TO postgres;

--

-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END $$;

ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--

-- Name: attachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attachment (
    id bigint NOT NULL,
    request_id bigint NOT NULL,
    file_name text NOT NULL,
    mime_type text,
    file_size bigint,
    storage_url text,
    uploaded_at timestamp with time zone DEFAULT now(),
    uploaded_by bigint
);

ALTER TABLE public.attachment OWNER TO postgres;

--

-- Name: attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attachment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.attachment_id_seq OWNER TO postgres;

--

-- Dependencies: 237
-- Name: attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attachment_id_seq OWNED BY public.attachment.id;

--

-- Name: blocket; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blocket (
    id bigint NOT NULL,
    tenant_id bigint NOT NULL,
    process_id bigint,
    category_id bigint,
    key text NOT NULL,
    title text NOT NULL,
    template_html text,
    version text,
    is_active boolean DEFAULT true,
    is_published boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.blocket OWNER TO postgres;

--

-- Name: blocket_dynamic_field; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blocket_dynamic_field (
    id bigint NOT NULL,
    blocket_id bigint NOT NULL,
    name text NOT NULL,
    label text NOT NULL,
    type text NOT NULL,
    required boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    options_json jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.blocket_dynamic_field OWNER TO postgres;

--

-- Name: blocket_dynamic_field_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blocket_dynamic_field_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.blocket_dynamic_field_id_seq OWNER TO postgres;

--

-- Dependencies: 225
-- Name: blocket_dynamic_field_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blocket_dynamic_field_id_seq OWNED BY public.blocket_dynamic_field.id;

--

-- Name: blocket_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blocket_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.blocket_id_seq OWNER TO postgres;

--

-- Dependencies: 223
-- Name: blocket_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blocket_id_seq OWNED BY public.blocket.id;

--

-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id bigint NOT NULL,
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.category OWNER TO postgres;

--

-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.category_id_seq OWNER TO postgres;

--

-- Dependencies: 219
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;

--

-- Name: channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channel (
    id bigint NOT NULL,
    tenant_id bigint NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.channel OWNER TO postgres;

--

-- Name: channel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.channel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.channel_id_seq OWNER TO postgres;

--

-- Dependencies: 227
-- Name: channel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.channel_id_seq OWNED BY public.channel.id;

--

-- Name: customer_request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_request (
    id bigint NOT NULL,
    tenant_id bigint NOT NULL,
    channel_id bigint,
    status_id bigint,
    customer_name text NOT NULL,
    customer_identifier text,
    request_type text,
    subject text,
    message text,
    payload_json jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by text,
    updated_by text,
    tipo_identificacion text,
    email text,
    tipo_cliente text,
    country text,
    departamento text,
    ciudad text
);

ALTER TABLE public.customer_request OWNER TO postgres;

--

-- Name: customer_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_request_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.customer_request_id_seq OWNER TO postgres;

--

-- Dependencies: 231
-- Name: customer_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_request_id_seq OWNED BY public.customer_request.id;

--

-- Name: process; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.process (
    id bigint NOT NULL,
    name text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.process OWNER TO postgres;

--

-- Name: process_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.process_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.process_id_seq OWNER TO postgres;

--

-- Dependencies: 217
-- Name: process_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.process_id_seq OWNED BY public.process.id;

--

-- Name: request_status_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_status_log (
    id bigint NOT NULL,
    request_id bigint NOT NULL,
    from_status_id bigint,
    to_status_id bigint,
    changed_at timestamp with time zone DEFAULT now(),
    changed_by bigint
);

ALTER TABLE public.request_status_log OWNER TO postgres;

--

-- Name: request_status_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_status_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.request_status_log_id_seq OWNER TO postgres;

--

-- Dependencies: 235
-- Name: request_status_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_status_log_id_seq OWNED BY public.request_status_log.id;

--

-- Name: status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.status (
    id bigint NOT NULL,
    tenant_id bigint NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.status OWNER TO postgres;

--

-- Name: status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.status_id_seq OWNER TO postgres;

--

-- Dependencies: 229
-- Name: status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.status_id_seq OWNED BY public.status.id;

--

-- Name: tenant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenant (
    id bigint NOT NULL,
    name text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.tenant OWNER TO postgres;

--

-- Name: tenant_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tenant_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.tenant_id_seq OWNER TO postgres;

--

-- Dependencies: 221
-- Name: tenant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tenant_id_seq OWNED BY public.tenant.id;

--

-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id bigint NOT NULL,
    tenant_id bigint NOT NULL,
    username text NOT NULL,
    full_name text,
    email text,
    password_hash text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public."user" OWNER TO postgres;

--

-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.user_id_seq OWNER TO postgres;

--

-- Dependencies: 233
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;

--

-- Name: attachment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachment ALTER COLUMN id SET DEFAULT nextval('public.attachment_id_seq'::regclass);

--

-- Name: blocket id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocket ALTER COLUMN id SET DEFAULT nextval('public.blocket_id_seq'::regclass);

--

-- Name: blocket_dynamic_field id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocket_dynamic_field ALTER COLUMN id SET DEFAULT nextval('public.blocket_dynamic_field_id_seq'::regclass);

--

-- Name: category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);

--

-- Name: channel id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel ALTER COLUMN id SET DEFAULT nextval('public.channel_id_seq'::regclass);

--

-- Name: customer_request id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_request ALTER COLUMN id SET DEFAULT nextval('public.customer_request_id_seq'::regclass);

--

-- Name: process id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process ALTER COLUMN id SET DEFAULT nextval('public.process_id_seq'::regclass);

--

-- Name: request_status_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_status_log ALTER COLUMN id SET DEFAULT nextval('public.request_status_log_id_seq'::regclass);

--

-- Name: status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status ALTER COLUMN id SET DEFAULT nextval('public.status_id_seq'::regclass);

--

-- Name: tenant id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant ALTER COLUMN id SET DEFAULT nextval('public.tenant_id_seq'::regclass);

--

-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);

--

-- Dependencies: 238
-- Data for Name: attachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attachment (id, request_id, file_name, mime_type, file_size, storage_url, uploaded_at, uploaded_by) FROM stdin;
3	24	adjunto-1762909649798.pdf	application/pdf	27399	uploads\\adjunto-1762909649798.pdf	2025-11-11 20:07:29.836228-05	1
4	25	adjunto-1762918595059.pdf	application/pdf	55759	uploads\\adjunto-1762918595059.pdf	2025-11-11 22:36:35.099493-05	1
\.

--

-- Dependencies: 224
-- Data for Name: blocket; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blocket (id, tenant_id, process_id, category_id, key, title, template_html, version, is_active, is_published, sort_order, created_at, updated_at) FROM stdin;
1	1	\N	\N	welcome_letter	Carta de Bienvenida	<p>Nos complace darle la bienvenida a nuestra comunidad. A partir del <b>{{fechaInicio}}</b>, podrá disfrutar de todos los servicios y beneficios asociados a su registro.</p><p>Esperamos que esta nueva experiencia supere sus expectativas y le brinde comodidad y confianza.</p>	v1	t	t	1	2025-11-09 20:34:15.81109-05	2025-11-09 20:34:15.81109-05
2	1	\N	\N	policy_update	Aviso de Actualización de Políticas	<p>Queremos informarle que a partir del <b>{{fechaVigencia}}</b> entra en vigor una actualización en nuestras políticas de servicio.</p><p>Le recomendamos revisar los nuevos términos en nuestro portal para garantizar que esté al tanto de los cambios implementados.</p><p>Esta actualización refuerza nuestro compromiso con la transparencia y la protección de los datos de nuestros clientes.</p>	v1	t	t	2	2025-11-09 20:34:15.81109-05	2025-11-09 20:34:15.81109-05
3	1	\N	\N	appointment_confirmation	Confirmación de Cita	<p>Le confirmamos su cita programada para el día <b>{{fechaCita}}</b> a las <b>{{horaCita}}</b>.</p><p>El encuentro tendrá lugar en nuestras oficinas principales o por el canal que haya seleccionado previamente.</p><p>Por favor llegue con 10 minutos de anticipación.</p>	v1	t	t	3	2025-11-09 20:34:15.81109-05	2025-11-09 20:34:15.81109-05
4	1	\N	\N	transaction_summary	Resumen de Transacciones	<p>A continuación encontrará un resumen de sus transacciones registradas durante el periodo <b>{{periodo}}</b>.</p><table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;"><tr style="background-color:#f2f4f7;"><th>Fecha</th><th>Descripción</th><th>Monto</th></tr><tr><td>{{fecha1}}</td><td>{{descripcion1}}</td><td>{{monto1}}</td></tr><tr><td>{{fecha2}}</td><td>{{descripcion2}}</td><td>{{monto2}}</td></tr></table><br><p><b>Total del periodo:</b> {{total}}</p><p style="font-size:12px; color:#666;">* Este documento tiene carácter informativo y no reemplaza los extractos oficiales.</p>	v1	t	t	4	2025-11-09 20:34:15.81109-05	2025-11-09 20:34:15.81109-05
5	1	\N	\N	service_evaluation	Informe de Evaluación de Servicio	<h3 style="color:#1976d2;">Evaluación de Servicio Reciente</h3><p>Cliente: <b>{{nombreCliente}}</b></p><p>Fecha de atención: <b>{{fechaAtencion}}</b></p><p>Asesor encargado: <b>{{nombreAsesor}}</b></p><br><table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;"><tr style="background-color:#eaf3ff;"><th>Criterio</th><th>Calificación (1-5)</th></tr><tr><td>Rapidez</td><td>{{puntajeRapidez}}</td></tr><tr><td>Amabilidad</td><td>{{puntajeAmabilidad}}</td></tr><tr><td>Resolución del problema</td><td>{{puntajeResolucion}}</td></tr></table><br><p>Comentarios adicionales: {{comentarios}}</p><img src="https://img.icons8.com/fluency/96/customer-support.png" alt="Atención al cliente" width="90"/><br><p style="font-size: 12px; color: #555;">Gracias por ayudarnos a mejorar continuamente nuestros servicios.</p>	v1	t	t	5	2025-11-09 20:34:15.81109-05	2025-11-09 20:34:15.81109-05
14	1	1	1	experienciadelcliente	Estado de Cuenta Resumido	<p>A continuación encontrará un resumen del estado actual de su producto financiero. Esta información corresponde al corte realizado en la fecha indicada.</p><table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;"><tbody><tr style="background-color:#f2f4f7;"><th>Tipo de producto</th><th>Número de producto</th><th>Fecha de corte</th><th>Saldo actual</th></tr><tr><td>{{tipoProducto}}</td><td>{{numeroProducto}}</td><td>{{fechaCorte}}</td><td>{{saldoActual}}</td></tr></tbody></table><p>Recuerde que este es un resumen informativo. Para consultar el detalle completo de sus movimientos puede acceder a su banca en línea o visitar nuestras oficinas.</p>	v1	t	f	0	2025-11-14 22:32:48.03093-05	2025-11-14 22:37:38.305906-05
12	1	1	1	12	Cambio de Información	<p>Le confirmamos que la modificación de su {{tipoInformacion}} ha sido procesada exitosamente en nuestros sistemas. El cambio fue realizado el {{fechaCambio}} y ya se encuentra vigente. Si usted no solicitó esta modificación o detecta alguna inconsistencia, le solicitamos contactar inmediatamente a nuestro centro de atención al cliente. De lo contrario, no es necesario realizar ninguna acción adicional.</p><p></p>	v1	t	f	0	2025-11-14 20:30:40.247147-05	2025-11-14 22:01:03.904748-05
13	1	1	1	creditos	Estado de Solicitud de Crédito	<p>Le informamos que su solicitud de crédito con número de referencia {{numeroSolicitud}} ha sido {{estadoSolicitud}}. El proceso de evaluación ha sido completado según nuestros parámetros establecidos. En caso de aprobación, recibirá la documentación contractual en los próximos días. Si requiere información adicional sobre esta decisión, puede contactar a su asesor asignado a través de nuestros canales oficiales.</p>	v1	t	f	0	2025-11-14 22:24:41.345919-05	2025-11-14 22:24:41.345919-05
\.

--

-- Dependencies: 226
-- Data for Name: blocket_dynamic_field; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blocket_dynamic_field (id, blocket_id, name, label, type, required, sort_order, options_json, created_at, updated_at) FROM stdin;
23	1	nombreCliente	Nombre del cliente	text	t	1	\N	2025-11-14 19:10:01.188622-05	2025-11-14 19:10:01.188622-05
24	1	fechaInicio	Fecha de inicio	date	t	2	\N	2025-11-14 19:10:01.188622-05	2025-11-14 19:10:01.188622-05
25	2	fechaVigencia	Fecha de vigencia	date	t	1	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
26	3	nombreCliente	Nombre del cliente	text	t	1	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
27	3	fechaCita	Fecha de la cita	date	t	2	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
28	3	horaCita	Hora de la cita	text	t	3	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
29	4	nombreCliente	Nombre del cliente	text	t	1	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
30	4	periodo	Periodo de reporte	text	t	2	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
31	4	fecha1	Fecha 1	date	t	3	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
32	4	descripcion1	Descripción 1	text	t	4	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
33	4	monto1	Monto 1	number	t	5	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
34	4	fecha2	Fecha 2	date	t	6	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
35	4	descripcion2	Descripción 2	text	t	7	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
36	4	monto2	Monto 2	number	t	8	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
37	4	total	Total	number	t	9	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
38	5	nombreCliente	Nombre del cliente	text	t	1	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
39	5	fechaAtencion	Fecha de atención	date	t	2	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
40	5	nombreAsesor	Nombre del asesor	text	t	3	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
41	5	puntajeRapidez	Puntaje de rapidez	number	t	4	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
42	5	puntajeAmabilidad	Puntaje de amabilidad	number	t	5	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
43	5	puntajeResolucion	Puntaje de resolución	number	t	6	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
44	5	comentarios	Comentarios	text	t	7	\N	2025-11-14 19:10:26.755352-05	2025-11-14 19:10:26.755352-05
45	12	ww	ww	text	t	1	\N	2025-11-14 22:01:03.904748-05	2025-11-14 22:01:03.904748-05
46	13	numeroSolicitud	Número de solicitud	number	t	1	\N	2025-11-14 22:24:41.345919-05	2025-11-14 22:24:41.345919-05
47	13	estadoSolicitud	Estado de la solicitud	text	t	2	\N	2025-11-14 22:24:41.345919-05	2025-11-14 22:24:41.345919-05
52	14	tipoProducto	Tipo de producto	text	t	1	\N	2025-11-14 22:37:38.305906-05	2025-11-14 22:37:38.305906-05
53	14	numeroProducto	Número de producto	text	t	2	\N	2025-11-14 22:37:38.305906-05	2025-11-14 22:37:38.305906-05
54	14	fechaCorte	Fecha de corte	date	t	3	\N	2025-11-14 22:37:38.305906-05	2025-11-14 22:37:38.305906-05
55	14	saldoActual	Saldo actual	number	t	4	\N	2025-11-14 22:37:38.305906-05	2025-11-14 22:37:38.305906-05
\.

--

-- Dependencies: 220
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (id, name, description, is_active, created_at) FROM stdin;
1	Queja	Inconformidad por mala atención o servicio	t	2025-09-19 22:59:07.825085-05
2	Reclamo	Exige corrección o indemnización	t	2025-09-19 22:59:07.825085-05
3	Solicitud	Pide un servicio o gestión	t	2025-09-19 22:59:07.825085-05
4	Petición	Requiere información o atención	t	2025-09-19 22:59:07.825085-05
\.

--

-- Dependencies: 228
-- Data for Name: channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.channel (id, tenant_id, code, name, is_active, created_at) FROM stdin;
1	1	web	Web Portal	t	2025-11-09 20:48:43.805142-05
2	1	email	Email	t	2025-11-09 20:48:43.805142-05
3	1	api	API	t	2025-11-09 20:48:43.805142-05
4	1	whatsapp	WhatsApp	t	2025-11-09 20:48:43.805142-05
\.

--

-- Dependencies: 232
-- Data for Name: customer_request; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_request (id, tenant_id, channel_id, status_id, customer_name, customer_identifier, request_type, subject, message, payload_json, created_at, updated_at, created_by, updated_by, tipo_identificacion, email, tipo_cliente, country, departamento, ciudad) FROM stdin;
1	1	1	1	Pepito Pérez	123456789	Queja	Activación de Producto	Solicito activación de mi nuevo servicio.	{"product": "EnerGAS"}	2025-11-09 20:49:25.797205-05	2025-11-11 18:53:27.679025-05	admin	admin	CC	pepito.perez@empresa.com	Natural	Colombia	Cundinamarca	Bogotá
2	1	2	2	Ana Gómez	998877665	Reclamo	Cambio de Información	Actualización de datos de contacto.	{"fields": ["email", "phone"]}	2025-11-09 20:49:25.797205-05	2025-11-11 18:53:27.679025-05	admin	admin	NIT	ana.gomez@empresa.com	Jurídica	Colombia	Antioquia	Medellín
3	1	3	3	Andrés Felipe Mora Rojas	112233445	Solicitud	Aviso de Mora	Reclamo por mora en el pago.	{"amount_due": 150000}	2025-11-09 20:49:25.797205-05	2025-11-11 18:53:27.679025-05	admin	admin	CC	andres.mora@empresa.com	Natural	Colombia	Valle del Cauca	Cali
4	1	1	1	Victor Hugo Ortega Portilla	123123123	consulta	Solicitud desde formulario web	Esto es una prueba	\N	2025-11-11 19:10:46.234787-05	2025-11-11 19:10:46.234787-05	webform	\N	CC	victor@correo.com	natural	Colombia	Valle	Cali
24	1	1	1	Miguel Fernando Mora Abadía	14002121	consulta	Solicitud desde formulario web	Esto es una solicitud	\N	2025-11-11 20:07:29.831054-05	2025-11-11 20:07:29.831054-05	webform	\N	CC	abadia@correo.com	natural	Colombia	Valle	Cali
25	1	1	1	Diana Vargas Calderon	1087023655	consulta	Solicitud desde formulario web	Mi solicitud corresponde una queja por falta transparencia operativa	\N	2025-11-11 22:36:35.09419-05	2025-11-11 22:36:35.09419-05	webform	\N	CC	vargas@gmail.com	natural	Colombia	Valle	Cali
\.

--

-- Dependencies: 218
-- Data for Name: process; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.process (id, name, is_active, created_at, updated_at) FROM stdin;
1	Cobranza	t	2025-11-14 23:22:18.926315-05	2025-11-14 23:22:18.926315-05
2	Jurídico	t	2025-11-14 23:22:18.926315-05	2025-11-14 23:22:18.926315-05
3	Comercial	t	2025-11-14 23:22:18.926315-05	2025-11-14 23:22:18.926315-05
4	Facturación	t	2025-11-14 23:23:34.959666-05	2025-11-14 23:23:42.352371-05
5	Experiencia del Cliente	t	2025-11-14 23:30:06.650382-05	2025-11-14 23:30:20.830764-05
\.

--

-- Dependencies: 236
-- Data for Name: request_status_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_status_log (id, request_id, from_status_id, to_status_id, changed_at, changed_by) FROM stdin;
\.

--

-- Dependencies: 230
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.status (id, tenant_id, code, name, is_active, created_at) FROM stdin;
1	1	RECEIVED	Received	t	2025-11-09 20:49:08.1276-05
2	1	PENDING	Pending	t	2025-11-09 20:49:08.1276-05
3	1	INTEGRATED	Integrated	t	2025-11-09 20:49:08.1276-05
4	1	ERROR	Error	t	2025-11-09 20:49:08.1276-05
5	1	SENT	Sent	t	2025-11-09 20:49:08.1276-05
\.

--

-- Dependencies: 222
-- Data for Name: tenant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenant (id, name, is_active, created_at) FROM stdin;
1	Legion SAS	t	2025-11-09 20:31:11.844851-05
\.

--

-- Dependencies: 234
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, tenant_id, username, full_name, email, password_hash, is_active, created_at) FROM stdin;
1	1	gen	Usuario genérico	gen@example.com		t	2025-11-11 20:04:39.204117-05
\.

--

-- Dependencies: 237
-- Name: attachment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attachment_id_seq', 4, true);

--

-- Dependencies: 225
-- Name: blocket_dynamic_field_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blocket_dynamic_field_id_seq', 55, true);

--

-- Dependencies: 223
-- Name: blocket_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blocket_id_seq', 14, true);

--

-- Dependencies: 219
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_id_seq', 4, true);

--

-- Dependencies: 227
-- Name: channel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.channel_id_seq', 4, true);

--

-- Dependencies: 231
-- Name: customer_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_request_id_seq', 25, true);

--

-- Dependencies: 217
-- Name: process_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.process_id_seq', 5, true);

--

-- Dependencies: 235
-- Name: request_status_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_status_log_id_seq', 1, false);

--

-- Dependencies: 229
-- Name: status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.status_id_seq', 5, true);

--

-- Dependencies: 221
-- Name: tenant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tenant_id_seq', 1, true);

--

-- Dependencies: 233
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 1, false);

--

-- Name: attachment attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachment
    ADD CONSTRAINT attachment_pkey PRIMARY KEY (id);

--

-- Name: blocket_dynamic_field blocket_dynamic_field_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocket_dynamic_field
    ADD CONSTRAINT blocket_dynamic_field_pkey PRIMARY KEY (id);

--

-- Name: blocket blocket_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocket
    ADD CONSTRAINT blocket_pkey PRIMARY KEY (id);

--

-- Name: category category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_name_key UNIQUE (name);

--

-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);

--

-- Name: channel channel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel
    ADD CONSTRAINT channel_pkey PRIMARY KEY (id);

--

-- Name: customer_request customer_request_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_request
    ADD CONSTRAINT customer_request_pkey PRIMARY KEY (id);

--

-- Name: process process_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process
    ADD CONSTRAINT process_name_key UNIQUE (name);

--

-- Name: process process_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.process
    ADD CONSTRAINT process_pkey PRIMARY KEY (id);

--

-- Name: request_status_log request_status_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_status_log
    ADD CONSTRAINT request_status_log_pkey PRIMARY KEY (id);

--

-- Name: status status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT status_pkey PRIMARY KEY (id);

--

-- Name: tenant tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant
    ADD CONSTRAINT tenant_pkey PRIMARY KEY (id);

--

-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);

--

-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);

--

-- Name: user user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);

--

-- Name: idx_attachment_request_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attachment_request_id ON public.attachment USING btree (request_id);

--

-- Name: idx_blocket_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blocket_category_id ON public.blocket USING btree (category_id);

--

-- Name: idx_blocket_dynamic_field_blocket_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blocket_dynamic_field_blocket_id ON public.blocket_dynamic_field USING btree (blocket_id);

--

-- Name: idx_blocket_process_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blocket_process_id ON public.blocket USING btree (process_id);

--

-- Name: idx_blocket_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blocket_tenant_id ON public.blocket USING btree (tenant_id);

--

-- Name: idx_channel_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_channel_code ON public.channel USING btree (code);

--

-- Name: idx_channel_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_channel_tenant_id ON public.channel USING btree (tenant_id);

--

-- Name: idx_customer_request_channel_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_customer_request_channel_id ON public.customer_request USING btree (channel_id);

--

-- Name: idx_customer_request_status_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_customer_request_status_id ON public.customer_request USING btree (status_id);

--

-- Name: idx_customer_request_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_customer_request_tenant_id ON public.customer_request USING btree (tenant_id);

--

-- Name: idx_request_status_log_request_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_request_status_log_request_id ON public.request_status_log USING btree (request_id);

--

-- Name: idx_status_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_status_code ON public.status USING btree (code);

--

-- Name: idx_status_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_status_tenant_id ON public.status USING btree (tenant_id);

--

-- Name: idx_tenant_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tenant_name ON public.tenant USING btree (name);

--

-- Name: idx_user_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_tenant_id ON public."user" USING btree (tenant_id);

--

-- Name: attachment attachment_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachment
    ADD CONSTRAINT attachment_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.customer_request(id) ON DELETE CASCADE;

--

-- Name: attachment attachment_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachment
    ADD CONSTRAINT attachment_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public."user"(id);

--

-- Name: blocket blocket_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocket
    ADD CONSTRAINT blocket_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id);

--

-- Name: blocket_dynamic_field blocket_dynamic_field_blocket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocket_dynamic_field
    ADD CONSTRAINT blocket_dynamic_field_blocket_id_fkey FOREIGN KEY (blocket_id) REFERENCES public.blocket(id) ON DELETE CASCADE;

--

-- Name: blocket blocket_process_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocket
    ADD CONSTRAINT blocket_process_id_fkey FOREIGN KEY (process_id) REFERENCES public.process(id);

--

-- Name: blocket blocket_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocket
    ADD CONSTRAINT blocket_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE;

--

-- Name: channel channel_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel
    ADD CONSTRAINT channel_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE;

--

-- Name: customer_request customer_request_channel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_request
    ADD CONSTRAINT customer_request_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channel(id);

--

-- Name: customer_request customer_request_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_request
    ADD CONSTRAINT customer_request_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.status(id);

--

-- Name: customer_request customer_request_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_request
    ADD CONSTRAINT customer_request_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE;

--

-- Name: request_status_log request_status_log_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_status_log
    ADD CONSTRAINT request_status_log_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public."user"(id);

--

-- Name: request_status_log request_status_log_from_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_status_log
    ADD CONSTRAINT request_status_log_from_status_id_fkey FOREIGN KEY (from_status_id) REFERENCES public.status(id);

--

-- Name: request_status_log request_status_log_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_status_log
    ADD CONSTRAINT request_status_log_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.customer_request(id) ON DELETE CASCADE;

--

-- Name: request_status_log request_status_log_to_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_status_log
    ADD CONSTRAINT request_status_log_to_status_id_fkey FOREIGN KEY (to_status_id) REFERENCES public.status(id);

--

-- Name: status status_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT status_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE;

--

-- Name: user user_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE;

-- Completed on 2025-11-16 22:44:46

--
-- PostgreSQL database dump complete
--