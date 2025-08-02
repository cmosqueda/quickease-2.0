# QuickEase 2.0

This directory serves the client-side of our study named `QuickEase 2.0`, rewritten from scratch using React + Vite and other libraries.

## FAQs

1. Why did you rewrite the entire web front-end?
   Kay kapoy mu-basa og laing source code nga walay halos documentations and di ko ganahan sa design atong front-end sa 1.0 version. **And I despise Redux to the core.**

2. When trying to run the `npm i` or `npm install` command, it throws an error that says something about package dependencies conflict on their versions.
   Solution is to install the modules by adding the `--force-legacy-deps` parameter, if it still won't install then contact the developer `(Jhon Lloyd Viernes)`

3. .env file?
   `SERVER_API_URL: string`

## Libraries Used

```
  React, Vite, CLSX, daisyUI, tailwindCSS, sonner, tailwind-merge, zod, react-router
```

## Creating custom themes

To create and integrate a new custom theme:

- Use the [daisyUI's theme generator](https://daisyui.com/theme-generator/) to design your theme
- Add the theme name to the type/enum in `@/src/types/theme.ts`
- Copy the generated CSS and paste it into `@/global.css` and please make sure it's properly formatted.
- Your new theme will be available in the theme box.

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

2. Avoid modifying CSS `(@/global.css)` unless necessary
   Avoid directly modifying `@/global.css` unless absolutely necessary. The combination of Tailwind CSS and daisyUI is intended to eliminate most needs for custom CSS. Only modify this file for:
   - Custom media queries
   - Animations
   - Theme integrations (see above)
     If you're unfamiliar with Tailwind CSS or daisyUI, please refer to their documentation before attempting to write custom styles.

3. Avoid modifying configuration files.
   Please contact your main developer `(Jhon Lloyd Viernes)` and let him handle it instead to avoid any conflicts on configurations to ensure anything's working fine.

   ```
      Files to be avoided
      - @/vite.config.ts
      - @/tsconfig.json
      - @/tsconfig.app.json
      - @/package.json
      - @/global.css (If you're adding a custom theme, simply follow the steps above on Creating a custom theme section.)
      - @/index.html
      - @/eslint.config.js
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
