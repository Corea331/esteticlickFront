# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```
esteticlickFront
├─ app.json
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ favicon.ico
├─ README.md
├─ scripts
│  └─ check-env.js
├─ src
│  ├─ apis
│  │  ├─ apicore.js
│  │  ├─ auth.js
│  │  ├─ bloborganizer.js
│  │  ├─ bussinesmetrics.js
│  │  ├─ contactmessage.js
│  │  ├─ dashboard.js
│  │  ├─ index.js
│  │  ├─ owners.js
│  │  ├─ profile.js
│  │  ├─ queryclient.js
│  │  ├─ reviews.js
│  │  ├─ services.js
│  │  ├─ session.js
│  │  ├─ tenant.js
│  │  ├─ users.js
│  │  └─ vercelblob.js
│  ├─ app.css
│  ├─ App.jsx
│  ├─ assets
│  │  └─ logo.png
│  ├─ components
│  │  ├─ accordion
│  │  │  ├─ accordion.css
│  │  │  └─ accordion.jsx
│  │  ├─ footer
│  │  │  ├─ footer.css
│  │  │  └─ footer.jsx
│  │  ├─ generictable
│  │  │  ├─ generictable.css
│  │  │  └─ generictable.jsx
│  │  ├─ header
│  │  │  ├─ header.css
│  │  │  └─ header.jsx
│  │  ├─ layout
│  │  │  ├─ layout.css
│  │  │  └─ layout.jsx
│  │  ├─ modalcontacto
│  │  │  ├─ modalcontacto.css
│  │  │  └─ modalcontacto.jsx
│  │  ├─ navigationhandler.jsx
│  │  ├─ presentationcarousel
│  │  │  ├─ presentationcarousel.css
│  │  │  └─ presentationcarousel.jsx
│  │  ├─ profile
│  │  │  ├─ avataruploader.jsx
│  │  │  ├─ components
│  │  │  │  ├─ profileavatar
│  │  │  │  │  ├─ profileavatar.css
│  │  │  │  │  └─ profileavatar.jsx
│  │  │  │  ├─ profileedit
│  │  │  │  │  ├─ profileedit.css
│  │  │  │  │  └─ profileedit.jsx
│  │  │  │  ├─ profileinfo
│  │  │  │  │  ├─ profileinfo.css
│  │  │  │  │  └─ profileinfo.jsx
│  │  │  │  ├─ profilelayout
│  │  │  │  │  ├─ profilelayout.css
│  │  │  │  │  └─ profilelayout.jsx
│  │  │  │  └─ profilesidebar
│  │  │  │     ├─ profilesidebar.css
│  │  │  │     └─ profilesidebar.jsx
│  │  │  └─ profileform.jsx
│  │  ├─ routes
│  │  │  ├─ privateroute.jsx
│  │  │  └─ publiconlyroute.jsx
│  │  ├─ searchbox
│  │  │  ├─ searchbox.css
│  │  │  └─ searchbox.jsx
│  │  ├─ socialselector
│  │  │  ├─ socialselector.css
│  │  │  └─ socialselector.jsx
│  │  └─ ui
│  │     └─ alert
│  │        ├─ alert.css
│  │        ├─ alert.jsx
│  │        └─ alertcontainer.jsx
│  ├─ context
│  │  ├─ alertcontext.jsx
│  │  └─ authcontext.jsx
│  ├─ hooks
│  │  ├─ index.js
│  │  ├─ useauth.js
│  │  ├─ useavatar.js
│  │  ├─ usebusinessmetrics.js
│  │  ├─ usecontactmessages.js
│  │  ├─ usedashboard.js
│  │  ├─ useowners.js
│  │  ├─ useprofile.js
│  │  ├─ usereviews.js
│  │  ├─ useservices.js
│  │  ├─ usesession.js
│  │  ├─ usetenant.js
│  │  └─ useusers.js
│  ├─ main.jsx
│  ├─ profiledebug
│  │  ├─ profiledebug.css
│  │  └─ profiledebug.jsx
│  ├─ screens
│  │  ├─ business
│  │  │  ├─ businesspage.css
│  │  │  └─ businesspage.jsx
│  │  ├─ dashboard
│  │  │  ├─ dashboard.css
│  │  │  └─ integrateddashboard.jsx
│  │  ├─ home
│  │  │  ├─ home.css
│  │  │  └─ home.jsx
│  │  ├─ login
│  │  │  ├─ login.css
│  │  │  └─ login.jsx
│  │  ├─ profile
│  │  │  ├─ profile.css
│  │  │  └─ profile.jsx
│  │  ├─ services
│  │  │  ├─ servicespage.css
│  │  │  └─ servicespage.jsx
│  │  └─ unauthorized
│  │     ├─ unauthorized.css
│  │     └─ unauthorized.jsx
│  ├─ styles
│  │  ├─ colors.css
│  │  └─ global.css
│  └─ utils
│     ├─ alerthandler.js
│     └─ navigation.js
├─ vercel.json
└─ vite.config.js

```