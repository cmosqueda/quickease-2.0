# QuickEase 2.0

This directory serves the client-side of our study named `QuickEase 2.0`, rewritten from scratch using React + Vite and other libraries.

## Libraries Used

```
React, Vite, CLSX, daisyUI, tailwindCSS, sonner, tailwind-merge, zod, react-router
```

## Steps for making custom themes

First, you must generate theme from daisyUI's theme creator then proceed to the `@/src/types/themes.ts` and add the theme name of your newly created theme. After that, proceed to `@/global.css` and simply copy your generated CSS, then the theme will popup in the theme box.

## Coding rules

1. Creating function/arrow functions
   Please create a type for it to ensure proper data typings and use snake_case.

```
Example:
type A = {
  user: string;
  created_at: string | Date;
}

function createA({user} : A) {} or function createA({user, created_at} : {user: string, created_at: string | Date}) {}
```

2. Avoid modifying CSS `(@/global.css)` unless necessary
   The purpose of using daisyUI & tailwindCSS is to never touch the CSS file unless if necessary or for creating media queries/animations. If you don't know how to style using tailwindCSS/daisyUI then you're better off learning those.

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
