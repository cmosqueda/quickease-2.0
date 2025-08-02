# QuickEase 2.0 (Mobile)

This directory serves the mobile client-side of our study named `QuickEase 2.0`, rewritten from scratch using Expo with other libraries.

## FAQs

1. Why did you rewrite the entire mobile front-end?
   Kay kapoy mu-basa og laing source code nga walay halos documentations and di ko ganahan sa design atong front-end sa 1.0 version.

2. When trying to run the `npm i` or `npm install` command, it throws an error that says something about package dependencies conflict on their versions.
   Solution is to install the modules by adding the `--force-legacy-deps` parameter, if it still won't install then contact the developer `(Jhon Lloyd Viernes)`

3. .env file?
   `EXPO_PUBLIC_SERVER_API_URL: string`

## Libraries Used

```
Expo and its other modules, immer, NativeWind, prettier-plugin-tailwindcss, zod, zustand
```

## Coding rules

1. Creating function/arrow functions
   Always define types for function arguments to ensure proper data typing and use snake_case.

   ```
   Example:
   type A = {
   user: string;
   created_at: string | Date;
   }

   function createA({user} : A) {}
   function createA({user, created_at} : {user: string, created_at: string | Date}) {}

   const createB = ({user} : A) => {}
   const createB = ({user, created_at} : {user: string, created_at: string | Date}) => {}
   ```

2. Avoid modifying CSS `(@/globals.css)` unless necessary
   Avoid directly modifying `@/globals.css` unless absolutely necessary. The use of NativeWind is intended to never use `stylesheet`. Only modify this file for:
   - Custom media queries
   - Animations
   - Theme integrations (see above)
     If you're unfamiliar with Tailwind CSS or daisyUI, please refer to their documentation before attempting to write custom styles.

3. Avoid modifying configuration files.
   Please contact your main developer `(Jhon Lloyd Viernes)` and let him handle it instead to avoid any conflicts on configurations to ensure anything's working fine.

   ```
      Files to be avoided
      - @/app.json
      - @/babel.config.js
      - @/eslint.config.js
      - @/metro.config.js
      - @/tailwind.config.js
      - @/tsconfig.json
      - @/tsconfig.app.json
      - @/package.json
   ```

4. Please use Prettier or any other document-formatting extension to properly format the code.
   To ensure proper formatting on the client-side code, please install & use Prettier/ESLint plugin on VS Code.

   ```
   Plugins/extensions to install & use

   - Prettier
   - ESLint
   - Trailing Spaces
   - Indent Rainbow
   - Color Highlight
   - Auto Rename Tag
   - Auto Close Tag
   - Tailwind CSS IntelliSense
   - Path IntelliSense
   ```

5. When creating components, make sure that you move it to a role directory in which it's used or belongs to.
   For easy editing and less hassle.

   ```
   Example:
   There are two sidebar, one is for the (admin) and (user).
   If you're creating a component for the Users, then make sure the said component is at the @/components/(user) folder.
   ```

6. When creating global state managements using Zustand, make sure it always uses `persist` and `immer` plugin.
   This is necessary. Especially for nested arrays.