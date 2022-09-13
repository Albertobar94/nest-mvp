[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
</p>

## Description

Take Home Challenge
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Entities
#### User
```
                                     Table "public.user"
  Column  |          Type          | Collation | Nullable |             Default              
----------+------------------------+-----------+----------+----------------------------------
 id       | integer                |           | not null | nextval('user_id_seq'::regclass)
 username | character varying(256) |           | not null | 
 password | character varying(32)  |           | not null | 
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
```
## License

Nest is [MIT licensed](LICENSE).

