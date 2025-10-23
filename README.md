# savecanto_map

# Google Apps Script Backend

This is the backend API for SaveCanto Map, built with Google Apps Script.

## Getting Started

First, install clasp (Google Apps Script CLI):

```bash
npm install -g @google/clasp
```

Then, enable the Apps Script API:

1. Visit https://script.google.com/home/usersettings
2. Toggle ON "Google Apps Script API"

Login and create your project:

```bash
clasp login
clasp create --title "SaveCanto Map" --type standalone
```

Push your code to Apps Script:

```bash
clasp push
```

Your API is now deployed! Get your test URL from https://script.google.com → Deploy → Test deployments.

The test URL will look like: `https://script.google.com/macros/s/.../dev`

## Development

You can start editing the API by modifying `src/Code.js`. After making changes, push updates:

```bash
clasp push
```

The `/dev` endpoint automatically uses your latest code without redeploying.
