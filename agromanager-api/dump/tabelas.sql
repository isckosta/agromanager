-- public.culturas definition

-- Drop table

-- DROP TABLE public.culturas;

CREATE TABLE public.culturas (
	id serial4 NOT NULL,
	nome varchar(100) NOT NULL,
	CONSTRAINT culturas_pkey PRIMARY KEY (id)
);


-- public.estado definition

-- Drop table

-- DROP TABLE public.estado;

CREATE TABLE public.estado (
	id serial4 NOT NULL,
	codigouf int4 NOT NULL,
	nome varchar(50) NOT NULL,
	uf bpchar(2) NOT NULL,
	regiao int4 NOT NULL,
	CONSTRAINT estado_pkey PRIMARY KEY (id)
);


-- public.municipio definition

-- Drop table

-- DROP TABLE public.municipio;

CREATE TABLE public.municipio (
	id serial4 NOT NULL,
	codigo int4 NOT NULL,
	nome varchar(255) NOT NULL,
	uf bpchar(2) NOT NULL,
	CONSTRAINT municipio_pkey PRIMARY KEY (id)
);


-- public.produtores definition

-- Drop table

-- DROP TABLE public.produtores;

CREATE TABLE public.produtores (
	id serial4 NOT NULL,
	cpf_cnpj varchar(14) NOT NULL,
	nome_produtor varchar(255) NOT NULL,
	CONSTRAINT produtores_cpf_cnpj_key UNIQUE (cpf_cnpj),
	CONSTRAINT produtores_pkey PRIMARY KEY (id)
);


-- public.fazendas definition

-- Drop table

-- DROP TABLE public.fazendas;

CREATE TABLE public.fazendas (
	id serial4 NOT NULL,
	nome_fazenda varchar(255) NOT NULL,
	produtor_id int4 NULL,
	municipio_id int4 NULL,
	area_total numeric(10, 2) NOT NULL,
	area_agricultavel numeric(10, 2) NULL,
	area_vegetacao numeric(10, 2) NULL,
	CONSTRAINT fazendas_pkey PRIMARY KEY (id),
	CONSTRAINT fazendas_municipio_id_fkey FOREIGN KEY (municipio_id) REFERENCES public.municipio(id) ON DELETE CASCADE,
	CONSTRAINT fazendas_produtor_id_fkey FOREIGN KEY (produtor_id) REFERENCES public.produtores(id) ON DELETE CASCADE
);


-- public.fazenda_culturas definition

-- Drop table

-- DROP TABLE public.fazenda_culturas;

CREATE TABLE public.fazenda_culturas (
	fazenda_id int4 NOT NULL,
	cultura_id int4 NOT NULL,
	CONSTRAINT fazenda_culturas_pkey PRIMARY KEY (fazenda_id, cultura_id),
	CONSTRAINT fazenda_culturas_cultura_id_fkey FOREIGN KEY (cultura_id) REFERENCES public.culturas(id) ON DELETE CASCADE,
	CONSTRAINT fazenda_culturas_fazenda_id_fkey FOREIGN KEY (fazenda_id) REFERENCES public.fazendas(id) ON DELETE CASCADE
);