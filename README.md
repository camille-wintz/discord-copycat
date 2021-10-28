# React autocomplete skill test

## Start

npm run dev

## Deliverable

A react textarea component that has a Discord-like users and channels autocomplete + formatting

## Specs

- Search for a user and a channel as displayed in the sketch
- Store users and channels badges as `<#{channel_id}>` and `<&{user_id}>` on the underlying textarea value
- Ability to browse options using arrow keys + ability to select an option by pressing on the RETURN key
- Pressing ESC or SPACE should collapse the autocomplete popup
- Surrounding a text by ** and ** should display the text in bold

For any edgecases that aren't visible on the sketch file, please follow the Discord implementation.

## Data to play with

```json
{
  "channels": [
    {
      "id": "611014873639550999",
      "name": "présentations"
    },
    {
      "id": "571286115739238410",
      "name": "dev-test"
    },
    {
      "id": "675919773607002148",
      "name": "dev-room"
    },
    {
      "id": "572532173056507905",
      "name": "streams-announcements"
    },
    {
      "id": "656504373290991643",
      "name": "party"
    }
  ],
  "users": [
    {
      "id": "258258856189231104",
      "username": "Brendan",
      "discriminator": "1234"
    },
    {
      "id": "138362511190786048",
      "username": "Brendon",
      "discriminator": "4321"
    },
    {
      "id": "103559217914318848",
      "username": "JohnL",
      "discriminator": "3234"
    },
    {
      "id": "759336655478849578",
      "username": "JohnD",
      "discriminator": "4322"
    }
  ]
}
```
