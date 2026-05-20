-- public."comment" definition

-- Drop table

-- DROP TABLE public."comment";

CREATE TABLE public."comment" (
	id serial4 NOT NULL,
	token_address varchar(255) NOT NULL, -- 代币地址
	creator_address varchar(255) NOT NULL, -- 评论人地址
	comment_content json NOT NULL, -- 评论内容
	created_at timestamp(0) NULL,
	updated_at timestamp(0) NULL,
	deleted_at timestamp(0) NULL,
	CONSTRAINT comment_pkey PRIMARY KEY (id)
);
CREATE INDEX token_adderss_idx ON public.comment USING btree (token_address);

-- Column comments

COMMENT ON COLUMN public."comment".token_address IS '代币地址';
COMMENT ON COLUMN public."comment".creator_address IS '评论人地址';
COMMENT ON COLUMN public."comment".comment_content IS '评论内容';


-- public.holders definition

-- Drop table

-- DROP TABLE public.holders;

CREATE TABLE public.holders (
	id serial4 NOT NULL,
	creator_address varchar(255) NOT NULL, -- 持有人地址
	token_address varchar(255) NOT NULL, -- 代币地址
	balance int8 NOT NULL, -- 持仓
	"cost" int8 NOT NULL, -- 买入交易使用的代币总量
	sold int8 NOT NULL, -- 卖出交易使用的代币总量
	created_at timestamp(0) NULL,
	updated_at timestamp(0) NULL,
	deleted_at timestamp(0) NULL,
	token_balance int8 NULL,
	CONSTRAINT holders_pkey PRIMARY KEY (id)
);
CREATE INDEX member_address_idx ON public.holders USING btree (creator_address);
CREATE INDEX token_address_idx ON public.holders USING btree (token_address);

-- Column comments

COMMENT ON COLUMN public.holders.creator_address IS '持有人地址';
COMMENT ON COLUMN public.holders.token_address IS '代币地址';
COMMENT ON COLUMN public.holders.balance IS '持仓';
COMMENT ON COLUMN public.holders."cost" IS '买入交易使用的代币总量';
COMMENT ON COLUMN public.holders.sold IS '卖出交易使用的代币总量';


-- public.liquidity_pools definition

-- Drop table

-- DROP TABLE public.liquidity_pools;

CREATE TABLE public.liquidity_pools (
	id serial4 NOT NULL,
	token0_id int8 NOT NULL, -- 为0时，代表原生token，需要查token表的chain_id来确定
	token1_id int8 NOT NULL, -- 为0时，代表原生token，需要查token表的chain_id来确定
	reserve0 int8 NOT NULL, -- token0池子流动量
	reserve1 int8 NOT NULL, -- token1池子流动量
	created_at timestamp(6) NULL,
	updated_at timestamp(6) NULL,
	deleted_at timestamp(6) NULL,
	CONSTRAINT liquidity_pools_pkey PRIMARY KEY (id)
);

-- Column comments

COMMENT ON COLUMN public.liquidity_pools.token0_id IS '为0时，代表原生token，需要查token表的chain_id来确定';
COMMENT ON COLUMN public.liquidity_pools.token1_id IS '为0时，代表原生token，需要查token表的chain_id来确定';
COMMENT ON COLUMN public.liquidity_pools.reserve0 IS 'token0池子流动量';
COMMENT ON COLUMN public.liquidity_pools.reserve1 IS 'token1池子流动量';


-- public.members definition

-- Drop table

-- DROP TABLE public.members;

CREATE TABLE public.members (
	id serial4 NOT NULL,
	creator_address varchar(255) NOT NULL,
	member_name varchar(255) NOT NULL,
	picture_url varchar(255) NOT NULL,
	member_status int2 DEFAULT 0 NOT NULL,
	chain_id varchar(20) NOT NULL,
	created_at timestamp(0) NULL,
	updated_at timestamp(0) NULL,
	deleted_at timestamp(0) NULL,
	CONSTRAINT members_pkey PRIMARY KEY (id)
);
CREATE INDEX address_idx ON public.members USING btree (creator_address);


-- public."token" definition

-- Drop table

-- DROP TABLE public."token";

