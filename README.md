## roastify

roastify is a musictaste roaster, this will basically take your spotify account and then roast your taste in music,
it will take your top artists and tracks and will roast your taste accordingly

> Uvicorn server (hopefully) running on http://0.0.0.0:8000

> Don't really know what is up with the frontend, so just uploading the code here in case it fks my system up

## Repo structure

```
/roastify
├── backend
│   ├── main.py
│   ├── requirements.txt
│   └── test.py
├── frontend
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   ├── next-env.d.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.mjs
│   ├── public
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── README.md
│   ├── src
│   │   ├── app
│   │   │   ├── api
│   │   │   │   └── auth
│   │   │   │       └── [...nextauth]
│   │   │   │           └── route.ts
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── auth.ts
│   │   └── components
│   │       ├── LoginButton.tsx
│   │       └── roaster.tsx
│   └── tsconfig.json
└── README.md
```

### features

it will:
- roast your taste in music
- share your taste on x
- compatibility meter

so yeah WIP, stay tunedddd!!!!

### P.N.

- figure authorisation
- design the frontend
- sharing the roast part