# build-your-own-backend

### Database used

[Open Beer DB](https://openbeerdb.com/)

## Endpoints

- **[<code>GET</code> categories](https://byod-beers.herokuapp.com/api/v1/categories)**
- **[<code>GET</code> categories/:id](https://byod-beers.herokuapp.com/api/v1/categories/7)**
- **[<code>GET</code> styles](https://byod-beers.herokuapp.com/api/v1/styles)**
- **[<code>GET</code> styles/:id](https://byod-beers.herokuapp.com/api/v1/styles/25)**
- **[<code>GET</code> breweries](https://byod-beers.herokuapp.com/api/v2/breweries)**
- **[<code>GET</code> breweries/:id](https://byod-beers.herokuapp.com/api/v2/breweries/250)**
- **[<code>GET</code> breweries/:id/beers](https://byod-beers.herokuapp.com/api/v2/breweries/14/beers)**
- **[<code>GET</code> beers](https://byod-beers.herokuapp.com/api/v2/beers)**
- **[<code>GET</code> beers/:id](https://byod-beers.herokuapp.com/api/v2/beers/300)**
- **[<code>GET</code> beers?category](https://byod-beers.herokuapp.com/api/v2/beers?category=North%20American%20Ale)**
- **[<code>GET</code> beers?style](https://byod-beers.herokuapp.com/api/v2/beers?style=American-Style%20Pale%20Ale)**

* All POST/PUT/DELETE/PATCH endpoints are protected by JWT's

- **[<code>POST</code> categories](https://byod-beers.herokuapp.com/api/v1/categories)**
- Allows the user to add a new beer category by passing though `name` in the request body.
- **[<code>POST</code> styles](https://byod-beers.herokuapp.com/api/v1/styles)**
- Allows the user to add a new beer style by passing though `name` and `category_id` in the request body.
- **[<code>POST</code> beers](https://byod-beers.herokuapp.com/api/v2/breweries)**
- Allows the user to add a new beer by passing though `name`, `cat_id` & `style_id` in the request body.
- **[<code>POST</code> breweries](https://byod-beers.herokuapp.com/api/v2/beers)**
- Allows the user to add a new brewery by passing though `name`, `address1`, `city`, `state`, `code` & `country` in the request body.
- **[<code>DELETE</code> categories/:id](https://byod-beers.herokuapp.com/api/v1/categories)**
- Allows the user to delete an existing beer category by passing though the beer category ID in the request body.
- **[<code>DELETE</code> beers/:id](https://byod-beers.herokuapp.com/api/v2/beers)**
- Allows the user to delete an existing beer by passing though the beer ID in the request body.
- **[<code>PATCH</code> styles/:id](https://byod-beers.herokuapp.com/api/v1/styles)**
- Allows the user to update an existing beer style by passing either `name` or beer `category_id` in the request body.
- **[<code>PATCH</code> breweries/:id](https://byod-beers.herokuapp.com/api/v2/breweries)**
- Allows the user to update an existing brewery by passing either `name`, `address1`, `city`, `state`, `code`, or `country` in the request body.
- **[<code>PUT</code> categories/:id](https://byod-beers.herokuapp.com/api/v1/categories)**
- Allows the user to update an existing beer category by passing `name` in the request body.
- **[<code>PUT</code> beers/:id](https://byod-beers.herokuapp.com/api/v2/beers)**
- Allows the user to update an existing beer style by passing `name`, `cat_id`, `style_id` & `brewery_id` in the request body.

## Tables

#### Categories

| id            | category_id   | name               |
| ------------- |--------------:| ------------------:|
| 1             | 1             | British Ale        |
| 2             | 2             | Irish Ale          |
| 3             | 3             | North American Ale |

#### Styles

| id            | style_id      | name                          | category_id   |
| ------------- |--------------:| -----------------------------:|--------------:|
| 1             | 1             | New Classic Style of Pale Ale | 1             |
| 2             | 2             | Ordinary Bitter               | 1             |
| 3             | 3             | English-Style India Pale Ale  | 1             |


#### Beers

| id            | beer_id       | name                          | cat_id        | style_id     | brewery_id   |
| ------------- |--------------:| -----------------------------:|--------------:|-------------:|-------------:|
| 1             | 1             | Hocus Pocus                   | 11            | 116          | 812          |
| 2             | 2             | Grimbergen Blonde             | null          | null         | 264          |
| 3             | 3             | Widdershins Barleywine        | null          | null         | 779          |


#### Breweries

| id   | brewery_id | name                        | address1          | city          | state      | code     |country  |
| -----|-----------:| ---------------------------:|------------------:|--------------:|-----------:|---------:|--------:|
| 1    | 1          | (512) Brewing Company       | 407 Radam, F200   | Austin        | Texas      | 78745    | US      |
| 2    | 2          | 21st Amendment Brewery Cafe | 563 Second Street | San Francisco | California | 94107    | US      |
| 3    | 3          | 3 Fonteinen Brouwerij       | Hoogstraat 2A     | Beersel       | null       | null     | Belgium |
