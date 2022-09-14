# Vending Machine MVP Challenge


## Running the services

```bash
docker compose up --buid
```
> This is the only supported way of running the Nest.js server, PostgreSQL and Redis concurrently.

## Postman collection
inside postman folder
```
cd ./postman
```

## Using the App
1. Create a user using POST /user
2. Login with credentials POST /auth/login (any username and password is accepted)
3. Take the accessToken and use it as bearer token
4. Call other endpoints following the challenge requirements

## Running locally

```
docker run --name redis -p 6379:6379 -d --rm redis   
docker run --rm \
    --name nest-db-mvp \
    -e 'POSTGRES_PASSWORD=postgres' \
    -e 'POSTGRES_USER=postgres' \
    -e 'POSTGRES_DB=postgres' \
    -p 5432:5432 \
    -d postgres:12-alpine
pnpm run db:up
pnpm run start:dev
```

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Entities
#### User
```
                                     Table "public.user"
  Column  |          Type          | Collation | Nullable |             Default              
----------+------------------------+-----------+----------+----------------------------------
 id       | integer                |           | not null | nextval('user_id_seq'::regclass)
 username | character varying(256) |           | not null | 
 password | text                   |           | not null | 
 role     | text                   |           | not null | 
 deposit  | integer                |           | not null | 0
Indexes:
    "user_pkey" PRIMARY KEY, btree (id)
    "user_username_unique" UNIQUE CONSTRAINT, btree (username)
Check constraints:
    "user_deposit_check" CHECK (deposit >= 0 AND deposit <= '9007199254740991'::bigint)
    "user_role_check" CHECK (role = ANY (ARRAY['seller'::text, 'buyer'::text]))
Referenced by:
    TABLE "product" CONSTRAINT "product_seller_id_foreign" FOREIGN KEY (seller_id) REFERENCES "user"(id) ON DELETE CASCADE
    TABLE "purchase" CONSTRAINT "purchase_buyer_id_foreign" FOREIGN KEY (buyer_id) REFERENCES "user"(id) ON DELETE SET NULL
    TABLE "purchase" CONSTRAINT "purchase_seller_id_foreign" FOREIGN KEY (seller_id) REFERENCES "user"(id) ON DELETE SET NULL
```
#### Product
```
                                 Table "public.product"
      Column      |  Type   | Collation | Nullable |               Default               
------------------+---------+-----------+----------+-------------------------------------
 id               | bigint  |           | not null | nextval('product_id_seq'::regclass)
 name             | text    |           | not null | 
 cost             | integer |           | not null | 0
 amount_available | integer |           | not null | 0
 seller_id        | integer |           | not null | 
Indexes:
    "product_pkey" PRIMARY KEY, btree (id)
Check constraints:
    "chk_is_seller" CHECK (is_seller(seller_id))
    "product_amount_available_check" CHECK (amount_available >= 0 AND amount_available <= '9007199254740991'::bigint)
    "product_cost_check" CHECK (cost >= 0 AND cost <= '9007199254740991'::bigint)
Foreign-key constraints:
    "product_seller_id_foreign" FOREIGN KEY (seller_id) REFERENCES "user"(id) ON DELETE CASCADE
Referenced by:
    TABLE "purchase" CONSTRAINT "purchase_item_id_foreign" FOREIGN KEY (item_id) REFERENCES product(id) ON DELETE SET NULL
```

#### Purchase
```
                                  Table "public.purchase"
   Column    |  Type   | Collation | Nullable |               Default                
-------------+---------+-----------+----------+--------------------------------------
 id          | bigint  |           | not null | nextval('purchase_id_seq'::regclass)
 total       | integer |           | not null | 
 item_name   | text    |           | not null | 
 item_id     | integer |           |          | 
 item_cost   | integer |           | not null | 0
 items_total | integer |           | not null | 0
 buyer_id    | integer |           |          | 
 seller_id   | integer |           |          | 
Indexes:
    "purchase_pkey" PRIMARY KEY, btree (id)
Check constraints:
    "chk_is_buyer" CHECK (is_buyer(buyer_id) OR buyer_id IS NULL)
    "chk_is_seller" CHECK (is_seller(seller_id) OR seller_id IS NULL)
    "purchase_item_cost_check" CHECK (item_cost >= 0 AND item_cost <= '9007199254740991'::bigint)
    "purchase_items_total_check" CHECK (items_total >= 0 AND items_total <= '9007199254740991'::bigint)
    "purchase_total_check" CHECK (total >= 0 AND total <= '9007199254740991'::bigint)
Foreign-key constraints:
    "purchase_buyer_id_foreign" FOREIGN KEY (buyer_id) REFERENCES "user"(id) ON DELETE SET NULL
    "purchase_item_id_foreign" FOREIGN KEY (item_id) REFERENCES product(id) ON DELETE SET NULL
    "purchase_seller_id_foreign" FOREIGN KEY (seller_id) REFERENCES "user"(id) ON DELETE SET NULL
```

## License

Nest is [MIT licensed](LICENSE).