CREATE TABLE public."token" (
	id serial4 NOT NULL,
	token_name varchar(50) NOT NULL, -- token名字
	chain_id varchar(20) NOT NULL, -- 链id
	token_logo varchar(255) NOT NULL, -- token图片
	token_ticker varchar(50) NOT NULL,
	token_describe varchar(255) NULL, -- token简洁
	auction_time varchar(255) NOT NULL, -- 拍卖周期
	web_site varchar(255) NULL,
	twitter_url varchar(255) NULL,
	telegram_url varchar(255) NULL,
	token_address varchar(255) NULL, -- token地址
	farcaster varchar(255) NULL, -- base链特有，其余为空
	total_supply varchar(255) NULL, -- 发行总量
	start_block int8 NULL, -- 起始区块
	end_block int8 NULL, -- 结束区块
	dev_purchase int8 NULL, -- 开发者比例，÷10000
	initial_liquidity int8 NULL, -- 初始流动比例，÷10000
	token_price numeric(40, 20) DEFAULT 0 NULL, -- 代币价格
	view_count int8 NULL, -- 浏览量
	token_released int8 NULL, -- 已释放量
	pair_address varchar(255) NULL, -- 交易对地址
	creator_address varchar(255) NULL, -- 发币地址
	fee int8 NULL,
	created_at timestamp(0) NULL,
	updated_at timestamp(0) NULL,
	deleted_at timestamp(0) NULL,
	"token_releasePerBlock" int8 NULL,
	CONSTRAINT token_pkey PRIMARY KEY (id)
);
CREATE INDEX member_address ON public.token USING btree (creator_address);
CREATE INDEX token_address ON public.token USING btree (token_address);

-- Column comments

COMMENT ON COLUMN public."token".token_name IS 'token名字';
COMMENT ON COLUMN public."token".chain_id IS '链id';
COMMENT ON COLUMN public."token".token_logo IS 'token图片';
COMMENT ON COLUMN public."token".token_describe IS 'token简洁';
COMMENT ON COLUMN public."token".auction_time IS '拍卖周期';
COMMENT ON COLUMN public."token".token_address IS 'token地址';
COMMENT ON COLUMN public."token".farcaster IS 'base链特有，其余为空';
COMMENT ON COLUMN public."token".total_supply IS '发行总量';
COMMENT ON COLUMN public."token".start_block IS '起始区块';
COMMENT ON COLUMN public."token".end_block IS '结束区块';
COMMENT ON COLUMN public."token".dev_purchase IS '开发者比例，÷10000';
COMMENT ON COLUMN public."token".initial_liquidity IS '初始流动比例，÷10000';
COMMENT ON COLUMN public."token".token_price IS '代币价格';
COMMENT ON COLUMN public."token".view_count IS '浏览量';
COMMENT ON COLUMN public."token".token_released IS '已释放量';
COMMENT ON COLUMN public."token".pair_address IS '交易对地址';
COMMENT ON COLUMN public."token".creator_address IS '发币地址';


-- public.trade definition

-- Drop table

-- DROP TABLE public.trade;

CREATE TABLE public.trade (
	id serial4 NOT NULL,
	act int2 NOT NULL, -- 1 sell 2buy
	trade_amount int8 NOT NULL, -- 交易的原生代币数量
	token_amount int8 NOT NULL, -- 交易的代币数量
	tx_hash varchar(255) NOT NULL, -- 交易hash
	token_address varchar(255) NOT NULL,
	creator_address varchar(255) NOT NULL,
	fee int8 NOT NULL,
	created_at timestamp(0) NULL,
	updated_at timestamp(0) NULL,
	deleted_at timestamp(0) NULL,
	slot int8 NOT NULL,
	native_reserves int8 NULL,
	token_reserves int8 NULL,
	usd_price numeric(30, 11) NULL, -- 美元计价
	state int2 DEFAULT 0 NULL, -- 状态
	CONSTRAINT trade_pkey PRIMARY KEY (id)
);
CREATE INDEX token_member_address_idx ON public.trade USING btree (token_address, creator_address);

-- Column comments

COMMENT ON COLUMN public.trade.act IS '1 sell 2buy';
COMMENT ON COLUMN public.trade.trade_amount IS '交易的原生代币数量';
COMMENT ON COLUMN public.trade.token_amount IS '交易的代币数量';
COMMENT ON COLUMN public.trade.tx_hash IS '交易hash';
COMMENT ON COLUMN public.trade.usd_price IS '美元计价';
COMMENT ON COLUMN public.trade.state IS '状态';


-- public.watch definition

-- Drop table

-- DROP TABLE public.watch;

CREATE TABLE public.watch (
	id serial4 NOT NULL,
	creator_address varchar(255) NOT NULL,
	token_address varchar(255) NOT NULL,
	created_at timestamp(0) NULL,
	updated_at timestamp(0) NULL,
	deleted_at timestamp(0) NULL,
	CONSTRAINT watch_pkey PRIMARY KEY (id)
);